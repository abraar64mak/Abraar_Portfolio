# Abraar Khan: ML & AI Systems Engineer

**I build production AI (RAG, agentic systems, real-time models) and I secure it**: red-teaming RAG, sandboxing untrusted code, and access control for LLM agents.

M.S. in Artificial Intelligence Systems, University of Florida · B.Tech in AI & Machine Learning, Anna University · Data Scientist at CDF · Based in the United States · Open to AI roles

[LinkedIn](https://www.linkedin.com/in/abraar-khan-ali) · [GitHub](https://github.com/abraar64mak) · [Email](mailto:abraar.farooqali@gmail.com) · [Live site](https://abraar64mak.github.io/Abraar_Portfolio/)

![Hero: animated avatar with chat-style messages and headline results](docs/screenshots/01-hero.jpg)

This repository is the source of my personal portfolio. It is built to be explored rather than scrolled past: an animated avatar introduces me with chat-style messages (no sound), a lanyard ID card swings and flips, and the **Live lab** lets you try small, working versions of the systems I build and secure.

## What's on the site

### About and research interests
A swinging, flippable ID card (hover or tap to flip it), a short summary, quick facts, and my research interests: cybersecurity for AI and cloud systems, with a focus on securing agentic AI infrastructure (agent sandboxing, secure runtimes for LLM tool use, verifiable AI pipelines).

![About section with the lanyard ID card and research interests](docs/screenshots/02-about.jpg)

### Skills: the periodic table of my stack
49 skills as "elements" with real brand logos, grouped into seven families. Hover a skill to see which projects and jobs used it.

![Skills periodic table with an inspector panel](docs/screenshots/03-skills.jpg)

### Selected work
Seven projects in an expanding gallery (hover a panel to open it), plus the two published papers with their real result tables.

![Project gallery with an open panel and benchmark chart](docs/screenshots/04-work.jpg)

| Project | What it is |
| --- | --- |
| **SecureAI-RAG** | Red-teaming RAG: 250 poisoned-document attacks in four families, mapped to the OWASP LLM Top 10. A four-stage defense cut attack success from **68.0% to 1.6%** while keeping 96.5% benign utility · [GitHub](https://github.com/abraar64mak/SecureAI-RAG) |
| **Distributed Code Judge** | Sandboxed execution of untrusted code: a policy-enforcing Docker API proxy, hardened per-test sandboxes, and idempotent at-least-once grading on Kafka and PostgreSQL · [GitHub](https://github.com/abraar64mak/distributed-code-judge) |
| **Secure Data Sandbox** | A secure RAG-based intelligence sandbox on Linux for the XVIII Airborne Corps (DoD), with sub-150 ms queries and hybrid threat detection that keeps an analyst in the loop |
| **Multi-Agent Data Assistant** | LangGraph and MCP NL-to-SQL with PostgreSQL row-level security, RBAC and sqlglot AST validation: 75% execution accuracy, 6 of 6 adversarial cases refused, p95 7.6 s · [GitHub](https://github.com/abraar64mak/MCP-DATA-ASSISTANT) |
| **BeatNet** | Real-time ECG AI on wearable hardware: a 1D U-Net with a TCN bottleneck plus a fine-tuned ECG-FM model over 1.5M+ segments; ONNX cut inference latency 42% · [GitHub](https://github.com/abraar64mak/Beatnet) |
| **Transformer Document Intelligence** | Fine-tuned RoBERTa NER on distributed PySpark behind FastAPI: 0.9155 strict entity F1 on 3,453 CoNLL-2003 test documents · [GitHub](https://github.com/abraar64mak/document-intelligence-platform) |
| **Malicious Code Detection** | Undergraduate thesis: a Random Forest reached 99.45% accuracy on malicious URLs and Windows PE headers · [GitHub](https://github.com/abraar64mak/Malicious-Code-Review) |

**Published research:** two Best Paper awards, ICCCNet 2023 ([Springer LNNS](https://link.springer.com/chapter/10.1007/978-981-97-0892-5_50)) and IConIC 2K23 ([AIP Conference Proceedings](https://pubs.aip.org/aip/acp/article-abstract/3175/1/020058/3339024/AI-in-healthcare-Predicting-the-fetus-health-using?redirectedFrom=PDF)).

### Live lab: don't take my word, try it
Interactive demos of the ideas behind my work: poison a RAG system and switch its four defense stages on and off, attack a SQL firewall, tag entities, and watch a signal classifier work.

![Live lab: RAG red-team demo](docs/screenshots/05-lab.jpg)

> The lab demos run on synthetic data with simple rules, and they say so on screen. They illustrate the systems; they are not runs of the production models or of the full evaluations.

### Experience, achievements, contact
Education and experience as one path that draws as you scroll (Anna University, Plumb5, University of Florida, Aventusoft, CDF), then a pinned horizontal gallery of results with count-up numbers.

![Achievements gallery](docs/screenshots/06-achievements.jpg)

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lenis (smooth scroll) · WebGL (hero video compositing) · Lucide icons · simple-icons (brand logos).
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

`dist/` is a plain static site, so it deploys anywhere. This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds it and publishes it to **GitHub Pages**.

## Project structure

```
src/
├── data/          all content: profile, experience, projects, skills, papers, chart data
├── components/    page sections, ID card, hero player, lab demos (components/demos), charts
├── lib/           smooth-scroll and scroll hooks
└── hooks/         reduced-motion helper
public/hero/       silent hero video (hero.webm and hero.mp4, picture and matte packed side by side) and photo fallback
scripts/           build-hero-assets.py (cuts out and loops the hero video), cutout-portrait.py
docs/              screenshots and notes
```

## Credits

Brand logos from [simple-icons](https://simpleicons.org) (CC0), shown in their official colours. Icons by [Lucide](https://lucide.dev).

## Copyright

© Abraar Khan. The photos, avatar, video and written content are mine and are not licensed for reuse. You are welcome to take inspiration from the layout and ideas.
