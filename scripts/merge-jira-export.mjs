/**
 * One-off merge of MCP searchJiraIssuesUsingJql JSON outputs into my_work_contributions.json shape.
 * Usage: node scripts/merge-jira-export.mjs <assign1.json> <assign2.json> ... --reported <rep1.json> ...
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function normalizeDescription(desc) {
  if (desc == null) return '';
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object' && desc.type === 'doc') return '[ADF content]';
  return String(desc);
}

function normalizeIssue(issue) {
  const f = issue.fields || {};
  const assignee = f.assignee?.displayName ?? '';
  const reporter = f.reporter?.displayName ?? '';
  const fixVersions = (f.fixVersions || []).map((v) => v.name);
  return {
    key: issue.key,
    summary: f.summary ?? '',
    description: normalizeDescription(f.description),
    type: f.issuetype?.name ?? '',
    status: f.status?.name ?? '',
    priority: f.priority?.name ?? '',
    resolution: f.resolution?.name ?? '',
    assignee,
    reporter,
    labels: f.labels ?? [],
    fix_versions: fixVersions,
    created: f.created ?? '',
    updated: f.updated ?? '',
  };
}

function loadIssues(path) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return (raw.issues || []).map(normalizeIssue);
}

function countBy(items, keyFn) {
  const m = {};
  for (const it of items) {
    const k = keyFn(it) || 'Unknown';
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

const args = process.argv.slice(2);
const assignPaths = [];
const reportedPaths = [];
let mode = 'assign';
for (const a of args) {
  if (a === '--reported') {
    mode = 'reported';
    continue;
  }
  if (mode === 'assign') assignPaths.push(a);
  else reportedPaths.push(a);
}

const assigned = [];
for (const p of assignPaths) {
  assigned.push(...loadIssues(p));
}

const reported = [];
for (const p of reportedPaths) {
  reported.push(...loadIssues(p));
}

const keysAssigned = new Set(assigned.map((i) => i.key));
const keysReported = new Set(reported.map((i) => i.key));
const allKeys = new Set([...keysAssigned, ...keysReported]);

const resolvedCount = [...allKeys].filter((k) => {
  const a = assigned.find((i) => i.key === k);
  const r = reported.find((i) => i.key === k);
  const issue = a || r;
  return issue && issue.resolution && issue.resolution !== '';
}).length;

const summary = {
  total_unique_issues: allKeys.size,
  assigned_count: keysAssigned.size,
  reported_count: keysReported.size,
  resolved_count: resolvedCount,
  by_status: countBy([...assigned, ...reported.filter((i) => !keysAssigned.has(i.key))], (i) => i.status),
  by_type: countBy([...assigned, ...reported.filter((i) => !keysAssigned.has(i.key))], (i) => i.type),
};

// Dedupe by_status / by_type: count each issue once — use union of issues by key
const uniqueIssues = new Map();
for (const i of assigned) uniqueIssues.set(i.key, i);
for (const i of reported) {
  if (!uniqueIssues.has(i.key)) uniqueIssues.set(i.key, i);
}
const uniqList = [...uniqueIssues.values()];
summary.by_status = countBy(uniqList, (i) => i.status);
summary.by_type = countBy(uniqList, (i) => i.type);

const out = {
  user: {
    display_name: 'Cameron Warren',
    email: 'cameronwarren@furniturelandsouth.com',
    account_id: '712020:9ab20698-a3b5-4436-9fd2-f1086c8a78e5',
  },
  fetched_at: new Date().toISOString(),
  assigned,
  reported,
  summary,
};

const outPath = join(__dirname, '..', 'referece_context', 'my_work_contributions.json');
writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath);
console.log('assigned:', assigned.length, 'reported:', reported.length, 'unique:', allKeys.size);
