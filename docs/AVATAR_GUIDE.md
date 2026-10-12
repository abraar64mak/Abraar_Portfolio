# Make the avatar hero

## Current hero: silent avatar + chat-style messages

The hero plays the avatar **without sound**. Short messages pop in beside him like a chat thread, timed to the lip movement, ending with an "Open to AI roles. Let's talk" button. Interviewers can skim it in a meeting or on a phone without anything playing out loud.

- Edit the messages and their timing in `src/components/SpeechBubbles.tsx` (the `MSGS` list, times are seconds into the 7-second loop).
- To rebuild the video from a new clip: `.venv/bin/python scripts/build-hero-assets.py intro.mp4` (silent by default; add `--voice` to keep the audio).

**Optional Flow prompt for a silent clip** (append to the character and camera rules in Step 2 below, and replace the voice and script sections):

```
This is a SILENT video. There is NO audio at all: no voice, no music, no sound effects.
The character appears to be speaking to the camera: natural, relaxed lip movement as if explaining something friendly, with a warm slight smile, occasional natural blinking, small head nods, and gentle expressive hand gestures (he may take one hand out of his pocket briefly, then return it).
The movement must be subtle and natural. No exaggerated mouth movement, no sudden gestures.
Start and end with about half a second of calm stillness so the clip loops smoothly.
Keep the same character, outfit, pose, centered framing, plain pure white background, soft studio lighting and fixed camera as in the reference image.
```


## Quick route (no video, no voice): animated 3D avatar

1. Do **Step 1** below. Upload the white-background standing character image (the one in the guide) as the **first** image and `docs/avatar-source.jpg` as the second, with the *with-reference* prompt.
2. Save the result, then cut it out: `.venv/bin/python scripts/cutout-portrait.py ~/Downloads/my-avatar.png` (instructions at the top of that script). This writes `public/hero/me.webp`.
3. Tell Claude (or edit `src/data/hero.ts`) where the neck is so the head can turn and nod toward the cursor.

## Full route: talking video (3 steps)


The site works without a video (it shows a soft silhouette). Do these steps to bring the hero to life.

## Step 1: Create your 3D character image

Use any image generator that accepts photos (ChatGPT, Gemini, etc.). Upload **your own clear, front-facing photo**.
If you also have the white-shirt reference image from the original guide, upload it as the first image and use the prompt below as-is. If you don't, use the **no-reference** variant.

**Prompt (with reference image):**

> Create a premium, high-quality 3D Bitmoji/cartoon-style full-body character portrait using the two uploaded images: use the first image as the exact visual reference for composition, outfit, pose, framing, and background, and the second as the identity reference. Recreate the composition closely with a single man standing upright in the exact same relaxed pose centered in a 16:9 landscape frame, full body visible head to feet, hands in pockets, wearing the same white button-up shirt with rolled sleeves, black trousers, and white sneakers, against a clean, plain, seamless pure-white background with soft even studio lighting, subtle natural ground shadow, straight-on eye-level view, and generous empty space. Replace only the reference person's identity with the person from the personal photo, preserving their recognizable face, facial structure, eyes, eyebrows, nose, lips, skin tone, hairstyle, hair color, facial hair, body shape, natural proportions, facial expression, and overall appearance; do not copy the reference person's face or hair. Render him as a polished, friendly, premium 3D cartoon character while keeping him recognizable. Keep the outfit, pose, position, scale, camera angle, lighting, and background consistent with the reference. No text, logos, props, furniture, scenery, extra characters, unnecessary accessories, cropping, distortion, or exaggerated features. Output one clean, high-resolution 16:9 image.

**Prompt (no reference image, only your photo):**

> Create a premium, high-quality 3D Bitmoji/cartoon-style full-body character portrait of the man in the uploaded photo, preserving his recognizable face, facial structure, eyes, eyebrows, nose, lips, skin tone, hairstyle, hair color, facial hair, body shape and natural proportions. He stands upright and centered in a 16:9 landscape frame, full body visible head to feet, in a relaxed pose with both hands in his pockets, wearing a white button-up shirt with rolled sleeves, black trousers, and white sneakers. Clean, plain, seamless pure-white background, soft even studio lighting, subtle natural ground shadow, straight-on eye-level view, generous empty space around him. Polished, friendly, premium 3D cartoon rendering. No text, logos, props, furniture, scenery, extra characters, unnecessary accessories, cropping, distortion, or exaggerated features. One clean, high-resolution 16:9 image.

## Step 2: Make the intro video in Google Flow

In Google Flow, create a video from an **image**: upload your avatar image (the white-shirt standing image from Step 1) as the starting frame, then paste the prompt below.

**Keep the spoken line short.** Flow clips are typically about 8 seconds, so the line must fit in roughly 7 seconds (about 17 to 20 words). If your plan allows longer clips, you can use a longer line.

**Pick one script (they all describe you as a healthcare AI professional):**

1. *(recommended, about 6 s)* "Hi, I'm Abraar, a healthcare AI professional. I build machine learning systems that doctors can trust."
2. *(about 8 s)* "Hi, I'm Abraar. I'm a healthcare AI professional, building ECG models and secure clinical AI that doctors can trust."
3. *(shortest, about 4 s)* "Hi, I'm Abraar. I build healthcare AI that doctors can trust."

If the voice mispronounces your name, spell it the way it sounds in the quotes (for example "Ab-raar") and regenerate.

**Prompt (copy everything in the box; replace the SCRIPT line if you chose a different one):**

```
Use the uploaded reference image as the EXACT and ONLY visual reference for the character.
Create a premium, high-quality video of this exact character, in the same visual style as the reference image.

CHARACTER CONSISTENCY:
- The character must look exactly like the uploaded reference.
- Preserve his exact face, facial structure, eyes, eyebrows, nose, lips, beard, curly hairstyle, hair color, skin tone, body proportions, clothing, and overall appearance.
- Do not redesign the character. Do not change his outfit (white button-up shirt with rolled sleeves, black trousers, white sneakers). Do not change his hairstyle or facial features. Do not make him look like a different person. Do not add or remove accessories. Do not change his age or body shape.

POSE AND POSITION:
- Start with the character standing exactly in the pose shown in the reference image, hands in pockets.
- Keep him standing upright in the exact CENTER of the frame, with his entire body visible from head to feet. Do not crop any part of his body.
- Only allow natural small movements required for speaking. He may briefly take one hand out of a pocket to gesture, then return it.

PERFORMANCE:
The character is a healthcare AI professional introducing himself directly to the camera, with a warm, confident, approachable expression.

EXACT SPOKEN SCRIPT:
"Hi, I'm Abraar, a healthcare AI professional. I build machine learning systems that doctors can trust."

VOICE:
- Natural MALE voice, mid-range. Friendly, confident, professional tone, like a clear and calm engineer speaking to a founder.
- Natural speaking speed. Clear pronunciation. Accurate lip synchronization.
- The complete script is spoken continuously from beginning to end, once. Do not pause unnaturally, do not restart the sentence, do not add or change any words.

NATURAL ANIMATION:
- Natural blinking and eye movement, subtle facial expressions, a slight smile, small natural head movements, gentle body movement.
- No exaggerated, robotic or sudden movements. No unnatural stretching or deformation.
- The character remains standing in the center for the entire video.

CAMERA:
- Fixed camera, straight-on, eye-level. No camera movement, shake, zoom, rotation, or cuts. Keep the exact same framing throughout.

BACKGROUND:
- Completely plain pure white seamless studio background. No objects, furniture, scenery, patterns, gradients, decorations, other people, text, or logos.

LIGHTING:
- Soft, even professional studio lighting with a natural soft shadow under the character. No flicker, no exposure changes, no background brightness changes.

AUDIO:
- Voice only. No background music, instrumental music, sound effects, ambient sound, reverb, footsteps, extra voices, or noise.

TEXT:
- No subtitles, captions, titles, on-screen text, labels, speech bubbles, or watermark.

QUALITY:
- High-quality, polished rendering with clean character edges and stable identity for the whole video.
- No face distortion or morphing, no disappearing face or body parts, no extra or missing fingers, no duplicated limbs, no visual glitches, no flicker.

Create ONE continuous uninterrupted shot. Start and end with a brief natural pause (about half a second) so the clip loops smoothly. Do not add anything that is not explicitly requested above.
```

**Check the result before moving on:** the voice is male, the words match your script exactly, he stays centered with the full body visible, the background is pure white, and there's no music or text. If anything is off, regenerate (small prompt tweaks help, for example repeating "male voice" or "do not change the words").

## Step 3: Turn it into the hero

Install the two tools once (macOS):

```bash
brew install ffmpeg
pip3 install numpy
```

Then, from the project folder:

```bash
python3 scripts/build-hero-assets.py ~/Downloads/intro.mp4
# optional: use a real photo of you on the ID card instead of a video frame
python3 scripts/build-hero-assets.py ~/Downloads/intro.mp4 --photo ~/Pictures/me.jpg
# if auto-crop picks the wrong area, give the crop box yourself (w:h:x:y in source pixels)
python3 scripts/build-hero-assets.py ~/Downloads/intro.mp4 --crop 800:1000:560:40
```

It writes `public/hero/hero.mp4`, `public/hero/hero.webm`, `public/portrait-bust.webp` and `public/og.jpg`. Run `npm run dev` and refresh. The video loops seamlessly, the voice plays when the hero is on screen and pauses when you scroll away, and the round ▶/❚❚ button controls sound.
