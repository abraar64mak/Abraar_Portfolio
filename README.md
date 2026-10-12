# Abraar Khan: Healthcare AI Portfolio

**Machine learning engineer shipping production AI**: RAG, agentic and document-intelligence systems, and real-time models. Healthcare is my home turf; the craft applies anywhere AI ships.

M.S. in Artificial Intelligence Systems, University of Florida · B.Tech in AI & Machine Learning, Anna University · Data Scientist at CDF · Based in the United States

[LinkedIn](https://www.linkedin.com/in/abraar-khan-ali) · [GitHub](https://github.com/abraar64mak) · [Email](mailto:abraar.farooqali@gmail.com)

![Hero: animated avatar with chat-style messages, a live ECG line and headline results](docs/screenshots/01-hero.jpg)

This repository is the source of my personal portfolio. It is built to be explored rather than scrolled past: an animated avatar introduces me with chat-style messages (no sound), a lanyard ID card swings and flips, and the **Live lab** lets you try small, working versions of the systems I build.

## What's on the site

### Hello, I'm Abraar
A swinging, flippable ID card (hover or tap to flip it), plus a short summary and quick facts.

![About section with the lanyard ID card](docs/screenshots/02-about.jpg)

### Skills: the periodic table of my stack
Every skill from my résumé is an "element" with real brand logos. Filter by family, hover a skill, and see which projects and jobs used it.

![Skills periodic table with an inspector panel](docs/screenshots/03-skills.jpg)

### Selected work
Five projects in an expanding gallery. Hover a panel to open it. The two published papers show their real result tables as interactive charts.

![Project gallery with BeatNet open](docs/screenshots/04-work.jpg)

| Project | What it is |
| --- | --- |
| **BeatNet** | Real-time single-lead ECG fiducial detection and cardiac classification (1D U-Net and transformer pipeline) · [GitHub](https://github.com/abraar64mak/Beatnet) |
| **Fetal Health Prediction** | CNN study across layer depths. **Best Paper**, IConIC 2K23 · [AIP Conference Proceedings](https://pubs.aip.org/aip/acp/article-abstract/3175/1/020058/3339024/AI-in-healthcare-Predicting-the-fetus-health-using?redirectedFrom=PDF) |
| **Multi-Agent Data Assistant** | LangGraph and MCP NL-to-SQL agents behind a sqlglot AST firewall: 100% adversarial refusal across 65 attack tests · [GitHub](https://github.com/abraar64mak/mcp-data-assistant) |
| **Transformer Document Intelligence** | Fine-tuned RoBERTa NER at scale on PySpark: 0.916 strict entity F1 on 3,453 CoNLL-2003 test samples · [GitHub](https://github.com/abraar64mak/document-intelligence-platform) |
| **AI Quantification of Exercise Form** | MediaPipe pose estimation and classifiers for injury prevention. **Best Paper**, ICCCNet 2023 · [Springer](https://link.springer.com/chapter/10.1007/978-981-97-0892-5_50) |

### Live lab: don't take my word, try it
Interactive demos of the ideas behind my work: inject an arrhythmia and watch the ECG landmark detector react, compare keyword vs vector vs hybrid retrieval with PHI masking, attack a SQL firewall, and tag entities in clinical text.

![Live lab: ECG landmark detection and rhythm classification](docs/screenshots/05-lab.jpg)

> The lab demos run on synthetic data with simple rules, and they say so on screen. They illustrate the systems; they are not runs of the production models.

### Experience, achievements, contact
Education and experience as one path that draws as you scroll, then a pinned horizontal gallery of results with count-up numbers.

![Achievements gallery](docs/screenshots/06-achievements.jpg)

## Highlights from my work

- **Clinical RAG at CDF:** cut Medicaid chart review 25% (about 15 hours a week) and raised retrieval accuracy from 72% to 88% across 50K+ forms with hybrid keyword and FAISS search; physician-graded evaluation lifted answer reliability to 93%.
- **PHI safety:** guardrails that mask PHI and verify medical terms protect 60K+ patient lookups.
- **Wearable cardiac AI at Aventusoft:** streaming ECG inference in PyTorch; arrhythmia F1 up 14% and AUC up 11% by synthesizing rare-class waveforms; IEC 62304-compliant CI/CD release gates.
- **Published research:** 2× Best Paper awards for peer-reviewed healthcare AI (ICCCNet 2023, Springer LNNS; IConIC 2K23, AIP).

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lenis (smooth scroll) · Lucide icons · simple-icons (brand logos).
Fonts (Inter Tight, Instrument Serif, JetBrains Mono) are self-hosted. There are no external scripts or image CDNs at runtime.

Built with care for accessibility: semantic sections, keyboard focus styles, reduced-motion support, and a layout that works from 360 px to 1920 px.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/abraar64mak/Abraar_Portfolio.git
cd Abraar_Portfolio
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # type-check and production build into dist/
npm run preview      # serve the production build locally
```

`dist/` is a plain static site, so it deploys anywhere (Vercel, Netlify, GitHub Pages).

## Project structure

```
src/
├── data/          all content: profile, experience, projects, skills, papers, chart data
├── components/    page sections, ID card, hero player, lab demos (components/demos), charts
├── lib/           smooth-scroll and scroll hooks
└── hooks/         reduced-motion helper
public/hero/       silent hero video (hero.webm with transparency, hero.mp4 for Safari) and photo fallback
scripts/           build-hero-assets.py (cuts out and loops the hero video), cutout-portrait.py
docs/              screenshots and notes
```

## Credits

Brand logos from [simple-icons](https://simpleicons.org) (CC0), shown in their official colours. Icons by [Lucide](https://lucide.dev).

## Copyright

© Abraar Khan. The photos, avatar, video and written content are mine and are not licensed for reuse. You are welcome to take inspiration from the layout and ideas.
