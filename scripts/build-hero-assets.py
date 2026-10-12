#!/usr/bin/env python3
"""
Turn the Google Flow intro clip into a seamless looping hero video that sits directly on the page (no backdrop).

    python3 -m venv .venv && .venv/bin/pip install rembg onnxruntime pillow numpy      # once (about 1 GB incl. model)
    .venv/bin/python scripts/build-hero-assets.py path/to/intro.mp4
    .venv/bin/python scripts/build-hero-assets.py intro.mp4 --crop 552:690:371:25      # w:h:x:y, skip auto-detect
    .venv/bin/python scripts/build-hero-assets.py intro.mp4 --photo me.jpg             # ID-card portrait from a photo
    .venv/bin/python scripts/build-hero-assets.py intro.mp4 --voice                    # keep the audio track

Outputs (into ./public):
    hero/hero.webm   packed video: colour (left half) + matte (right half)   (Chrome, Edge, Firefox, Android)
    hero/hero.mp4    the same, H.264                                         (Safari / iOS)
    portrait-bust.webp   480x600 ID-card portrait    (only if you pass --photo, or none exists yet)
    og.jpg               1200x630 social preview

Why "packed"? Browsers disagree about transparent video, so the transparency is stored as an ordinary
picture: the left half is the person (premultiplied over black), the right half is the cut-out matte.
The page (src/components/AlphaVideo.tsx) recombines them on a canvas, so it looks identical everywhere.

What it does
  1. Finds the person, crops head to toe, scales to 768x960.
  2. Cuts the person out of EVERY frame (rembg), smooths the matte over time, removes the backdrop fringe.
  3. Finds the best loop join: it searches for the start and end frames that look most alike (the start is
     before you speak, the end is after), then cross-fades a few frames. No jump, no ghosting.
  4. Optionally keeps the voice (--voice), cross-faded sample-accurately. The default is silent.
Needs: ffmpeg + ffprobe on PATH, and the Python packages above.
"""
import argparse, json, shutil, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
XF_FRAMES = 6       # frames cross-faded at the loop join
MAX_LEN = 15.0      # never use more than this much of the source
TAIL = 0.7          # candidate loop ends are searched from the last spoken word to this long after it
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
    s0 = s1 = 0.0
    if audio is not None:
        s0, s1 = speech_window(audio)
        T = min(T, max(s1 + TAIL + 0.3, 3.0))
        print(f"speech {s0:.2f}s to {s1:.2f}s -> using the first {T:.2f}s of {dur:.1f}s")
        if s0 < 0.35:
            print("  note: speech starts almost immediately; leave about half a second of stillness at the start for a cleaner loop")
    n = int(round(T * fps))
    cw, ch, cx, cy = map(int, a.crop.split(":")) if a.crop else auto_crop(src, w, h, dur)
    print(f"source {w}x{h} @ {fps:g} fps | crop {cw}x{ch} at {cx},{cy} | {n} frames")

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
        sm = [refine((0.25 * alpha[max(i - 1, 0)] + 0.5 * alpha[i] + 0.25 * alpha[min(i + 1, n - 1)])) for i in range(n)]
        frames = [np.dstack([rgb[i], (sm[i] * 255).astype(np.uint8)]) for i in range(n)]

        # 3. best loop join: start before the speech, end after it, most similar pair wins
        K = XF_FRAMES
        j_max = max(0, int(round((s0 if audio is not None else 0.6) * fps)) - K - 2)
        i_min = int(round(((s1 if audio is not None else T * 0.8)) * fps))
        i_min = min(max(i_min, K * 3 + j_max + 2), n - 1)
        small = [np.asarray(Image.fromarray(fr, "RGBA").convert("RGBa").resize((96, 120), Image.BILINEAR).convert("RGBA"), np.float32) for fr in frames]
        best = min(((float(np.abs(small[ii] - small[jj]).mean()), jj, ii) for jj in range(0, j_max + 1) for ii in range(i_min, n)), key=lambda x: x[0])
        _, j0, i0 = best
        print(f"  loop join: frames {j0}..{i0} ({(i0 - j0 + 1) / fps:.2f}s), seam difference {best[0]:.2f}")
        S = frames[j0 : i0 + 1]
        L = len(S)
        out = S[K : L - K]
        for t in range(K):
            wt = (t + 1) / (K + 1)
            f1, f2 = S[L - K + t].astype(np.float32), S[t].astype(np.float32)
            a1, a2 = f1[:, :, 3:] / 255, f2[:, :, 3:] / 255
            pa = (1 - wt) * a1 + wt * a2
            pc = ((1 - wt) * f1[:, :, :3] * a1 + wt * f2[:, :, :3] * a2) / np.maximum(pa, 1e-4)
            out.append(np.dstack([pc, pa * 255]).clip(0, 255).astype(np.uint8))

        # 4. pack: left = colour premultiplied over black, right = matte (grey)
        od = td / "o"; od.mkdir()
        for k, fr in enumerate(out):
            al = fr[:, :, 3:4].astype(np.float32) / 255
            col = (fr[:, :, :3].astype(np.float32) * al).astype(np.uint8)
            mat = np.repeat(fr[:, :, 3:4], 3, axis=2)
            Image.fromarray(np.hstack([col, mat]), "RGB").save(od / f"o_{k:04d}.png", compress_level=1)

        # 5. optional voice, cross-faded to match
        sound = None
        if audio is not None and a.voice:
            seg = audio[int(round(j0 / fps * SR)) : int(round((i0 + 1) / fps * SR))]
            kk = int(round(K / fps * SR))
            wgt = np.linspace(0, 1, kk, dtype=np.float32)
            loop = np.concatenate([seg[kk : len(seg) - kk], seg[len(seg) - kk :] * (1 - wgt) + seg[:kk] * wgt]).astype(np.float32)
            sound = td / "loop.f32"
            loop.tofile(sound)

        def encode(dest, vargs, aargs):
            cmd = ["ffmpeg", "-y", "-v", "error", "-framerate", f"{fps:g}", "-i", od / "o_%04d.png"]
            if sound:
                cmd += ["-f", "f32le", "-ar", SR, "-ac", "1", "-i", sound]
            cmd += ["-map", "0:v"] + (["-map", "1:a"] if sound else [])
            cmd += ["-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]
            cmd += vargs + (aargs if sound else []) + ["-shortest", dest]
            run(cmd)

        encode(PUB / "hero/hero.webm", ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "28", "-row-mt", "1"], ["-c:a", "libopus", "-b:a", "80k"])
        encode(PUB / "hero/hero.mp4", ["-c:v", "libx264", "-crf", "20", "-preset", "slow", "-movflags", "+faststart"], ["-c:a", "aac", "-b:a", "96k"])

        # 6. stills
        mid = Image.fromarray(S[L // 2], "RGBA")
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
