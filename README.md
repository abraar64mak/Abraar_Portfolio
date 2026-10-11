# Abraar Khan — Interactive Healthcare-AI Portfolio

An interactive AI-healthcare dashboard portfolio: live ECG landmark detection, working RAG / agent-security / NER demos, research projects with real paper results, and a skills map.

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

## What's inside

A dashboard, not a scrolling page. A sidebar switches between modules (keys `1`–`7`, or `⌘/Ctrl+K` to search anything).

| Module | What it does |
| --- | --- |
| **Overview** | Live ECG monitor that detects P/Q/R/S/T landmarks and classifies rhythm (Normal, Tachy, PVC, AFib). Inject a rhythm and watch the classifier react. Also KPI tiles and an animated clinical RAG data-flow graph. |
| **Clinical Log** | Experience & education. Select an entry to open its case file inline. |
| **Research Lab** | Projects with architecture flow, metrics, and (for the two papers) interactive result charts. |
| **AI Lab** | Three working demos: Clinical RAG (keyword vs FAISS vs hybrid, PHI masking), SQL Firewall (try attacks), Entity Tagger. |
| **Skills Map** | Pick a skill to see which jobs and projects used it. |
| **Publications** | Both Best Paper publications with real result tables. |
| **Contact** | Email, LinkedIn, GitHub and a compose form (opens your mail app; nothing is sent to a server). |

There are no pop-up overlays for content. Detail views render inline and every view is deep-linkable (`#/research/beatnet`, `#/lab/firewall`).

## Project structure

```
src/
├── data/               ← ALL content lives here (edit these, not the components)
│   ├── profile.ts      name, summary, links, KPI tiles
│   ├── experience.ts   clinical-log entries
│   ├── projects.ts     projects + deep-dive content
│   ├── papers.ts       publications metadata
│   ├── charts.ts       result tables transcribed from the papers
│   └── skills.ts
├── views/              one file per module
├── components/         Panel, EcgLab, SystemGraph, BarChart, DetailPane, Sidebar, CommandPalette …
│   └── demos/          RagDemo, FirewallDemo, NerDemo
└── hooks/useRoute.ts   hash routing
```

## Editing content

- **Add a project:** append an object to `src/data/projects.ts`. Cards, filters, detail view and deep link appear automatically.
- **Skill cross-links:** a skill's "Applied in" list are matched by name against each entry's `tags`. Use the same spelling (e.g. `FAISS`).
- **Colors:** `tailwind.config.js` (`ink`, cyan/teal utilities) and `src/index.css`.

## Things to review before publishing

- **Privacy:** no phone number exists anywhere in the project. Contact is email, LinkedIn and GitHub only.
- **BeatNet** has no benchmark numbers yet (none were provided). Add real metrics to `projects.ts` when you have them.
- **Publication links:** the Springer card points to the LNNS series page, and the fetal-health card points to your GitHub. Replace them with the DOI/paper URLs in `projects.ts`.
- The ECG, RAG, firewall and entity-tagger demos are labelled simulations on synthetic data. They illustrate the ideas and are not runs of the real models.
