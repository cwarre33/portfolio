# Portfolio metrics highlights design

**Date:** 2026-07-21  
**Status:** Draft — pending user review  
**Site:** https://cwarre33.github.io/portfolio/  
**Sources:** cameron-wiki FLS catch-up (2026-07-21), portfolio `impactAtWork` / `awsWork` / `skills` / `experience`

## Goal

Refresh public portfolio copy so it showcases Cameron’s strongest production work: complex contact-center automations, conversational AI, AWS/Terraform/infra skills, and hard metrics (CRR volume + RDS query performance). Layout and visual language stay the same — **content-only refresh**.

## Non-goals

- No new metrics strip / dashboard UI
- No ticket IDs, Jira project keys, or deep internal process dumps
- No full redesign of Impact/AWS card chrome
- No commit of internal wiki pages into the public site

## Locked public-safe metrics

| Metric | Public wording | Notes |
|--------|----------------|-------|
| Custom round robin volume | **4,000+ tickets assigned** | Lifetime / since go-live; use “4,000+” not a false-precise count |
| Default grouped browse | **~11s → ~150ms–1s** | Matview / default-browse path |
| Warm snapshot statements | **~11s → ~500ms** | `AS MATERIALIZED` + ANALYZE path |
| Filtered browse | **~10.4s → ~2.2s** | Secondary; prefer leading with default or warm snapshot in short bullets |
| Shared RDS | **~5GB**, **~23 years** inventory history | Postgres read plane |
| Delta sync | **~15 min** production cadence | NetSuite → RDS multi-lane |
| Prod seed scale | **~1.96M** transactions / **~11.5M** lines | Optional AWS-card detail; skip if copy feels crowded |
| SofaScope | **~15s → &lt;500ms** | Already on Projects; keep aligned on Impact |
| Hosting cost | Incremental **~$141/mo**; total steady-state **~$171/mo** | Optional; prefer architecture outcomes over spend if space is tight |

## Approach (approved)

**Content refresh only** — rewrite Impact + AWS + skills (+ light Experience polish if needed). Same components and grid.

## Impact at Work (6 cards)

Keep six cards. Lead heroes with metrics; demote weaker POC tone.

1. **Inventory lookup platform**  
   - Impact: scan-first floor tool backed by shared AWS RDS + automated NetSuite delta sync.  
   - Outcomes: call out browse/query wins (~11s → sub-second / ~500ms class); 5GB / 15-min sync; Entra SSO + CI.  
   - Tags: add Terraform / ECS where accurate for the product surface.

2. **AI visual product discovery**  
   - Keep SofaScope latency story (15s → &lt;500ms). Light polish only.

3. **Conversational AI for the sales floor**  
   - SellSmart Copilot + Digital-to-Store Copilot track.  
   - Outcomes: NetSuite grounding / KB sync cadence; discovery use cases; feedback/analytics loop.  
   - Tags: Copilot Studio, LLMs, SuiteQL / NetSuite.

4. **Customer service automation platform**  
   - Lead outcome: custom round robin **4,000+ tickets assigned**.  
   - Supporting: dedicated-agent preference, daily caps, dual tagging, env-flagged rollouts, transcripts / sync.  
   - Tags: Zendesk, Node.js, automation, routing.

5. **AWS & cloud infrastructure** (retitle away from “proof / POC”)  
   - ECS/Fargate hosting, Terraform-managed secrets/SSM, shared RDS, Lambda/SQS event paths.  
   - Outcomes: hosted inventory app path; reuse patterns for sync and serverless automations.  
   - Tags: AWS, Terraform, ECS, RDS, Lambda.

6. **Operations visibility & NetSuite reporting**  
   - Keep as supporting card; no new vanity metrics unless already public-safe.

## AWS & infrastructure section

Replace the “Lambdas only” impression while keeping one strong serverless story.

**Target set (3 cards):**

1. **Shared RDS + NetSuite delta sync** — 5GB / 23-yr history, 15-min cadence, browse query latency wins.  
2. **Inventory app on ECS/Fargate** — containerized Next.js behind ALB; Terraform/SSM secrets; Entra SSO.  
3. **Keep one serverless winner** — prefer Call Transcription pipeline (richest architecture) *or* Chat Timeout if space/cost story is clearer; drop or fold Dedicated Agent Assigner into Impact automation card so the AWS grid isn’t three near-identical Lambdas.

Intro copy: shift from “serverless and event-driven only” to “cloud platforms + serverless automations.”

## Skills

Add chips that match the show-off themes (without bloating into a laundry list):

- **Data, Cloud & Ops:** Terraform, ECS/Fargate (or ECS), keep AWS / PostgreSQL / Zendesk / NetSuite / Entra ID / Bitbucket CI  
- **Backend & AI:** Copilot Studio (or keep LLMs and add Copilot Studio), keep CLIP/FAISS/Docker  

Optional Hero rotating titles: ensure “conversational AI”, “contact-center automation”, and “cloud & DevOps” remain; no structural change required if already present.

## Experience (light touch)

Only if Impact/AWS already carry the metrics: one AI Research Analyst bullet may mention CRR volume or RDS/query work so the timeline section doesn’t lag. Do **not** duplicate every metric in Experience.

## Privacy / disclosure

- No FLSP/FLSM/FLSI keys on the site  
- Prefer product-category language (“inventory lookup”, “custom round robin”) over internal codenames when unsure; “ClearView” only if already comfortable on a public resume  
- Metrics are approximate ceilings/ranges as locked above

## Implementation touchpoints

| File | Change |
|------|--------|
| `src/data/impactAtWork.ts` | Rewrite card copy + tags per plan |
| `src/data/awsWork.ts` | Replace/reorder three cards; update intro via component if needed |
| `src/components/AwsWork.tsx` | Intro sentence only |
| `src/data/skills.ts` | Add Terraform, ECS, Copilot Studio as needed |
| `src/data/experience.ts` | Optional one-bullet polish |

No new components. No CSS redesign unless a line wraps poorly (fix after copy).

## Success criteria

- Visitor scanning Impact + AWS sees **4,000+ tickets**, **RDS query speedups**, and **Terraform/ECS/conversational AI** within one scroll of those sections  
- Skills chips reflect those competencies  
- Site still feels curated, not a Jira dump  

## Out of scope for this change

Visitor analytics, private dashboard, resume PDF regeneration, wiki sync automation.
