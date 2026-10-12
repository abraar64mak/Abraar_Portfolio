#!/usr/bin/env python3
"""
Cut yourself out of a photo for the hero ("living portrait").

    python3 -m venv .venv && .venv/bin/pip install rembg onnxruntime pillow numpy
    .venv/bin/python scripts/cutout-portrait.py ~/Pictures/me-standing.jpg

Writes public/hero/me.webp (transparent background). Best with a full-body or half-body photo,
you standing straight toward the camera, good light. The first run downloads a ~176 MB model.
If you later add public/hero/hero.mp4 (the talking video), the video replaces this photo.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from rembg import new_session, remove

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "public/hero/me.webp"
out.parent.mkdir(parents=True, exist_ok=True)

cut = remove(Image.open(src).convert("RGB"), session=new_session("u2net_human_seg"), post_process_mask=True)
ys, xs = np.where(np.array(cut)[:, :, 3] > 20)
pad = 20
cut = cut.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(cut.width, xs.max() + pad), min(cut.height, ys.max() + pad)))
scale = min(1.0, 1300 / cut.height)
cut = cut.resize((int(cut.width * scale), int(cut.height * scale)), Image.LANCZOS)
cut.save(out, "WEBP", quality=88, method=6)
print(f"wrote {out} ({cut.size[0]}x{cut.size[1]})")
