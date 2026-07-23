# Cameron Warren Portfolio

**Live:** [https://cwarre33.github.io/portfolio/](https://cwarre33.github.io/portfolio/)

React + TypeScript portfolio for an AI Research Analyst / software engineer at Furnitureland South. Highlights production work: contact-center automation (4,000+ tickets auto-assigned), inventory lookup + RDS browse perf, staging-to-prod CI/CD on ECS/Fargate, conversational AI (SellSmart / Digital-to-Store), and SofaScope visual search (15s to &lt;500ms).

Also see the [GitHub profile README](https://github.com/cwarre33).

## Stack

- **React 18** + **TypeScript** + **Vite**
- CSS design tokens (dark theme, glass cards, DM Sans + JetBrains Mono)
- **Vitest** for analytics unit tests
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
| Hero | Typewriter titles + headline stats (4,000+ tickets, &lt;500ms search, 4 AI products) |
| About | Bio + skill groups (languages, AI, cloud/ops including Terraform, ECS, Copilot Studio) |
| Experience | Role timeline with metric-forward bullets |
| Impact at work | Animated metrics band + curated outcome cards |
| AWS & infrastructure | Shared RDS + delta sync, staging→prod CI/CD on ECS/Fargate, transcription pipeline |
| Projects | SofaScope, Breach Dashboard, AutoTrader, and more |
| Certifications / Contact | Education, certs, resume download, links |

## Content sources

| Path | Purpose |
|------|---------|
| `src/data/` | Public site copy (experience, impact, AWS, projects, skills, stats) |
| `referece_context/MASTER_RESUME.md` | Full internal inventory for tailoring resumes |
| `referece_context/my_work_*.json` | Jira contribution snapshots (private reference) |
| `docs/superpowers/` | Design specs and implementation plans |

Keep ticket IDs out of `src/`. Prefer public-safe metrics aligned with the profile README.

## Legacy

Older static HTML/CSS lives as `index-legacy.html` / `project.html` for reference only.
