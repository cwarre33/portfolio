#!/usr/bin/env node
/**
 * Compile public-safe metrics + a knowledge graph from cameron-wiki into
 * src/data/wiki.generated.json. The JSON is committed so CI builds do not
 * need the wiki checkout.
 *
 *   WIKI_DIR=../cameron-wiki node scripts/sync-wiki.mjs
 *
 * Redaction: only pages with `visibility: public` that are not security /
 * disclosure research keep their title. Everything else becomes an anonymous
 * node (section + degree only) so the graph shape is real but nothing
 * internal leaks.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(process.env.WIKI_DIR ?? join(here, '../../cameron-wiki'));
const WIKI = join(WIKI_ROOT, 'wiki');
const OUT = join(here, '../src/data/wiki.generated.json');

const SKIP_FILES = new Set(['index.md', 'log.md']);
const REDACTED_SECTIONS = new Set(['open-questions', 'case-studies']);
const REDACTED_TAGS = ['security', 'osint', 'disclosure', 'ics', 'shodan', 'credential'];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return p.endsWith('.md') ? [p] : [];
  });
}

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function listField(v) {
  return (v ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const files = walk(WIKI).filter((f) => !SKIP_FILES.has(basename(f)));
const pages = files.map((file) => {
  const src = readFileSync(file, 'utf8');
  const rel = relative(WIKI, file).replace(/\\/g, '/');
  const fm = frontmatter(src);
  const section = rel.includes('/') ? rel.split('/')[0] : 'core';
  const tags = listField(fm.tags);
  const isPublic = fm.visibility === 'public';
  const sensitive =
    REDACTED_SECTIONS.has(section) || tags.some((t) => REDACTED_TAGS.some((r) => t.includes(r)));
  return {
    id: rel.replace(/\.md$/, ''),
    rel,
    src,
    section,
    visibility: fm.visibility ?? 'private',
    type: fm.type ?? '',
    title: isPublic && !sensitive ? fm.title?.replace(/^ADR:\s*/, '').replace(/\s+[—-]\s+.*$/, '') ?? null : null,
    created: fm.created ?? null,
    updated: fm.updated ?? null,
  };
});

// Resolve [[wikilinks]] by full path or basename.
const byPath = new Map(pages.map((p) => [p.id, p]));
const byBase = new Map();
for (const p of pages) byBase.set(basename(p.id), byBase.has(basename(p.id)) ? null : p);

function resolveLink(raw) {
  const target = raw.split('|')[0].split('#')[0].trim().replace(/\\$/, '');
  const clean = target.replace(/^wiki\//, '').replace(/\.md$/, '');
  return byPath.get(clean) ?? byBase.get(basename(clean)) ?? null;
}

const edgeSet = new Set();
let rawLinkCount = 0;
for (const p of pages) {
  for (const m of p.src.matchAll(/\[\[([^\]]+)\]\]/g)) {
    rawLinkCount++;
    const t = resolveLink(m[1]);
    if (!t || t.id === p.id) continue;
    const [a, b] = [p.id, t.id].sort();
    edgeSet.add(`${a}\u0000${b}`);
  }
}

const idx = new Map(pages.map((p, i) => [p.id, i]));
const links = [...edgeSet].map((k) => {
  const [a, b] = k.split('\u0000');
  return [idx.get(a), idx.get(b)];
});
const degree = new Array(pages.length).fill(0);
for (const [a, b] of links) {
  degree[a]++;
  degree[b]++;
}

const sections = {};
for (const p of pages) sections[p.section] = (sections[p.section] ?? 0) + 1;

const dates = pages.flatMap((p) => [p.created, p.updated]).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '')).sort();
const log = readFileSync(join(WIKI, 'log.md'), 'utf8');
const logEntries = (log.match(/^## \[\d{4}-\d{2}-\d{2}/gm) ?? []).length;

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: {
    pages: pages.length,
    links: links.length,
    rawLinks: rawLinkCount,
    decisions: sections.decisions ?? 0,
    public: pages.filter((p) => p.visibility === 'public').length,
    redacted: pages.filter((p) => p.title === null).length,
    logEntries,
    firstDate: dates[0] ?? null,
    lastDate: dates.at(-1) ?? null,
  },
  sections,
  nodes: pages.map((p, i) => ({
    s: p.section,
    t: p.title,
    d: degree[i],
  })),
  links,
};

writeFileSync(OUT, JSON.stringify(out) + '\n');
console.log(
  `wiki → ${relative(process.cwd(), OUT)}: ${out.totals.pages} pages, ${out.totals.links} edges, ` +
    `${out.totals.redacted} redacted, ${out.totals.decisions} ADRs`
);
