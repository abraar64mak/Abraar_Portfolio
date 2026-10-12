# Abraar Khan: Healthcare AI Portfolio

A quiet, light, premium portfolio with a **talking 3D-avatar hero**, built for healthcare-AI founders and teams.
Inspired by the "talking-video portfolio" format, adapted with medical-AI touches: a live ECG lab, clinical RAG and agent-security demos, and real results from the two published papers.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Lenis (smooth scroll) · self-hosted fonts (Inter Tight, Instrument Serif, JetBrains Mono). Static site, deploys anywhere.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build -> dist/
npm run preview
```

## Hero video (current) and photo (fallback)

The hero plays `public/hero/hero.webm` (transparent background, with sound; Safari uses `hero.mp4`). Rebuild it from any new clip with `scripts/build-hero-assets.py` (setup at the top of that file). If the video files are missing, the page falls back to the animated photo below.

### Animated photo

The hero shows a cut-out of Abraar (`public/hero/me.webp`) that breathes and tilts toward the cursor. To use a different photo, run `scripts/cutout-portrait.py` (instructions are at the top of that file).

## Add your avatar video (optional)

If you add `public/hero/hero.mp4` it replaces the photo in the hero. Follow **[docs/AVATAR_GUIDE.md](docs/AVATAR_GUIDE.md)**: three steps with ready-to-paste prompts (male voice, your intro line) and one command that builds the seamless loop.

## Sections

| # | Section | Idea |
| - | ------- | ---- |
| – | Hero | Talking-avatar video (loops, sound toggle, pauses off-screen) + ghost name + ECG line + key results |
| 01 | About | Swinging, flippable lanyard ID card + résumé summary + quick facts |
| 02 | Skills | "Periodic table" of every skill on the résumé, family filters, real brand logos, "used in" links |
| 03 | Work | Expanding gallery of 5 projects; the two papers show their real result charts |
| 04 | Live lab | ECG landmark detector, clinical RAG, SQL firewall, entity tagger, pipeline (simulations) |
| 05 | Experience | Education + experience as one scroll-drawn path |
| 06 | Achievements | Pinned horizontal gallery with count-up numbers |
| 07 | Contact | Email (copy), LinkedIn, GitHub. No phone number is shown anywhere |

There is no Certifications section because the résumé lists none.

## Editing content

All content is in `src/data/`: `profile.ts`, `experience.ts`, `projects.ts`, `skills.ts`, `papers.ts`, `charts.ts`.
There is no résumé download on the site.

## Notes

- **Honesty:** the Live lab demos run on synthetic data with simple rules and say so on screen. They illustrate the systems and are not runs of the real models. The project visuals in the Work gallery are labelled "Illustrative UI"; the paper charts are transcribed from the papers.
- **Logos:** brand marks come from [simple-icons](https://simpleicons.org) (CC0) in their official colours. Marks for concepts (RAG, MCP, AWS, Azure…) are Lucide line icons.
- **Colour:** white, black and grays. The Live lab is a single dark, rounded "instrument" card, and its status colours are the one deliberate exception.
- **Paper links:** the Work gallery buttons for the two papers open the AIP and Springer pages (set in `src/data/projects.ts`).
