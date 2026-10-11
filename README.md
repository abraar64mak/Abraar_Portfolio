# Abraar Khan — Interactive Healthcare-AI Portfolio

A dark, biotech-dashboard style portfolio: live ECG monitor hero, a clickable experience "clinical log", a project hub with deep-dive architecture views, and a skill explorer that cross-links to real work.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide icons (≈18 KB gzipped app code).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

## Deploy (static)

`dist/` is a plain static site (`base: './'`), so it works anywhere.

- **Vercel / Netlify:** import the repo. Build command `npm run build`, output directory `dist`.
- **GitHub Pages:** upload `dist/` (or use a Pages action). Detail views use `#/project/<id>` hashes, so no server rewrites are needed.

## Project structure

```
src/
├── data/               ← ALL content lives here (edit these, not the components)
│   ├── profile.ts      name, summary, links, hero "vitals"
│   ├── experience.ts   clinical-log entries + their detail views
│   ├── projects.ts     project cards + deep-dive content
│   ├── skills.ts       skill matrix (domains + notes)
│   └── types.ts
├── components/
│   ├── Hero.tsx            research console: status, ECG, vitals, log
│   ├── EcgMonitor.tsx      canvas ECG (pauses off-screen, respects reduced motion)
│   ├── ExperienceLog.tsx   interactive timeline
│   ├── ProjectHub.tsx      filterable project cards
│   ├── DetailSheet.tsx     shared "heart page" slide-over (Esc / backdrop to close)
│   ├── PipelineFlow.tsx    interactive architecture stages
│   ├── SkillMatrix.tsx     domain tabs → skill → "applied in" links
│   └── Contact.tsx, Nav.tsx, Section.tsx, Counter.tsx, Background.tsx
└── hooks/useDetailRoute.ts deep links: #/project/beatnet, #/experience/cdf
```

## Editing content

- **Add a project:** append an object to `src/data/projects.ts`. Cards, filters, detail view and deep link appear automatically.
- **Skill cross-links:** a skill's "Applied in" chips are matched by name against each entry's `tags`. Use the same spelling (e.g. `FAISS`).
- **Colors:** `tailwind.config.js` (`ink`, cyan/teal utilities) and `src/index.css`.

## Things to review before publishing

- **Privacy:** no phone number exists anywhere in the project. Contact is email, LinkedIn and GitHub only.
- **BeatNet** has no benchmark numbers yet (none were provided). Add real metrics to `projects.ts` when you have them.
- **Publication links:** the Springer card points to the LNNS series page, and the fetal-health card points to your GitHub. Replace them with the DOI/paper URLs in `projects.ts`.
- Hero "heart rate" is a labelled simulation, and the vitals tiles use figures from your CV.
