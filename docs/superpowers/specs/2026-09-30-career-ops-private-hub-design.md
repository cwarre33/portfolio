# Career-ops private hub: scope

**Status:** scoping, not started
**Date:** 2026-09-30
**Upstream:** [santifer/career-ops](https://github.com/santifer/career-ops) (MIT, v1.34.0, commit `0717a4d`)

## Goal

A private job-search cockpit for Cameron that runs career-ops against his own data and surfaces it next to the portfolio and wiki, without anything private reaching the public site or the public repo.

## What career-ops is (relevant parts)

- **Local-first CLI toolkit.** About 70 Node scripts plus Markdown prompt "modes" that an AI CLI (Claude Code, etc.) executes. It scans public ATS boards, scores postings 1–5 with an A–H report, tailors the CV to PDF, and tracks applications. It never submits applications.
- **Files are canonical.** Everything the hub needs is plain Markdown:

  | File | Contents |
  |---|---|
  | `data/applications.md` | Tracker table: `# \| Date \| Company \| Role \| Score \| Status \| PDF \| Report \| Notes` |
  | `data/pipeline.md` | URL inbox |
  | `reports/NNN-company-date.md` | Full evaluations, with score, archetype, CV-match table, gaps, and STAR stories |

- **Status states** (`templates/states.yml`): Evaluated, Applied, Responded, Interview, Offer, Rejected, Discarded.
- **Data root is separable.** `CAREER_OPS_ROOT` / `CAREER_OPS_DATA_DIR` point the tool at a user-data directory outside the tool checkout, so personal data can live in its own private repo.
- **Web UI already exists.** `web/` is a Next.js alpha app: pipeline table, analytics funnel, CV editor, and apply prefill. It is local-only, on `localhost:3000`.
- **Reusable parser.** `tracker-parse.mjs` exports `resolveColumns()` and `parseTrackerRow()`, which depend only on `fs`.

## Hard constraint: nothing private on GitHub Pages

The portfolio is a public repo deployed to public GitHub Pages. Anything bundled into `src/` is public, and a client-side password protects nothing. So the feature **must not** live in the Vite app. It extends the existing private pattern instead: `private-dashboard/serve.mjs` is bound to `127.0.0.1` and exposed only via `tailscale serve` (never `funnel`).

## Proposed architecture

```
 Mac (always-on)                                  tailnet only
┌───────────────────────────────────────────┐
│ ~/career-ops/            (tool, upstream) │
│ ~/career-ops-data/       (PRIVATE repo)   │  CAREER_OPS_ROOT
│   cv.md, config/profile.yml, data/,       │
│   reports/, interview-prep/story-bank.md  │
│                                           │
│ portfolio/private-dashboard/serve.mjs     │──► tailscale serve ──► phone / laptop
│   /            analytics links (today)    │
│   /career      pipeline cockpit (new)     │
│   /api/career  read-only JSON (new)       │
│                                           │
│ career-ops/web (optional, :3000)          │──► tailscale serve --set-path /ops
└───────────────────────────────────────────┘
        ▲ reads (build-time) ─── cameron-wiki (interview-prep/, decisions/)
```

## Phases

### Phase 0: install and seed (about half a day)

- Clone career-ops to `~/career-ops`, then run `npx @santifer/career-ops init` (or the manual onboarding).
- Create a **private** repo, `cwarre33/career-ops-data`, as the `CAREER_OPS_ROOT`.
- Seed `cv.md` from `referece_context/MASTER_RESUME.md` and `config/profile.yml`:
  - `email: cwarre33@alumni.uncc.edu`
  - `portfolio_url`: the GitHub Pages site
  - target roles: AI/ML engineer and software engineer
- Run `node verify-cv-facts.mjs` so the tailored CVs cannot invent metrics.
- Configure `portals.yml` title filters for AI/ML roles. Run `npm run scan` and one evaluation end to end.

### Phase 1: `/career` cockpit in the private dashboard (1–2 days)

- `serve.mjs` gains `GET /api/career`. It reads `CAREER_OPS_ROOT` read-only and imports the parser from the career-ops checkout (no fork, no copy):
  - tracker rows
  - status counts
  - score histogram
  - report metadata (archetype, score, gaps)
- `private-dashboard/career.html` shows four views:
  - funnel (Evaluated → Applied → Responded → Interview → Offer)
  - "apply next" queue (score ≥ 4, not yet applied, posting still live)
  - follow-ups due
  - top recurring gaps across reports
- Read-only by design. Status changes stay in the CLI or career-ops `web/`, so the hub never becomes a second writer to `applications.md`.

### Phase 2: wiki evidence bridge (about 1 day)

- A script, `private-dashboard/sync-story-bank.mjs`, compiles `interview-prep/story-bank.md` in the data root from:
  - `cameron-wiki/wiki/interview-prep/*.md`
  - `cameron-wiki/wiki/decisions/*.md` (ADRs → "why X over Y" STAR stories)
- It reuses the portfolio's visibility rule. Only `visibility: public` pages are emitted verbatim. `fls-internal` pages go in as sanitized headlines only, reusing the public metrics already in `src/data/story.ts`, so no internal detail flows into CVs or application answers.
- In `/career`, each report's CV-match and gap rows link to the wiki page or ADR that proves or closes them.

### Phase 3 (optional, public-safe): tailored portfolio deep links (about 1 day)

- The public site accepts `?for=<archetype>`, for example `?for=llmops`, and reorders or highlights Systems and Decisions for that archetype. It uses only public content.
- career-ops reports already detect an archetype. The hub shows a ready-to-paste portfolio link for each application.

## Risks and guardrails

| Risk | Guardrail |
|---|---|
| Job postings are untrusted LLM input (prompt injection) | Use career-ops' own safeguards: the `pdf` worker holds no write tools, and it never auto-submits. The hub is read-only. |
| FLS-internal detail leaking into CVs or answers | Seed `cv.md` from public-safe metrics only. The story-bank sync filters by wiki `visibility`, and `verify-cv-facts` runs before any PDF. |
| Personal data in a public repo | All data lives in the private `career-ops-data` repo. The portfolio repo holds only hub code, and the Phase 1 API reads from outside the repo. |
| Exposure beyond the tailnet | Bind to `127.0.0.1` and use `tailscale serve` only, as in the existing README. Never use `funnel`. |
| Upstream churn (v1.34, very active) | Pin a tag. Import only `tracker-parse.mjs`, and let `update-system.mjs` manage the tool checkout. |
| Platform ToS | Core scanning uses public ATS APIs only. Skip auth-gated sources such as LinkedIn scraping. |

## Open questions for Cameron

1. Is the Mac that runs `private-dashboard` always on, or should the hub run somewhere else on the tailnet?
2. Which AI CLI should run evaluations: Claude Code, or a cheaper local or free model via `ollama-eval.mjs` / `gemini-eval.mjs`?
3. Should Phase 3's public deep links be in scope?
4. Should career-ops' own `web/` UI also be exposed on the tailnet, or is the read-only `/career` cockpit enough?
