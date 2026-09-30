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
| Research | Kaggle standings (finish-percentile chart, medals, badges) and eval harnesses |
| Second brain | Wiki stats, domain composition, and the redaction split |
| Experience / Contact | Timeline, credentials, other repos, CTA |

Press **⌘K / Ctrl+K** anywhere for the command palette.

## Private cockpit (`ops`)

Type `ops` in the ⌘K / Ctrl K palette to open `#/ops`, a read-only job-search cockpit over
[career-ops](https://github.com/santifer/career-ops) data in the **private** `cwarre33/cameron-wiki` repo (`career/`).

- Nothing private is in this repo or the bundle. The cockpit (`src/ops/`, code-split) fetches
  `career/data/applications.md` and `career/reports/*.md` at runtime from `api.github.com`.
- Sign in with a **fine-grained** GitHub token: resource owner `cwarre33`, only `cameron-wiki`,
  permission *Contents: Read-only*, with an expiry. It is kept in `sessionStorage` (cleared when the tab
  closes, or with **lock**) and sent only to `api.github.com`.
- The `ops` command is discoverable in public JS by design; access is enforced by GitHub, not by obscurity.
- On `#/ops`, Clarity recording is stopped, the view is masked, and `noindex` is set.

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
| `resume/` | Public resume source (`.tex`, markdown) and built PDF; copy the PDF to `public/downloads/` |
| `docs/superpowers/` | Design specs and implementation plans |

Keep ticket IDs out of `src/`. Prefer public-safe metrics aligned with the profile README.

## Legacy

Older static HTML/CSS lives as `index-legacy.html` / `project.html` for reference only.
