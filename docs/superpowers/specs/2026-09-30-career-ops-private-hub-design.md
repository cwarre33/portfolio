# Career-ops private hub: scope

**Status:** scoping, revised after Cameron's answers
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

## Decisions (2026-09-30)

| Question | Answer |
|---|---|
| Where the private data lives | `cwarre33/cameron-wiki`, **once it is made private**. It was public as of 2026-09-30. |
| Always-on Mac? | No. Nothing may depend on a home machine being up. |
| Evaluation runtime | Claude Code |
| Public deep links (`?for=`) | In scope |
| UX | A secret command in the portfolio's ⌘K palette opens a login page. After login, a private career-ops cockpit renders inside the portfolio. |

## Hard constraint: the bundle is public, so auth must be enforced by GitHub

GitHub Pages is static and public. Everything in the JS bundle, including the secret command and the login UI, can be read by anyone. A client-side password check protects nothing.

So the hidden command is only UX. **Security comes from where the data lives.** The career data never ships in the bundle. The page fetches it at runtime from the private `cameron-wiki` repo through the GitHub API, which refuses any request without a credential that can read that repo.

```
 public: cwarre33.github.io/portfolio              private: cwarre33/cameron-wiki
┌────────────────────────────────────┐            ┌──────────────────────────────┐
│ ⌘K → hidden command (e.g. "ops")   │            │ career/  (CAREER_OPS_ROOT)   │
│   └► /#/ops login view             │  HTTPS +   │   cv.md, config/profile.yml  │
│        GitHub credential ─────────────► token ──►   data/applications.md       │
│   └► lazy-loaded cockpit chunk     │ api.github │   data/pipeline.md, reports/ │
│        (no data in the bundle)     │   .com     │   interview-prep/story-bank  │
└────────────────────────────────────┘            │ wiki/ (existing second brain)│
                                                  └──────────────▲───────────────┘
        Claude Code session (cloud or laptop) runs career-ops ───┘ commits results
```

## Phases

### Phase 0: lock down and seed (about half a day, mostly Cameron)

- Make `cameron-wiki` private: Settings → General → Danger Zone → Change visibility. Check that its scheduled Actions (OSINT report, maintenance) still fit the private-repo minutes quota.
- Move `portfolio/referece_context/` (Jira exports, Bitbucket reference, master resume, tailored resumes) into `cameron-wiki/raw/job-search/portfolio-reference/`. Then purge it from portfolio history; this needs Cameron's go-ahead for a force-push.
- Add `cameron-wiki/career/` as the career-ops data root, using `CAREER_OPS_ROOT=career`:
  - seed `cv.md` from the master resume, using public-safe metrics only
  - `config/profile.yml` with `cwarre33@alumni.uncc.edu` and the portfolio URL
  - `portals.yml` filtered to AI/ML and SWE titles
- Pin the career-ops tool as a checked-out tag, used by Claude Code sessions. It is not vendored into either repo.

### Phase 1: runtime without an always-on machine (about half a day)

- **Scan:** a scheduled GitHub Action in `cameron-wiki` runs `node scan.mjs` daily. It is zero-token, uses public ATS APIs, and commits new URLs to `career/data/pipeline.md`.
- **Evaluate and tailor:** Claude Code runs `modes/oferta.md` / `pdf.md`, either on demand from any device (a Claude Code on the web session on `cameron-wiki`) or as a scheduled routine that evaluates new pipeline entries. It commits reports and the tracker.
- `verify-cv-facts.mjs` gates every tailored CV so nothing internal or invented reaches a PDF.

### Phase 2: the secret cockpit in the portfolio (1–2 days)

- **Entry:** a hidden ⌘K command, not listed in palette results, opens `#/ops`. `?for=` deep links and the rest of the site are untouched.
- **Login, v1 (no infrastructure):** paste a **fine-grained GitHub token** that can only read Contents on `cameron-wiki`, with a 30–90 day expiry.
  - Kept in `sessionStorage` only, so it is gone when the tab closes.
  - Sent only to `api.github.com`.
  - A "lock" button clears it.
- **Login, v2 (nicer):** "Sign in with GitHub" using a GitHub OAuth App plus a roughly 30-line token-exchange Cloudflare Worker (free tier) holding the client secret. The resulting token has the same repo-scoped access.
- **Cockpit:** a lazy-loaded route chunk that fetches `career/data/applications.md` and `reports/*.md` through the GitHub contents API. It parses them with a vendored copy of career-ops' `tracker-parse.mjs` (MIT, `fs`-free subset). Views:
  - funnel (Evaluated → Applied → Responded → Interview → Offer)
  - "apply next" (score ≥ 4, not applied)
  - follow-ups due
  - recurring gaps, each linked to the wiki page or ADR that closes it
- **Read-only:** status changes stay with Claude Code / career-ops, so the site is never a second writer.
- **Hardening:** a strict CSP meta tag (`connect-src` limited to `api.github.com` plus analytics), no third-party scripts on `#/ops`, and analytics disabled on that route.

### Phase 3: wiki evidence bridge (about 1 day)

- A script compiles `career/interview-prep/story-bank.md` from `wiki/interview-prep/` and `wiki/decisions/`. `fls-internal` pages contribute sanitized headlines only, using the public metrics in `portfolio/src/data/story.ts`.

### Phase 4: public tailored deep links (about 1 day)

- `?for=<archetype>` (for example `llmops`, `fullstack`, `cv`) reorders and highlights Systems, Decisions, and Research using public content only. The cockpit shows the ready-made link for each application, based on the archetype career-ops detected.

## Risks and guardrails

| Risk | Guardrail |
|---|---|
| Job postings are untrusted LLM input (prompt injection) | Use career-ops' own safeguards: the `pdf` worker holds no write tools, and it never auto-submits. The hub is read-only. |
| FLS-internal detail leaking into CVs or answers | Seed `cv.md` from public-safe metrics only. The story-bank sync filters by wiki `visibility`, and `verify-cv-facts` runs before any PDF. |
| Personal data in a public repo | All data lives in private `cameron-wiki`. The portfolio bundle contains UI code only. |
| "Secret" command is discoverable in public JS | By design: the command is UX, not security. Access is enforced by GitHub's repo permissions. |
| Token theft via XSS | No user-generated content, strict CSP, a fine-grained read-only single-repo token with an expiry, `sessionStorage` only, and a lock button. |
| Upstream churn (v1.34, very active) | Pin a tag. Import only `tracker-parse.mjs`, and let `update-system.mjs` manage the tool checkout. |
| Platform ToS | Core scanning uses public ATS APIs only. Skip auth-gated sources such as LinkedIn scraping. |

## Open questions

1. Login v1 (paste a fine-grained token) or v2 (Sign in with GitHub via a small Cloudflare Worker)?
2. The hidden command word.
