# Make the talking-avatar hero (3 steps)

The site works without a video (it shows a soft silhouette). Do these steps to bring the hero to life.

## Step 1: Create your 3D character image

Use any image generator that accepts photos (ChatGPT, Gemini, etc.). Upload **your own clear, front-facing photo**.
If you also have the white-shirt reference image from the original guide, upload it as the first image and use the prompt below as-is. If you don't, use the **no-reference** variant.

**Prompt (with reference image):**

> Create a premium, high-quality 3D Bitmoji/cartoon-style full-body character portrait using the two uploaded images: use the first image as the exact visual reference for composition, outfit, pose, framing, and background, and the second as the identity reference. Recreate the composition closely with a single man standing upright in the exact same relaxed pose centered in a 16:9 landscape frame, full body visible head to feet, hands in pockets, wearing the same white button-up shirt with rolled sleeves, black trousers, and white sneakers, against a clean, plain, seamless pure-white background with soft even studio lighting, subtle natural ground shadow, straight-on eye-level view, and generous empty space. Replace only the reference person's identity with the person from the personal photo, preserving their recognizable face, facial structure, eyes, eyebrows, nose, lips, skin tone, hairstyle, hair color, facial hair, body shape, natural proportions, facial expression, and overall appearance; do not copy the reference person's face or hair. Render him as a polished, friendly, premium 3D cartoon character while keeping him recognizable. Keep the outfit, pose, position, scale, camera angle, lighting, and background consistent with the reference. No text, logos, props, furniture, scenery, extra characters, unnecessary accessories, cropping, distortion, or exaggerated features. Output one clean, high-resolution 16:9 image.

**Prompt (no reference image, only your photo):**

> Create a premium, high-quality 3D Bitmoji/cartoon-style full-body character portrait of the man in the uploaded photo, preserving his recognizable face, facial structure, eyes, eyebrows, nose, lips, skin tone, hairstyle, hair color, facial hair, body shape and natural proportions. He stands upright and centered in a 16:9 landscape frame, full body visible head to feet, in a relaxed pose with both hands in his pockets, wearing a white button-up shirt with rolled sleeves, black trousers, and white sneakers. Clean, plain, seamless pure-white background, soft even studio lighting, subtle natural ground shadow, straight-on eye-level view, generous empty space around him. Polished, friendly, premium 3D cartoon rendering. No text, logos, props, furniture, scenery, extra characters, unnecessary accessories, cropping, distortion, or exaggerated features. One clean, high-resolution 16:9 image.

## Step 2: Make the intro video in Google Flow

Upload the Step 1 image to Google Flow and paste this prompt. The spoken line is about 9 seconds, short enough to loop nicely. If you change it, keep it **under ~12 seconds**.

> Use the uploaded reference image as the EXACT and ONLY visual reference for the character.
> Create a premium, high-quality 3D animated video of this exact character.
>
> CHARACTER CONSISTENCY:
> - The character must look exactly like the uploaded reference character.
> - Preserve his exact face, facial structure, eyes, eyebrows, nose, lips, hairstyle, hair color, skin tone, body proportions, clothing, accessories, and overall appearance.
> - Do not redesign the character. Do not change his outfit, hairstyle or facial features. Do not make him look like a different person. Do not add or remove accessories. Do not change his age or body shape.
> - Maintain the same premium 3D Bitmoji/cartoon style as the reference image.
>
> POSE AND POSITION:
> - Start with the character standing exactly in the same pose shown in the reference image.
> - Keep him standing upright in the exact CENTER of the frame, entire body visible from head to feet. Do not crop any part of his body. Only allow natural small movements required for speaking.
>
> PERFORMANCE: The character is introducing himself directly to the camera.
>
> EXACT SPOKEN SCRIPT:
> "Hi, I'm Abraar. I'm a machine learning engineer building healthcare AI, from real-time ECG models to secure clinical systems that doctors can trust."
>
> VOICE:
> - Natural MALE voice. Friendly, confident, professional tone. Natural speaking speed, clear pronunciation, accurate lip synchronization.
> - The complete script is spoken continuously from beginning to end. Do not pause unnaturally, restart the sentence, or change/improvise the words.
>
> NATURAL ANIMATION: natural blinking and eye movement, subtle facial expressions, small head movements, natural hand gestures while speaking, gentle body movement. No exaggerated, robotic or sudden movements. No stretching or deformation. He remains standing in the center.
>
> CAMERA: fixed, straight-on, eye-level. No movement, shake, zoom, rotation, cuts, or change of angle. Same framing for the whole video.
>
> BACKGROUND: completely plain pure white, seamless studio. No objects, furniture, scenery, patterns, gradients, decorations, extra characters, text or logos.
>
> LIGHTING: soft even professional studio lighting, soft natural shadow beneath the character, no flicker, no exposure or brightness changes.
>
> AUDIO: voice only. No music, sound effects, ambient sound, footsteps, reverb, extra voices or background noise.
>
> TEXT: no subtitles, captions, titles, on-screen text, labels, speech bubbles or watermark.
>
> QUALITY: high-quality cinematic 3D animation, clean character edges, stable identity throughout. No face distortion or morphing, no disappearing face or body parts, no extra/missing fingers, no duplicated limbs, no glitches, no flicker.
>
> Create ONE continuous uninterrupted shot. The character remains in the center and continuously introduces himself with subtle natural gestures. Do not add anything that is not explicitly requested above.

Tip: ask for a **brief pause at the very start and end** so the loop is seamless.

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
