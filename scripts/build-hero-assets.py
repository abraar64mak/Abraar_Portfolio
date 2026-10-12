#!/usr/bin/env python3
"""
Turn the Google Flow intro clip into a seamless looping hero video with a TRANSPARENT background.

    python3 -m venv .venv && .venv/bin/pip install rembg onnxruntime pillow numpy      # once (about 1 GB incl. model)
    .venv/bin/python scripts/build-hero-assets.py path/to/intro.mp4
    .venv/bin/python scripts/build-hero-assets.py intro.mp4 --crop 552:690:371:25      # w:h:x:y, skip auto-detect
    .venv/bin/python scripts/build-hero-assets.py intro.mp4 --photo me.jpg             # ID-card portrait from a photo

Outputs (into ./public):
    hero/hero.webm   VP9 with alpha channel   (Chrome, Edge, Firefox, Android)
    hero/hero.mp4    H.264 on white           (Safari/iOS fallback; the page blends it into the background)
Both are silent by default (pass --voice to keep the audio track). The page shows chat-style messages beside him instead.
    portrait-bust.webp   480x600 ID-card portrait    (only if you pass --photo, or none exists yet)
    og.jpg               1200x630 social preview

What it does
  1. Finds the person, crops head to toe, scales to 768x960.
  2. Trims the silent tail after you stop talking so the loop doesn't dead-air.
  3. Cuts the person out of EVERY frame (rembg), smooths the matte over time, removes the backdrop fringe.
  4. Cross-fades the last 0.5 s into the first 0.5 s (picture and sound, sample-accurate) so the loop has no jump or click.
     Nothing is retimed, so lips stay in sync.
Needs: ffmpeg + ffprobe on PATH, and the Python packages above.
"""
import argparse, json, shutil, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
XF_SEC = 0.5        # cross-fade length
MAX_LEN = 15.0      # never use more than this much of the source
TAIL = 0.7          # keep this long after the last spoken word (must be >= XF_SEC)
OUT_W, OUT_H = 768, 960
SR = 48000


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, **kw)
    if r.returncode:
        sys.exit(f"command failed:\n{' '.join(map(str, cmd))}\n{r.stderr.decode(errors='ignore')[-1500:]}")
    return r


def probe(src):
    j = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", src]).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    num, den = v["r_frame_rate"].split("/")
    return int(v["width"]), int(v["height"]), float(j["format"]["duration"]), float(num) / float(den), any(s["codec_type"] == "audio" for s in j["streams"])


def read_audio(src):
    raw = run(["ffmpeg", "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]).stdout
    return np.frombuffer(raw, np.float32)


def speech_window(x):
    """(start, end) seconds of audible speech."""
    fr = SR // 100
    e = np.sqrt(np.add.reduceat(x[: len(x) // fr * fr] ** 2, np.arange(0, len(x) // fr * fr, fr)) / fr)
    act = np.where(e > max(0.01, 0.05 * np.percentile(e, 99)))[0]
    return act[0] / 100, (act[-1] + 1) / 100


def auto_crop(src, w, h, dur):
    """Find the person (anything that differs from the plain backdrop) and return a 4:5 crop box in source pixels."""
    boxes = []
    for i in range(1, 7):
        raw = run(["ffmpeg", "-v", "error", "-ss", f"{dur * i / 8:.2f}", "-i", src, "-frames:v", "1", "-vf", "scale=480:-2,format=gray", "-f", "rawvideo", "-"]).stdout
        sh = h * 480 // w
        a = np.frombuffer(raw, np.uint8)[: 480 * sh].reshape(sh, 480).astype(np.int16)
        bg = np.median(np.concatenate([a[:, :12].ravel(), a[:, -12:].ravel(), a[:6].ravel()]))
        ys, xs = np.where(np.abs(a - bg) > 24)
        if len(xs) > 400:
            boxes.append((xs.min(), ys.min(), xs.max(), ys.max()))
    if not boxes:
        sys.exit("Could not detect a person. Pass --crop w:h:x:y")
    x0, y0, x1, y1 = (np.median([b[k] for b in boxes]) * w / 480 for k in range(4))
    pad = (y1 - y0) * 0.04
    y0, y1 = max(0, y0 - pad), min(h, y1 + pad)
    ch = y1 - y0
    cw = ch * OUT_W / OUT_H
    cx = (x0 + x1) / 2
    x = min(max(0, cx - cw / 2), w - cw)
    return int(cw) // 2 * 2, int(ch) // 2 * 2, int(x), int(y0)


def refine(a):
    """Harden the soft matte, shrink 1 px to drop the backdrop-coloured fringe, then anti-alias."""
    a = np.clip((a - 0.45) * 4 + 0.5, 0, 1)
    im = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    return np.asarray(im, np.float32) / 255


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--crop", help="w:h:x:y crop box in source pixels")
    ap.add_argument("--photo", help="photo for the ID-card portrait")
    ap.add_argument("--voice", action="store_true", help="keep the voice (default: the hero is silent, with chat-style messages on the page)")
    a = ap.parse_args()
    try:
        from rembg import new_session, remove
    except ImportError:
        sys.exit("This script needs rembg. Run:  python3 -m venv .venv && .venv/bin/pip install rembg onnxruntime pillow numpy")

    src = str(Path(a.video).resolve())
    w, h, dur, fps, has_audio = probe(src)
    audio = read_audio(src) if has_audio else None
    T = min(MAX_LEN, dur)
    if audio is not None:
        s0, s1 = speech_window(audio)
        T = min(T, max(s1 + TAIL, 3.0))
        print(f"speech {s0:.2f}s to {s1:.2f}s -> using the first {T:.2f}s of {dur:.1f}s")
        if s0 < XF_SEC:
            print("  note: speech starts inside the cross-fade; leave about half a second of silence at the start for a cleaner loop")
    n = int(round(T * fps))
    xf = max(2, int(round(XF_SEC * fps)))
    cw, ch, cx, cy = map(int, a.crop.split(":")) if a.crop else auto_crop(src, w, h, dur)
    print(f"source {w}x{h} @ {fps:g} fps | crop {cw}x{ch} at {cx},{cy} | {n} frames, {xf}-frame cross-fade")

    (PUB / "hero").mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        # 1. frames
        run(["ffmpeg", "-y", "-v", "error", "-i", src, "-frames:v", str(n), "-vf", f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos", td / "f_%04d.png"])
        files = sorted(td.glob("f_*.png"))[:n]
        n = len(files)

        # 2. matte every frame
        sess = new_session("isnet-general-use")
        rgb, alpha = [], []
        for i, f in enumerate(files):
            im = Image.open(f).convert("RGB")
            m = remove(im, session=sess)
            alpha.append(np.asarray(m, np.uint8)[:, :, 3].astype(np.float32) / 255)
            rgb.append(np.asarray(im, np.uint8))
            if i % 20 == 0:
                print(f"  matting {i + 1}/{n}", flush=True)
        # smooth the matte over time (kills edge flicker), then clean the edge
        sm = [refine((0.25 * alpha[max(i - 1, 0)] + 0.5 * alpha[i] + 0.25 * alpha[min(i + 1, n - 1)])) for i in range(n)]
        frames = [np.dstack([rgb[i], (sm[i] * 255).astype(np.uint8)]) for i in range(n)]

        # 3. seamless loop on RGBA (premultiplied blend)
        out = frames[xf : n - xf]
        for i in range(xf):
            wt = (i + 1) / (xf + 1)
            f1, f2 = frames[n - xf + i].astype(np.float32), frames[i].astype(np.float32)
            a1, a2 = f1[:, :, 3:] / 255, f2[:, :, 3:] / 255
            pa = (1 - wt) * a1 + wt * a2
            pc = ((1 - wt) * f1[:, :, :3] * a1 + wt * f2[:, :, :3] * a2) / np.maximum(pa, 1e-4)
            out.append(np.dstack([pc, pa * 255]).clip(0, 255).astype(np.uint8))
        od = td / "o"; od.mkdir()
        for i, fr in enumerate(out):
            Image.fromarray(fr, "RGBA").save(od / f"o_{i:04d}.png", compress_level=1)

        # 4. sound: same cross-fade, sample-accurate
        sound = None
        if audio is not None and a.voice:
            s = audio[: int(round(n / fps * SR))]
            k = int(round(xf / fps * SR))
            wgt = np.linspace(0, 1, k, dtype=np.float32)
            loop = np.concatenate([s[k : len(s) - k], s[len(s) - k :] * (1 - wgt) + s[:k] * wgt]).astype(np.float32)
            sound = td / "loop.f32"
            loop.tofile(sound)

        def encode(dest, vargs, aargs, vf=None):
            cmd = ["ffmpeg", "-y", "-v", "error", "-framerate", f"{fps:g}", "-i", od / "o_%04d.png"]
            if sound:
                cmd += ["-f", "f32le", "-ar", SR, "-ac", "1", "-i", sound]
            if vf:
                cmd += ["-filter_complex", vf, "-map", "[v]"]
            else:
                cmd += ["-map", "0:v"]
            cmd += (["-map", "1:a"] if sound else []) + vargs + (aargs if sound else []) + ["-shortest", dest]
            run(cmd)

        encode(PUB / "hero/hero.webm", ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "33", "-auto-alt-ref", "0", "-row-mt", "1"], ["-c:a", "libopus", "-b:a", "80k"])
        encode(PUB / "hero/hero.mp4", ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-movflags", "+faststart"], ["-c:a", "aac", "-b:a", "96k"],
               vf=f"color=c=white:s={OUT_W}x{OUT_H}:r={fps:g}[bg];[bg][0:v]overlay=shortest=1,format=yuv420p[v]")

        # 5. stills
        mid = Image.fromarray(frames[n // 2], "RGBA")
        if a.photo:
            run(["ffmpeg", "-y", "-v", "error", "-i", a.photo, "-vf", "scale=480:600:force_original_aspect_ratio=increase,crop=480:600", "-frames:v", "1", PUB / "portrait-bust.webp"])
        elif not (PUB / "portrait-bust.webp").exists():
            bg = Image.new("RGBA", mid.size, (232, 230, 224, 255)); bg.alpha_composite(mid)
            bg.convert("RGB").crop((144, 0, 624, 600)).save(PUB / "portrait-bust.webp", quality=85)
        og = Image.new("RGB", (1200, 630), (244, 242, 238))
        p = mid.resize((int(OUT_W * 630 / OUT_H), 630), Image.LANCZOS)
        og.paste(p, ((1200 - p.width) // 2, 0), p)
        og.save(PUB / "og.jpg", quality=88)

    for f in ["hero/hero.webm", "hero/hero.mp4", "portrait-bust.webp", "og.jpg"]:
        print(f"  wrote public/{f}  ({(PUB / f).stat().st_size / 1024:.0f} KB)")
    print("Done. Refresh the site.")


if __name__ == "__main__":
    main()
