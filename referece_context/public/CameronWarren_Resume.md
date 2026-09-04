# Cameron Warren
**Software Engineer**

336-870-3371 · cwarre33@charlotte.edu · Charlotte / Winston-Salem, NC  
[github.com/cwarre33](https://github.com/cwarre33) · [linkedin.com/in/cameron-warren-73a0192b2](https://linkedin.com/in/cameron-warren-73a0192b2) · [cwarre33.github.io/portfolio](https://cwarre33.github.io/portfolio/)

---

## Summary
Software engineer shipping production full-stack systems: Next.js, TypeScript, React, PostgreSQL, REST APIs, Amazon Web Services (AWS), Terraform, CI/CD, and retail AI (computer vision, LLMs).

---

## Work Experience

### AI Research Analyst — Furnitureland South, Inc. · Jamestown, NC · Jan 2026 – Present
- Own production ClearView (Next.js, TypeScript, PostgreSQL/RDS): scan-first inventory plus shop-request operations used by 70+ staff across ~1.3M serials / 200k+ products.
- Cut grouped browse ~11s → ~150ms–1s via materialized views, query redesign, and statement-timeout guardrails; keep ~5GB / ~23 years of history fresh with a 15-minute ERP delta sync.
- Shipped shop-request queue/detail with attachments, write-back, and role-gated access; catalog reads from RDS while ops queues hit live NetSuite so staff are not waiting on lag.
- Hosted on Amazon ECS/Fargate behind internal and public ALBs with AWS WAF + Microsoft Entra ID (SSO); own staging→prod CI/CD (quality-gated Bitbucket Pipelines, OIDC/ECR, Terraform/SSM secrets).
- Built production Zendesk routing automation (custom round robin, dedicated-agent paths, feature-flagged rollouts) that has assigned 4,000+ tickets.

### Jr. AI Research Analyst — Furnitureland South, Inc. · Aug 2025 – Jan 2026
- Designed and shipped AWS async pipelines (API Gateway → Lambda → S3 → SQS → ECS/Fargate) for speech-to-text write-back and delayed chat timeout handling; benchmarked model variants for cost/latency.
- Delivered enterprise integration jobs (ERP ↔ support-platform customer sync, reporting Suitelets/SuiteQL) with logging, retries, and dry-run/live controls.
- Wrote specs, system diagrams, and acceptance criteria; partnered with stakeholders to ship behind env flags without disrupting live traffic.

### Information Technology Intern — Furnitureland South, Inc. · May 2025 – Aug 2025
- Built core of SofaScope visual search: image embedding pipeline, FAISS nearest-neighbor search, and React UI over product catalog data; iterated from research prototype to production-facing service.

---

## Projects
**SofaScope** — AI visual product search (Python, FastAPI, CLIP, FAISS, Docker)  
Optimized similarity search latency **~15s → <500ms** (~95%); Dockerized microservices for embedding + query path.

**SEC 8-K Breach Dashboard** — React, Node.js, Express, MongoDB, WebSocket · [github.com/cwarre33/BreachDashboard](https://github.com/cwarre33/BreachDashboard)  
Real-time dashboard for SEC cybersecurity filings with live updates and AI-assisted summaries.

**Dining Review API** — Java, Spring, JPA · [github.com/cwarre33/DiningReviewApplication](https://github.com/cwarre33/DiningReviewApplication)  
RESTful API for submitting and querying dining reviews with Spring Data persistence.

**AutoTrader** — Python, Docker · [github.com/cwarre33/AutoTrader](https://github.com/cwarre33/AutoTrader)  
Paper-trading bot: volume scan, RSI + LLM news sentiment, automated paper execution.

---

## Skills
**Languages:** Python, Java, JavaScript, TypeScript, SQL, HTML/CSS, C/C++ (coursework)  
**Systems:** Node.js, FastAPI, React, Next.js, Spring, PostgreSQL, Docker, REST APIs, Git, Amazon Web Services (AWS: Lambda, S3, SQS, ECS/Fargate, RDS, ALB, WAF), Terraform, CI/CD, NetSuite, Zendesk, Microsoft Entra ID  
**Engineering:** Full-stack development, performance optimization, unit and integration testing, SSO/RBAC, async jobs, API integrations, technical specs and diagrams

---

## Education
**University of North Carolina at Charlotte** — B.S. Computer Science · Dec 2025 · GPA **3.5**  
Chancellor’s List · Dean’s List  
Coursework: Software Engineering, Database Design & Implementation, Logic & Algorithms, Operating Systems, Networking

---

## Certifications
AWS Academy Cloud Foundations · Introduction to LangGraph (LangChain) · Data & Programming Foundations for AI (Codecademy)
