"""Generate SpaceX SWE Intern tailored resume PDF + keep MD in sync."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
OUT_PDF = ROOT / "downloads" / "CameronWarren_SpaceX_SWE_Intern.pdf"
OUT_MD = ROOT / "referece_context" / "tailored" / "CameronWarren_SpaceX_SWE_Intern.md"


def ascii(s: str) -> str:
    return (
        s.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2192", "->")
        .replace("\u00b7", "|")
        .replace("\u2022", "-")
        .replace("\u2248", "~")
        .replace("\u2194", "<->")
    )


MD = """# Cameron Warren
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
"""


def build_pdf() -> None:
    pdf = FPDF(format="Letter", unit="in")
    pdf.set_auto_page_break(auto=True, margin=0.4)
    pdf.set_margins(0.5, 0.38, 0.5)
    pdf.add_page()
    usable = pdf.w - pdf.l_margin - pdf.r_margin

    def h1(text: str) -> None:
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(20, 20, 20)
        pdf.cell(usable, 0.26, ascii(text), new_x="LMARGIN", new_y="NEXT", align="C")

    def contact(text: str) -> None:
        pdf.set_font("Helvetica", "", 8.4)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(usable, 0.16, ascii(text), new_x="LMARGIN", new_y="NEXT", align="C")

    def section(title: str) -> None:
        pdf.set_x(pdf.l_margin)
        pdf.ln(0.06)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(20, 20, 20)
        pdf.cell(usable, 0.18, ascii(title.upper()), new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y()
        pdf.set_draw_color(40, 40, 40)
        pdf.set_line_width(0.015)
        pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
        pdf.ln(0.05)
        pdf.set_x(pdf.l_margin)

    def body(text: str, bold: bool = False, size: float = 9) -> None:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "B" if bold else "", size)
        pdf.set_text_color(25, 25, 25)
        pdf.multi_cell(usable, 0.145, ascii(text))

    def bullet(text: str) -> None:
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(30, 30, 30)
        indent = 0.15
        pdf.set_x(pdf.l_margin)
        pdf.cell(indent, 0.145, "-")
        pdf.multi_cell(usable - indent, 0.145, ascii(text))
        pdf.set_x(pdf.l_margin)

    h1("Cameron Warren")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(usable, 0.17, "Software Engineer", new_x="LMARGIN", new_y="NEXT", align="C")
    contact("336-870-3371  |  cwarre33@charlotte.edu  |  Charlotte / Winston-Salem, NC")
    contact(
        "github.com/cwarre33  |  linkedin.com/in/cameron-warren-73a0192b2  |  cwarre33.github.io/portfolio"
    )

    section("Education")
    body(
        "University of North Carolina at Charlotte  -  B.S. Computer Science  |  Dec 2025  |  GPA 3.5",
        bold=True,
        size=9,
    )
    body(
        "Chancellor's List | Dean's List  |  Coursework: Software Engineering, Database Design, Algorithms, Operating Systems, Networking",
        size=8.3,
    )

    section("Experience")
    body(
        "AI Research Analyst  -  Furnitureland South, Inc.  |  Jamestown, NC  |  Jan 2026 - Present",
        bold=True,
        size=8.8,
    )
    for t in [
        "Own production full-stack delivery for an inventory platform (Next.js, TypeScript, PostgreSQL/RDS): search, item detail, history, exports, and role-based access used by sales operations.",
        "Cut filtered-search timeouts/latency via materialized snapshots, browse matviews, query redesign (removed per-row lookups), and statement-timeout guardrails under concurrent load.",
        "Stood up shared AWS RDS (~5 GB operational dataset) and a 15-minute delta-sync job so engineers share one source of truth instead of drifting local databases.",
        "Shipped Microsoft Entra ID SSO with session roles, API/UI RBAC gates, and verification tests; added Bitbucket CI (typecheck, ESLint, merge protection).",
        "Built/hardened production Node.js routing automation (caps, dedicated-agent paths, feature-flagged rollouts, JSONL telemetry) with offline unit tests and live validation.",
    ]:
        bullet(t)

    body(
        "Jr. AI Research Analyst  -  Furnitureland South, Inc.  |  Aug 2025 - Jan 2026",
        bold=True,
        size=8.8,
    )
    for t in [
        "Designed and shipped AWS async pipelines (API Gateway -> Lambda -> S3 -> SQS -> ECS/Fargate) for speech-to-text write-back and delayed timeout handling; benchmarked models for cost/latency.",
        "Delivered enterprise integration jobs (ERP <-> support-platform sync, reporting Suitelets/SQL) with logging, retries, and dry-run/live controls.",
        "Wrote specs, system diagrams, and acceptance criteria; shipped behind env flags without disrupting live traffic.",
    ]:
        bullet(t)

    body(
        "Information Technology Intern  -  Furnitureland South, Inc.  |  May 2025 - Aug 2025",
        bold=True,
        size=8.8,
    )
    bullet(
        "Built core of SofaScope visual search: image embedding pipeline, FAISS nearest-neighbor search, and React UI; iterated from research prototype to production-facing service."
    )

    section("Projects")
    body(
        "SofaScope - AI visual product search (Python, FastAPI, CLIP, FAISS, Docker)  |  sofascope.furniturelandsouth.com",
        bold=True,
        size=8.4,
    )
    bullet(
        "Optimized similarity search latency ~15s -> <500ms (~95%); Dockerized microservices for embedding + query path."
    )
    body(
        "SEC 8-K Breach Dashboard - React, Node.js, Express, MongoDB, WebSocket  |  github.com/cwarre33/BreachDashboard",
        bold=True,
        size=8.4,
    )
    bullet(
        "Real-time dashboard for SEC cybersecurity filings with live WebSocket updates and AI-assisted summaries."
    )
    body(
        "Dining Review API - Java, Spring, JPA  |  github.com/cwarre33/DiningReviewApplication",
        bold=True,
        size=8.4,
    )
    bullet(
        "RESTful API for submitting and querying dining reviews with Spring Data persistence."
    )
    body(
        "AutoTrader - Python, Docker  |  github.com/cwarre33/AutoTrader",
        bold=True,
        size=8.4,
    )
    bullet(
        "Paper-trading bot: volume scan, RSI + LLM news sentiment, automated paper execution."
    )

    section("Skills")
    body(
        "Languages:  Python, Java, JavaScript/TypeScript, SQL, C/C++ (coursework)",
        size=8.4,
    )
    body(
        "Systems:  Node.js, FastAPI, React, Next.js, Spring, PostgreSQL, Docker, AWS (Lambda, S3, SQS, ECS/Fargate, RDS)",
        size=8.4,
    )
    body(
        "Engineering:  Performance optimization, debugging, unit/integration tests, CI pipelines, SSO/RBAC, async jobs, API integrations, specs & diagrams",
        size=8.4,
    )

    section("Certifications")
    body(
        "AWS Academy Cloud Foundations | Introduction to LangGraph (LangChain) | Data & Programming Foundations for AI (Codecademy)",
        size=8.2,
    )

    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT_PDF))
    print(f"wrote {OUT_PDF} pages={pdf.page}")


def main() -> None:
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text(MD, encoding="utf-8")
    print(f"wrote {OUT_MD}")
    build_pdf()


if __name__ == "__main__":
    main()
