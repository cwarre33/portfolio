# Cameron Warren : Master Resume (Complete Inventory)

> **Purpose:** Single source of truth for all experience, projects, and delivery themes. Tailor down for specific applications; do not send this full document as-is unless asked for a complete work history.
>
> **Last synced:** 2026-07-21 
> **Sources:** Jira (FLSI / FLSP / FLSM / ITT), Bitbucket (`ja-utlity-shed`, `inventory-lookup`, `zendesk-tools`, `sellsmart-tools`), cameron-wiki FLS catch-up (2026-07-21), portfolio site data, prior resume PDFs.

---

## Contact

- **Name:** Cameron Warren 
- **Phone:** 336-870-3371 
- **Email:** cwarre33@charlotte.edu / cwarre33@uncc.edu 
- **Location:** Winston-Salem / Charlotte, NC 
- **GitHub:** https://github.com/cwarre33 
- **LinkedIn:** https://linkedin.com/in/cameron-warren-73a0192b2 
- **Portfolio:** https://cwarre33.github.io/portfolio/

---

## Professional Summary

AI / full-stack engineer at Furnitureland South building production systems across **inventory lookup (Next.js + PostgreSQL/RDS)**, **Zendesk contact-center automation**, **NetSuite integrations**, and **retail AI** (visual search, Copilot/LLM tooling). Comfortable owning features end-to-end: design → implementation → CI/CD (staging→prod on ECS/Fargate) → task-server ops → post-prod validation.

**Headline metrics (public-safe):** 4,000+ tickets auto-assigned by custom round robin · inventory browse ~11s → ~150ms-1s (warm snapshot ~500ms; filtered ~10.4s → ~2.2s) · visual search ~15s → <500ms · ~5GB / ~23-yr RDS read plane synced every ~15 min.

**Jira footprint (as of 2026-07-09):** 324 unique issues · 316 assigned · 200 reported · ~280 Done / Deployed / Closed.

---

## Experience

### AI Research Analyst : Furnitureland South, Inc. 
**Jamestown, NC · Jan 2026 - Present**

- Lead delivery on enterprise AI and internal platforms: Inventory Lookup / ClearView, Zendesk custom round-robin / dedicated-agent routing (4,000+ tickets auto-assigned), NetSuite↔Zendesk customer sync, and SellSmart / Digital-to-Store Copilot agents.
- Built and own the staging→prod CI/CD pipeline on ECS/Fargate: quality-gated Bitbucket Pipelines → OIDC → ECR → auto-deploy staging → manual digest promotion to prod, with fully separated environments (own ECS services, RDS, DNS) and Terraform/SSM-managed secrets.
- Own production task-server jobs, shared AWS RDS for multi-dev parity (browse perf ~11s → sub-second via matviews/query redesign), and Entra ID SSO with role-based pricing.
- Partner with Service, Sales, and IT stakeholders; write specs/plans, ship behind feature flags, and validate live runs.

### Jr. AI Research Analyst : Furnitureland South, Inc. 
**Jamestown, NC · Aug 2025 - Jan 2026**

- Researched and evaluated AI models and architectures for retail use cases (CLIP/FAISS visual search, speech-to-text, Copilot Studio agents).
- Built AWS proof components for call transcription (S3 → SQS → ECS/Whisper → Zendesk write-back) and chat timeout / dedicated-agent Lambdas.
- Bridged research findings into shippable product work (SofaScope, Stella bot, SellSmart knowledge sync).

### Information Technology Intern : Furnitureland South, Inc. 
**Jamestown, NC · May 2025 - Aug 2025**

- Supported IT operations and early SofaScope / visual-search R&D (embedding pipeline, FAISS, React UI, Akeneo product data).
- Contributed to Zendesk tooling foundations and internal documentation.

### Maintenance : Meadowlands Golf Club 
**Winston-Salem, NC · May 2023 - Aug 2023**

- Led daily landscaping and course maintenance under early-morning time constraints; high customer-facing quality bar.

### Foodrunner : Texas Roadhouse 
**High Point, NC · Jun 2021 - Mar 2022**

- Advanced from Busboy to Foodrunner in one month; coordinated with waitstaff to improve order delivery speed and accuracy.

---

## Work Themes (Master Bullet Bank)

Use these as the pool when tailoring. Ticket keys are for *your* reference only : strip them for external resumes.

### 1. Inventory Lookup / SellSmart Clone (Bitbucket: `inventory-lookup`)

**Stack:** Next.js, TypeScript, PostgreSQL / AWS RDS, NetSuite sync, Microsoft Entra ID (Auth.js), Bitbucket Pipelines.

- Built scan-first inventory search and results UX (location filters, tags, role-based pricing, Excel/CSV export, client-side sort).
- Delivered item detail (barcode view), item history/activity, FSO/SPO labeling, On Order clarity, and NetSuite deep links (prod vs SB1).
- Stood up shared AWS RDS PostgreSQL for the team (~5 GB, ~23-yr NetSuite-derived history) and automated 15-min multi-lane delta-sync on the task server (drain-safe watermarks, FLSP-547 stall fix).
- Performance: default grouped browse ~11s → ~150ms-1s via `vmpn_browse_default` matview; warm snapshot statements ~11s → ~500ms (`AS MATERIALIZED` + ANALYZE); filtered browse ~10.4s → ~2.2s via `vmpn_serial_snapshot`; query redesign removing per-row detail lookups; statement_timeout guardrails; concurrent-user capacity work.
- Hosting & CI/CD (FLSP-403): containerized Next.js on ECS/Fargate behind the estate's first internal ALB : staging + prod as fully separated environments; Bitbucket Pipelines `verify:ci` gate → OIDC → ECR → auto staging deploy → manual digest promotion to prod; Terraform/SSM-managed secrets; Entra SSO; prod live 2026-07-16 (~1.96M txns / ~11.5M lines seeded).
- Instant return / cached search state; fixed back-navigation and loading-spinner races.
- Security: Microsoft Entra ID SSO; session roles from NetSuite employee + Entra group fallback; API/UI RBAC gating and verification tests.
- CI: Bitbucket Pipeline quality gate (typecheck, ESLint, merge protection).
- EZ Tags deep-link barcode prefill; transaction parity fixes vs NetSuite production.

**Representative tickets:** FLSP-384, 386-388, 391, 397-402, 414, 416-419, 446, 474, 490-496, 511, 532-534, 547-549, 551, 585, 587-588, 646, 417 · FLSP-222 / FLSP-399 (role-based pricing).

### 2. Zendesk Contact-Center Automation (Bitbucket: `ja-utlity-shed`, `zendesk-tools`)

**Stack:** Node.js, Zendesk APIs, task-server `.bat` jobs, AWS Lambda / SQS (select flows), JSONL telemetry.

- Custom round robin (CRR) for VCS/CCS/CI groups: **4,000+ tickets auto-assigned in production** : daily caps, roster controls, supervisor exclusions, live/dry-run via env flags.
- Organization dedicated-agent routing; vendor dedicated assigns count toward daily cap with dual tags + `assignment_kind` telemetry (FLSM-33); CRR daily log compile / cleanup (FLSM-34).
- CCS native vs custom RR merge strategy with feature-flag style env toggles so live VCS was never disrupted.
- Call auto-transcription task-server job (faster-whisper path; empty-recording tagging); chat 3-minute timeout handler; dedicated-agent Lambda assigner.
- Zendesk views cleanup, agent “All Tickets” access, returns reporting, case-initiator dashboard, supervisor daily activity email automation.
- NetSuite → Zendesk customer sync replacing SmartConnect (FLSM-20); OAuth token refresh planning for custom apps (FLSM-24).

**Representative tickets:** FLSP-81, 102, 132-133, 138, 162-163, 197 · FLSM-20, 33-35 · FLSI-2066, 2672, 2965, 2968 · ZendeskCallAutoTranscript commits.

### 3. NetSuite Integrations & Reporting (Bitbucket: `ja-utlity-shed`)

- Choros / D2K / voucher / commission reporting pipelines; SuiteQL and ODBC; Suitelets (Review All Barcodes, role-based pricing views).
- Voucher report completeness vs Customer Allowances/GCs; line-memo SO linkage; Zendesk enrichment opt-in.
- NS case lookup primary linking for support cases; listrecords / ns.js utilities for live ops.

**Representative tickets:** FLSP-132, 133, 222, 305 · FLSM-20 · FLSP-159 (barcodes suitelet).

### 4. Retail AI : SofaScope, Stella, SellSmart Copilot (Bitbucket: `sellsmart-tools` + FLSI)

**Stack:** Python, FastAPI, CLIP, FAISS, Docker, Microsoft Copilot Studio, NetSuite ODBC/SuiteQL.

- SofaScope visual product discovery: embedding pipeline, FAISS similarity search, React UI, Akeneo product data; public latency story 15s → &lt;500ms.
- Stella bot front-page off-hours experience; knowledge-base gap work; SofaScope Copilot tool and training/walkthrough docs.
- SellSmart Copilot: guidance behavior, data sources, DC validation, furniture discovery use cases; KB monthly sync; vendor promo / tariff visibility; analytics via Copilot agent builder.
- SellSmart tools: NetSuite data sync into Copilot KB, conversation diagnostics, LLM-assisted improvement suggestions.

**Representative tickets:** FLSI-1490-1621 (SofaScope build), 2593, 2623, 2670, 2826 · FLSI-2760 / 2862 / 2869 · FLSM-5 · FLSP-85-89, 247-251 · SofaScope live: https://sofascope.furniturelandsouth.com

### 5. AWS / Cloud & CI/CD

- ClearView production hosting: ECS/Fargate (staging + prod services) behind internal ALB; Terraform/SSM secrets; Entra SSO; incremental cost ~$141/mo (~$171/mo total steady-state).
- CI/CD pipeline ownership: Bitbucket Pipelines quality gate (`verify:ci`) → OIDC role → ECR → auto-deploy staging → manual image-digest promotion to prod; fully separated staging/prod environments (ECS, RDS, DNS).
- Call transcription pipeline: API Gateway → Lambda → S3 (TTL) → SQS → ECS Fargate (Whisper) → Zendesk.
- Chat timeout: Zendesk trigger → Lambda → delayed SQS → ticket update; dedicated agent assigner Lambda.
- Shared RDS Postgres for Inventory Lookup (estate's first Postgres RDS; first durable AWS footprint for that product).

**Representative tickets:** FLSI-2764 · FLSP-403 / 412 / 728 (hosting + CI/CD) · FLSP-446 / 511 · portfolio AWS section.

---

## Personal / Public Projects

| Project | Description | Stack / Link |
|--------|-------------|--------------|
| **SofaScope** | AI visual search for world’s largest furniture store | Python, FastAPI, CLIP, FAISS, Docker : [live](https://sofascope.furniturelandsouth.com) |
| **SEC Breach Dashboard** | Real-time SEC 8-K Item 1.05 breach filings + AI summaries | React, Node, Express, MongoDB, WebSocket, Chart.js : [repo](https://github.com/cwarre33/BreachDashboard) |
| **AutoTrader** | Paper trading bot: volume scan, RSI + LLM news sentiment | Python, Docker : [repo](https://github.com/cwarre33/AutoTrader) |
| **AutomationAgent** | Short-form content gen/edit/post agents + Streamlit dashboard | Python, Streamlit : [repo](https://github.com/cwarre33/AutomationAgent) |
| **FInVision** | Financial data visualization | Python : [repo](https://github.com/cwarre33/FInVision) |
| **Dining Review API** | REST API for restaurant reviews | Java, Spring, JPA : [repo](https://github.com/cwarre33/DiningReviewApplication) |
| **React Weather App** | Weather dashboard | React : [live](https://cwarre33.github.io/React-Weather-App/) |
| **EDA-NASDAQ** | NASDAQ analysis 1962-2024 (Sharpe, vol, correlations) | Python, pandas, matplotlib, seaborn : [repo](https://github.com/cwarre33/EDA-NASDAQ) |
| **Colmar Academy** | Responsive multi-section marketing site | HTML/CSS (Jun 2024) |
| **algo-vault** | Polyglot algorithms (Hacktoberfest) | Go, TS, Python, JS, C#, C++ |

---

## Skills

**Languages:** Python, TypeScript/JavaScript, Java, SQL, HTML/CSS · (familiar: C/C++) 
**Backend / AI:** FastAPI, Node.js, Spring, CLIP, FAISS, LLMs / Copilot Studio, Whisper / speech-to-text, LangGraph (course) 
**Frontend:** React, Next.js, Material-UI, Chart.js 
**Data / Cloud:** PostgreSQL (matviews, query tuning), AWS (S3, Lambda, SQS, ECS/Fargate, RDS, ALB, ECR), Terraform, Docker, vector search 
**Integrations / Ops:** Zendesk APIs, NetSuite (SuiteQL, ODBC, SuiteScript/Suitelets), Bitbucket Pipelines, Jira, task-server automation, Microsoft Entra ID / Auth.js 
**Practices:** TDD / offline harnesses, feature flags, observability (JSONL telemetry), RBAC, CI/CD quality gates, staging→prod environment separation with manual promote

---

## Education

**B.S. Computer Science : University of North Carolina at Charlotte** 
Aug 2022 - Dec 2025 · GPA 3.5 
**Honors:** Chancellor’s List, Dean’s List 
**Coursework:** Software Engineering, Database Design & Implementation, Logic & Algorithms

---

## Certifications & Professional Development

- AWS Academy Graduate : Cloud Foundations (AWS)
- Introduction to LangGraph (LangChain)
- Data and Programming Foundations for AI (Codecademy)
- Build a Website with HTML, CSS, and GitHub Pages (Codecademy)
- Learn Java (Codecademy)
- Deeplearning.AI : ChatGPT & Meta Llama prompt engineering
- Additional Codecademy: Data with JPA, Spring Context, Responding to Requests, EDA in Python, Intro to ML

---

## Interests

Trail running, hiking, backpacking, climbing, yoga, reading, meditation

---

## Tailoring Cheat Sheet

| Target role | Emphasize sections |
|-------------|-------------------|
| Full-stack / Next.js | Inventory Lookup theme + personal React/Next projects |
| AI / ML engineer | SofaScope, SellSmart Copilot, Whisper, CLIP/FAISS, research analyst titles |
| Platform / integrations | Zendesk CRR, NetSuite sync, AWS Lambdas, task-server ops |
| Cloud / DevOps | ECS/Fargate CI/CD (staging→prod promote), Terraform/SSM, RDS + delta sync, env-flagged rollouts |
| New grad / entry | Education + personal projects + intern → analyst progression; trim ticket appendix |

---

## Internal Appendix : Delivery Repos

| Repo | Remote |
|------|--------|
| ja-utlity-shed | https://bitbucket.org/furniturelandsouth/ja-utlity-shed.git |
| inventory-lookup | https://bitbucket.org/furniturelandsouth/inventory-lookup.git |
| zendesk-tools | https://bitbucket.org/furniturelandsouth/zendesk-tools.git |
| sellsmart-tools | https://bitbucket.org/furniturelandsouth/sellsmart-tools.git |

See also: `my_work_contributions.json`, `my_work_jira_contributions.json`, `bitbucket_delivery_reference.md` in this folder.
