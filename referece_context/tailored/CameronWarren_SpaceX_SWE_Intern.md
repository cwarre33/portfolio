# Cameron Warren
**Software Engineer**

336-870-3371 · cwarre33@charlotte.edu · Charlotte / Winston-Salem, NC  
[github.com/cwarre33](https://github.com/cwarre33) · [linkedin.com/in/cameron-warren-73a0192b2](https://linkedin.com/in/cameron-warren-73a0192b2) · [cwarre33.github.io/portfolio](https://cwarre33.github.io/portfolio/)

---

## Education
**University of North Carolina at Charlotte** — B.S. Computer Science · Dec 2025 · GPA **3.5**  
Chancellor’s List · Dean’s List  
Coursework: Software Engineering, Database Design & Implementation, Logic & Algorithms, Operating Systems, Networking

---

## Experience

### AI Research Analyst — Furnitureland South, Inc. · Jamestown, NC · Jan 2026 – Present
- Own production full-stack delivery for an inventory platform (Next.js, TypeScript, PostgreSQL/RDS): search, item detail, history, exports, and role-based access used by sales operations.
- Cut filtered-search timeouts and latency via materialized snapshots, browse matviews, query redesign (removed per-row detail lookups), and statement-timeout guardrails under concurrent load.
- Stood up shared AWS RDS (~5 GB operational dataset) and a 15-minute delta-sync job so engineers share one source of truth instead of drifting local databases.
- Shipped Microsoft Entra ID SSO with session roles, API/UI RBAC gates, and verification tests; added Bitbucket CI (typecheck, ESLint, merge protection).
- Built and hardened production Node.js routing/automation (daily caps, dedicated-agent paths, feature-flagged rollouts, JSONL telemetry) with offline unit tests and live validation.

### Jr. AI Research Analyst — Furnitureland South, Inc. · Aug 2025 – Jan 2026
- Designed and shipped AWS async pipelines (API Gateway → Lambda → S3 → SQS → ECS/Fargate) for speech-to-text write-back and delayed chat timeout handling; benchmarked model variants for cost/latency.
- Delivered enterprise integration jobs (ERP ↔ support-platform customer sync, reporting Suitelets/SuiteQL) with logging, retries, and dry-run/live controls.
- Wrote specs, system diagrams, and acceptance criteria; partnered with stakeholders to ship behind env flags without disrupting live traffic.

### Information Technology Intern — Furnitureland South, Inc. · May 2025 – Aug 2025
- Built core of SofaScope visual search: image embedding pipeline, FAISS nearest-neighbor search, and React UI over product catalog data; iterated from research prototype to production-facing service.

---

## Projects
**SofaScope** — AI visual product search (Python, FastAPI, CLIP, FAISS, Docker) · [sofascope.furniturelandsouth.com](https://sofascope.furniturelandsouth.com)  
Optimized similarity search latency **~15s → <500ms** (~95%); Dockerized microservices for embedding + query path.

**SEC 8-K Breach Dashboard** — React, Node.js, Express, MongoDB, WebSocket · [github.com/cwarre33/BreachDashboard](https://github.com/cwarre33/BreachDashboard)  
Real-time dashboard for SEC cybersecurity filings with live updates and AI-assisted summaries.

**Dining Review API** — Java, Spring, JPA · [github.com/cwarre33/DiningReviewApplication](https://github.com/cwarre33/DiningReviewApplication)  
RESTful API for submitting and querying dining reviews with Spring Data persistence.

**AutoTrader** — Python, Docker · [github.com/cwarre33/AutoTrader](https://github.com/cwarre33/AutoTrader)  
Paper-trading bot: volume scan, RSI + LLM news sentiment, automated paper execution.

---

## Skills
**Languages:** Python, Java, JavaScript/TypeScript, SQL, C/C++ (coursework)  
**Systems:** Node.js, FastAPI, React, Next.js, Spring, PostgreSQL, Docker, AWS (Lambda, S3, SQS, ECS/Fargate, RDS)  
**Engineering:** Performance optimization, debugging, unit/integration tests, CI pipelines, SSO/RBAC, async job design, API integrations, technical specs & diagrams

---

## Certifications
AWS Academy Cloud Foundations · Introduction to LangGraph (LangChain) · Data & Programming Foundations for AI (Codecademy)
