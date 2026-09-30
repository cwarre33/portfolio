import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { daysSince, normalizeStatus, parseReport, parseReportPath, parseScore, parseTracker, reachedStage, yamlList } from './parse';

const TRACKER = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
| 001 | 2026-09-01 | Acme AI | Senior AI Engineer | 4.2/5 | Applied | ✅ | [001](reports/001-acme-ai-2026-09-01.md) | referral |
| 002 | 2026-09-03 | Beta | ML Engineer | 3.1/5 | Discarded | ❌ | [002](reports/002-beta-2026-09-03.md) | |
| 003 | 2026-09-10 | Gamma | AI Platform Eng | 4.6/5 | **Evaluated** | ❌ | [003](reports/003-gamma-2026-09-10.md) | |
| 004 | 2026-09-12 | Delta | SWE, AI | 4.0/5 | Interview | ✅ | [004](reports/004-delta-2026-09-12.md) | onsite 10/8 |
`;

const REPORT = `# Evaluation: Acme AI -- Senior AI Engineer

**Date:** 2026-04-01
**Archetype:** AI Platform / LLMOps Engineer
**Score:** 4.2/5
**URL:** https://jobs.example.com/acme-ai-senior-engineer

## B) CV Match

| JD Requirement | CV Match | Source |
|----------------|----------|--------|
| "Production LLM systems" | Built things | cv.md |

### Gaps

| Gap | Severity | Mitigation |
|-----|----------|------------|
| "LLM-specific experience" | Medium | Eval toolkit |
| "Kubernetes at scale" | High | ECS/Fargate ownership |

## C) Level and Strategy
`;

describe('parseTracker', () => {
  const apps = parseTracker(TRACKER);

  it('parses every data row with typed fields', () => {
    expect(apps).toHaveLength(4);
    expect(apps[0]).toMatchObject({
      num: '001',
      date: '2026-09-01',
      company: 'Acme AI',
      role: 'Senior AI Engineer',
      score: 4.2,
      status: 'applied',
      reportPath: 'reports/001-acme-ai-2026-09-01.md',
      notes: 'referral',
    });
  });

  it('normalizes markdown-decorated statuses', () => {
    expect(apps[2].status).toBe('evaluated');
    expect(apps[2].statusRaw).toBe('Evaluated');
  });

  it('resolves columns from the header, including legacy Spanish headers in any order', () => {
    const es = parseTracker(`| Estado | Empresa | Puesto | Nota | Fecha |\n|---|---|---|---|---|\n| Entrevista | Zeta | Dev | 3.9/5 | 2026-08-01 |`);
    expect(es[0]).toMatchObject({ company: 'Zeta', role: 'Dev', score: 3.9, status: 'interview', date: '2026-08-01' });
  });

  it('returns nothing for a tracker with only a header', () => {
    expect(parseTracker('| # | Date | Company | Role | Score | Status | PDF | Report | Notes |\n|---|---|---|---|---|---|---|---|---|')).toEqual([]);
  });
});

describe('funnel stages', () => {
  const apps = parseTracker(TRACKER);
  const count = (stage: Parameters<typeof reachedStage>[1]) => apps.filter((a) => reachedStage(a, stage)).length;

  it('counts everything as evaluated and later stages cumulatively, excluding discarded', () => {
    expect(count('evaluated')).toBe(4);
    expect(count('applied')).toBe(2);
    expect(count('interview')).toBe(1);
    expect(count('offer')).toBe(0);
  });
});

describe('parseReport', () => {
  it('reads header fields and the gaps table only', () => {
    const r = parseReport('reports/001.md', REPORT);
    expect(r.title).toBe('Acme AI -- Senior AI Engineer');
    expect(r.archetype).toBe('AI Platform / LLMOps Engineer');
    expect(r.score).toBe(4.2);
    expect(r.url).toBe('https://jobs.example.com/acme-ai-senior-engineer');
    expect(r.gaps).toEqual([
      { gap: 'LLM-specific experience', severity: 'Medium' },
      { gap: 'Kubernetes at scale', severity: 'High' },
    ]);
  });
});

describe('helpers', () => {
  it('parses scores and rejects out-of-range values', () => {
    expect(parseScore('4.5/5')).toBe(4.5);
    expect(parseScore('4')).toBe(4);
    expect(parseScore('9/5')).toBeNull();
    expect(parseScore('')).toBeNull();
  });

  it('extracts report paths from links and bare paths', () => {
    expect(parseReportPath('[7](reports/007-x.md)')).toBe('reports/007-x.md');
    expect(parseReportPath('reports/008-y.md')).toBe('reports/008-y.md');
    expect(parseReportPath('')).toBeNull();
  });

  it('maps unknown statuses to other', () => {
    expect(normalizeStatus('🟡 Applied')).toBe('applied');
    expect(normalizeStatus('SKIP')).toBe('discarded');
    expect(normalizeStatus('waiting')).toBe('other');
  });

  it('computes days since a date', () => {
    expect(daysSince('2026-09-20', new Date('2026-09-30T12:00:00Z'))).toBe(10);
    expect(daysSince('not a date')).toBeNull();
  });
});

describe('Machine Summary gaps (career-ops report format)', () => {
  const MS = `# Evaluation: Acme — Eng

**Score:** 3.2/5

---

## Machine Summary

\`\`\`yaml
company: "Acme"
hard_stops:
  - "5+ years required"
soft_gaps:
  - "Kubernetes not in cv.md"
  - 'No fintech domain'
top_strengths:
  - "AWS depth"
empty_list: []
\`\`\`

### Gaps

| Gap | Severity | Mitigation |
|---|---|---|
| table gap | Low | x |
`;

  it('reads YAML lists and ignores empty ones', () => {
    expect(yamlList(MS, 'soft_gaps')).toEqual(['Kubernetes not in cv.md', 'No fintech domain']);
    expect(yamlList(MS, 'hard_stops')).toEqual(['5+ years required']);
    expect(yamlList(MS, 'empty_list')).toEqual([]);
    expect(yamlList(MS, 'missing_key')).toEqual([]);
    expect(yamlList('no fence here', 'soft_gaps')).toEqual([]);
  });

  it('prefers Machine Summary gaps (hard stops as High) over the gaps table', () => {
    expect(parseReport('r.md', MS).gaps).toEqual([
      { gap: '5+ years required', severity: 'High' },
      { gap: 'Kubernetes not in cv.md', severity: 'Medium' },
      { gap: 'No fintech domain', severity: 'Medium' },
    ]);
  });

  it('maps Hired to the offer stage', () => {
    expect(normalizeStatus('Hired')).toBe('offer');
  });

  const real = '../cameron-wiki/career/reports/001-pendo-2026-09-30.md';
  it.skipIf(!existsSync(real))('parses a real career-ops report when the wiki checkout is present', () => {
    const r = parseReport(real, readFileSync(real, 'utf8'));
    expect(r.score).toBe(4.2);
    expect(r.gaps.length).toBeGreaterThan(0);
    expect(r.gaps.every((g) => g.severity === 'Medium')).toBe(true);
  });
});
