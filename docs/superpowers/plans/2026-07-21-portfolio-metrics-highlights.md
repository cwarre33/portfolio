# Portfolio Metrics Highlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Impact, AWS, skills, and light Experience copy so the public portfolio leads with CRR volume, RDS query wins, conversational AI, and Terraform/ECS skills.

**Architecture:** Content-only updates to existing data modules and one AWS section intro string. No new components or layout changes.

**Tech Stack:** React 18, TypeScript, Vite; data in `src/data/*.ts`.

## Global Constraints

- No Jira ticket IDs (FLSP/FLSM/FLSI) on the site
- CRR metric wording: **4,000+ tickets assigned**
- Prefer “inventory lookup” over internal “ClearView” unless already public elsewhere
- Keep existing Impact/AWS card chrome; metrics live in copy and tags
- Spec: `docs/superpowers/specs/2026-07-21-portfolio-metrics-highlights-design.md`

---

### Task 1: Rewrite Impact at Work cards

**Files:**
- Modify: `src/data/impactAtWork.ts`

**Interfaces:**
- Consumes: existing `ImpactAtWorkItem` shape (`title`, `emoji`, `impact`, `outcomes`, `tags`)
- Produces: same export `impactAtWork` with updated content

- [x] **Step 1: Update all six cards per spec**
  - Inventory: RDS browse ~11s → ~150ms–1s / ~500ms class; ~5GB; ~15-min sync; Entra + CI; tags include Terraform/ECS/RDS as appropriate
  - Visual search: keep SofaScope ~15s → &lt;500ms
  - Conversational AI: SellSmart + Digital-to-Store; Copilot Studio / NetSuite grounding
  - Automation: lead with **4,000+ tickets assigned** via custom round robin; dedicated-agent + caps
  - AWS card: retitle away from POC; ECS/Fargate, Terraform/SSM, RDS, Lambda
  - Ops reporting: light polish only

- [x] **Step 2: Sanity-check TypeScript still typechecks** (`npx tsc --noEmit` or project build)

---

### Task 2: Refresh AWS infrastructure cards + intro

**Files:**
- Modify: `src/data/awsWork.ts`
- Modify: `src/components/AwsWork.tsx` (intro paragraph only)

**Interfaces:**
- Consumes: existing `AwsWorkItem` shape
- Produces: three cards — (1) Shared RDS + delta sync, (2) Inventory app on ECS/Fargate, (3) Call transcription pipeline

- [x] **Step 1: Replace `awsWork` array** with the three target cards and metric-forward outcomes/costs
- [x] **Step 2: Update AwsWork intro** to cover cloud platforms + serverless automations
- [x] **Step 3: Verify section still renders** (dev build or typecheck)

---

### Task 3: Skills chips + Experience polish

**Files:**
- Modify: `src/data/skills.ts`
- Modify: `src/data/experience.ts`

- [x] **Step 1: Add Terraform, ECS/Fargate, Copilot Studio** to skill groups without bloating
- [x] **Step 2: Optional — one AI Research Analyst bullet** mentioning CRR 4,000+ and/or RDS query work
- [x] **Step 3: Run production build** (`npm run build`) to confirm clean compile

---

### Task 4: Verification

- [x] **Step 1: `npm run build`** succeeds
- [x] **Step 2: Grep site data for forbidden ticket keys** (`FLSP-`, `FLSM-`, `FLSI-`) — must be zero in `src/`
- [x] **Step 3: Confirm key phrases present** — `4,000+`, Terraform, Copilot, ~11s or 500ms / browse latency language
