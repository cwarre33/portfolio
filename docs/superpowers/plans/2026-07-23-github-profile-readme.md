# GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `cwarre33/cwarre33` README with a recruiter-first, metrics-heavy profile and sync GitHub bio/website.

**Architecture:** Static Markdown with shields.io badges only; no Actions. Profile fields updated via GitHub API.

**Tech Stack:** Markdown, shields.io, `gh` CLI.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-23-github-profile-readme-design.md`
- Exactly four metric shields; no ticket IDs; Dec 2025 education
- Website: `https://cwarre33.github.io/portfolio/`

---

### Task 1: Clone profile repo and write README

**Files:**
- Create/overwrite: `cwarre33/cwarre33/README.md` (clone under `/tmp` or sibling dir)

- [ ] **Step 1:** Clone `https://github.com/cwarre33/cwarre33.git`
- [ ] **Step 2:** Write README per spec (header, 4 metric shields, what I ship, stack, CTA)
- [ ] **Step 3:** Commit on `main`

---

### Task 2: Update GitHub profile fields

- [ ] **Step 1:** `gh api` PATCH user — bio + blog URL
- [ ] **Step 2:** Verify with `gh api user` and open https://github.com/cwarre33

---

### Task 3: Push and verify

- [ ] **Step 1:** Push README commit to `origin/main`
- [ ] **Step 2:** Confirm raw README renders expected strings (4,000+, 22x, portfolio link)
