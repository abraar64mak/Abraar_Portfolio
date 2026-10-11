#!/usr/bin/env python3
"""
Turn the Google Flow intro clip into a seamless looping hero video.

    python3 scripts/build-hero-assets.py path/to/intro.mp4
    python3 scripts/build-hero-assets.py intro.mp4 --crop 800:1000:560:40     # w:h:x:y, skip auto-detect
    python3 scripts/build-hero-assets.py intro.mp4 --photo my-photo.jpg       # use a real photo for the ID card

Outputs (into ./public):
    hero/hero.mp4   H.264 + AAC, faststart
    hero/hero.webm  VP9 + Opus
    portrait-bust.webp   480x600 ID-card portrait
    og.jpg               1200x630 social preview

Needs: ffmpeg, ffprobe, numpy.
How the loop works: the first and last 0.5 s are cross-faded (picture AND sound), so the
clip restarts on exactly the frame/sample the cross-fade ends on. No visible jump, no click,
and the lips never drift because nothing is retimed.
"""
import argparse, json, subprocess, sys, tempfile
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
XF = 0.5            # cross-fade seconds
MAX_LEN = 15.0      # seconds of source to use (keep your spoken script under ~12 s)
OUT_W, OUT_H = 768, 960


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, **kw)
    if r.returncode:
        sys.exit(f"ffmpeg failed:\n{' '.join(map(str, cmd))}\n{r.stderr.decode(errors='ignore')[-1500:]}")
    return r


def probe(src):
    j = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(src)]).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in j["streams"])
    return int(v["width"]), int(v["height"]), float(j["format"]["duration"]), has_audio


def auto_crop(src, w, h, dur):
    """Find the person (anything that differs from the plain backdrop) and return a 4:5 crop box."""
    boxes = []
    for i in range(1, 7):
        t = dur * i / 8
        raw = run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1", "-vf", "scale=480:-2,format=gray", "-f", "rawvideo", "-"]).stdout
        sh = h * 480 // w
        a = np.frombuffer(raw, np.uint8)[: 480 * sh].reshape(sh, 480).astype(np.int16)
        bg = np.median(np.concatenate([a[:, :12].ravel(), a[:, -12:].ravel(), a[:6].ravel()]))
        m = np.abs(a - bg) > 28
        ys, xs = np.where(m)
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--crop", help="w:h:x:y crop box in source pixels")
    ap.add_argument("--photo", help="optional photo for the ID-card portrait")
    a = ap.parse_args()
    src = Path(a.video).resolve()
    w, h, dur, has_audio = probe(src)
    T = min(MAX_LEN, dur)
    if T < 3 * XF:
        sys.exit("Clip is too short to loop (need at least 1.5 s).")
    cw, ch, cx, cy = map(int, a.crop.split(":")) if a.crop else auto_crop(src, w, h, dur)
    print(f"source {w}x{h} {dur:.1f}s | crop {cw}x{ch} at {cx},{cy} | using first {T:.1f}s")

    (PUB / "hero").mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        # --- 1. picture: crop, scale, whiten backdrop, build the cross-faded loop
        vf = (f"[0:v]trim=0:{T},setpts=PTS-STARTPTS,crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,"
              f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,fps=30,split=3[a][b][c];"
              f"[a]trim={XF}:{T - XF},setpts=PTS-STARTPTS[mid];"
              f"[b]trim={T - XF}:{T},setpts=PTS-STARTPTS[tail];"
              f"[c]trim=0:{XF},setpts=PTS-STARTPTS[head];"
              f"[tail][head]xfade=transition=fade:duration={XF}:offset=0[x];"
              f"[mid][x]concat=n=2:v=1:a=0,format=yuv420p[v]")
        silent = td / "silent.mp4"
        run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-filter_complex", vf, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "14", "-preset", "fast", str(silent)])

        # --- 2. sound: same cross-fade, sample-accurate, in numpy (acrossfade can drop audio)
        wav = None
        if has_audio:
            sr = 48000
            raw = run(["ffmpeg", "-v", "error", "-i", str(src), "-t", str(T), "-vn", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"]).stdout
            s = np.frombuffer(raw, np.float32)
            n = int(XF * sr)
            body = s[n : len(s) - n]
            tail, head = s[len(s) - n :], s[:n]
            wgt = np.linspace(0, 1, n, dtype=np.float32)
            xfade = tail * (1 - wgt) + head * wgt
            out = np.concatenate([body, xfade]).astype(np.float32)
            wav = td / "loop.f32"
            out.tofile(wav)

        def mux(dest, vcodec, acodec):
            cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(silent)]
            if wav:
                cmd += ["-f", "f32le", "-ar", "48000", "-ac", "1", "-i", str(wav)]
            cmd += ["-map", "0:v"] + (["-map", "1:a"] if wav else []) + vcodec + (acodec if wav else []) + ["-shortest", str(dest)]
            run(cmd)

        mux(PUB / "hero/hero.mp4", ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "slow", "-movflags", "+faststart"], ["-c:a", "aac", "-b:a", "96k"])
        mux(PUB / "hero/hero.webm", ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-pix_fmt", "yuv420p", "-row-mt", "1"], ["-c:a", "libopus", "-b:a", "80k"])

        # --- 3. stills
        frame = td / "frame.png"
        run(["ffmpeg", "-y", "-v", "error", "-ss", f"{(T - XF) / 2:.2f}", "-i", str(PUB / "hero/hero.mp4"), "-frames:v", "1", str(frame)])
        if a.photo:
            run(["ffmpeg", "-y", "-v", "error", "-i", a.photo, "-vf", "scale=480:600:force_original_aspect_ratio=increase,crop=480:600", "-frames:v", "1", str(PUB / "portrait-bust.webp")])
        else:
            run(["ffmpeg", "-y", "-v", "error", "-i", str(frame), "-vf", "crop=480:600:144:0", "-frames:v", "1", str(PUB / "portrait-bust.webp")])
        run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "color=c=0xf4f2ee:s=1200x630", "-i", str(frame), "-filter_complex", "[1:v]scale=-2:630[p];[0:v][p]overlay=(W-w)/2:0", "-frames:v", "1", "-q:v", "3", str(PUB / "og.jpg")])

    for f in ["hero/hero.mp4", "hero/hero.webm", "portrait-bust.webp", "og.jpg"]:
        print(f"  wrote public/{f}  ({(PUB / f).stat().st_size / 1024:.0f} KB)")
    print("Done. Run `npm run dev` and refresh.")


if __name__ == "__main__":
    main()
