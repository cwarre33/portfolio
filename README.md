# Cameron Warren Portfolio

**Live:** [https://cwarre33.github.io/portfolio/](https://cwarre33.github.io/portfolio/)

React + TypeScript portfolio for an AI Research Analyst / software engineer at Furnitureland South. The hero is a live 3D render of [cameron-wiki](https://github.com/cwarre33/cameron-wiki), the LLM-maintained second brain, and the site's numbers are compiled from it.

Also see the [GitHub profile README](https://github.com/cwarre33).

## Stack

- **React 18** + **TypeScript** + **Vite**, no UI or 3D libraries
- Hand-rolled canvas 3D force-directed graph (`src/components/KnowledgeGraph.tsx`)
- Geist, Geist Mono, and Instrument Serif; tokens in `src/index.css`
- **Vitest** for analytics and wiki-data tests
- Production analytics: GoatCounter + Microsoft Clarity (env-gated, no on-page UI)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:5173/portfolio/](http://127.0.0.1:5173/portfolio/) (base path `/portfolio/` for GitHub Pages).

```bash
npm test          # Vitest
npm run build     # production bundle → dist/
```

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds with Vite and publishes `dist/`.

Required repo secrets for analytics in production:

- `VITE_GOATCOUNTER_CODE`
- `VITE_CLARITY_ID`

Copy `.env.example` → `.env` for local reference (dev does not send events unless you force a production build). Private Tailscale analytics hub: `private-dashboard/README.md`.

## Site sections

| Section | Content |
|---------|---------|
| Hero | Interactive knowledge graph of the wiki (drag to orbit, hover a node, filter by domain) |
| Impact | Bento of production metrics with micro-visualizations (latency race, round robin, serial field) |
| Systems | ClearView, SofaScope, contact-center automation, SellSmart with animated pipelines |
| Decisions | Public ADRs: what I chose, what I passed on, and the tradeoff I accepted |
| Research | Kaggle orbit (14 competitions) and eval harnesses and agents |
| Second brain | Wiki stats, domain composition, and the redaction split |
| Experience / Contact | Timeline, credentials, other repos, CTA |

Press **⌘K / Ctrl+K** anywhere for the command palette.

## Wiki data

`src/data/wiki.generated.json` is compiled from the wiki and committed, so CI doesn't need the wiki checkout:

```bash
npm run sync:wiki                            # expects ../cameron-wiki
WIKI_DIR=/path/to/cameron-wiki npm run sync:wiki
```

Only `visibility: public` pages that aren't security or disclosure research keep a title. Everything else (`fls-internal`, `private`, `open-questions/`, `case-studies/`) ships as an anonymous node with only its section and link count. `src/data/wiki.test.ts` guards this.

Curated copy lives in `src/data/story.ts` (systems, ADRs, Kaggle, labs) and cites the source wiki page for each figure.

## Content sources

| Path | Purpose |
|------|---------|
| `src/data/story.ts` | Public site copy for systems, decisions, research |
| `src/data/experience.ts`, `projects.ts`, `certifications.ts` | Timeline, repos, credentials |
| `referece_context/MASTER_RESUME.md` | Full internal inventory for tailoring resumes |
| `docs/superpowers/` | Design specs and implementation plans |

Keep ticket IDs out of `src/`. Prefer public-safe metrics aligned with the profile README.

## Legacy

Older static HTML/CSS lives as `index-legacy.html` / `project.html` for reference only.
