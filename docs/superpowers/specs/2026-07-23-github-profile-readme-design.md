# GitHub profile README redesign

**Date:** 2026-07-23  
**Status:** Draft — pending user review  
**Repo:** `cwarre33/cwarre33` (GitHub profile README)  
**Goal:** Recruiter first-impression — short, metric-heavy, links to portfolio

## Locked preferences

- Optimize for: **A — recruiter first-impression**
- Visual density: **B — light shields.io badges for the four metrics** (+ compact tech/link badges)
- Inspiration: Anurag Hazra (metric punch), Simon Willison (profile = hook), Mike Babb (one-line ships)

## Also update (GitHub user profile fields)

| Field | New value |
|-------|-----------|
| Bio | AI Research Analyst at Furnitureland South · building production AI, automation, and cloud systems · B.S. CS, UNC Charlotte |
| Blog / website | `https://cwarre33.github.io/portfolio/` (drop `/index.html`) |

## README structure

1. **Header** — Cameron Warren; role line (AI Research Analyst @ Furnitureland South · B.S. CS, UNC Charlotte, Dec 2025); shields for Portfolio · LinkedIn · Email  
2. **Metrics row** — exactly four shields:
   - `4,000+` tickets auto-assigned  
   - `22x` faster inventory browse  
   - `<500ms` AI visual search (was 15s)  
   - `4` AI products shipped  
3. **What I ship** — four one-line bullets (CRR automation, inventory + RDS + staging→prod CI/CD, SellSmart + Digital-to-Store Copilot, SofaScope)  
4. **Stack** — compact tech shields: Python, TypeScript, Next.js, AWS, Terraform, PostgreSQL, Copilot Studio (optional: Zendesk / NetSuite if space)  
5. **CTA** — architecture & write-ups → portfolio URL  

## Out of scope / cut

- Long ASCII architecture diagrams  
- Broken/empty image badges, typing SVG, visitor counters, WakaTime  
- POC-framed Whisper deep-dive essay  
- “Aspiring” / “Dec 2026” language  
- Giant skill tables  

## Privacy

- No Jira ticket IDs  
- Public-safe metrics only (aligned with portfolio)  

## Implementation touchpoints

| Action | Where |
|--------|--------|
| Replace README | Clone or edit `cwarre33/cwarre33` |
| Update bio + website | `gh api` user PATCH |
| Verify | Open https://github.com/cwarre33 |

## Success criteria

- Above-the-fold shows role + four metrics + portfolio link within one screen  
- Profile bio matches production-engineer positioning  
- README renders cleanly with no broken images  
