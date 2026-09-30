/**
 * Parsers for career-ops user files (https://github.com/santifer/career-ops, MIT).
 * Mirrors the tracker format documented in career-ops AGENTS.md:
 *   | # | Date | Company | Role | Score | Status | PDF | Report | Notes |
 * Column order is resolved from the header row, so reordered or Spanish
 * headers (career-ops' legacy format) still parse.
 */

export type StatusId = 'evaluated' | 'applied' | 'responded' | 'interview' | 'offer' | 'rejected' | 'discarded' | 'other';

export const FUNNEL: { id: StatusId; label: string }[] = [
  { id: 'evaluated', label: 'Evaluated' },
  { id: 'applied', label: 'Applied' },
  { id: 'responded', label: 'Responded' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
];

/** Order used to decide "reached at least this stage". */
const STAGE_RANK: Record<StatusId, number> = {
  evaluated: 0,
  applied: 1,
  responded: 2,
  interview: 3,
  offer: 4,
  rejected: 1,
  discarded: 0,
  other: 0,
};

export interface Application {
  num: string;
  date: string;
  company: string;
  role: string;
  score: number | null;
  status: StatusId;
  statusRaw: string;
  reportPath: string | null;
  notes: string;
}

const HEADER_ALIASES: Record<string, keyof Application | 'pdf' | 'report'> = {
  '#': 'num',
  num: 'num',
  date: 'date',
  fecha: 'date',
  company: 'company',
  empresa: 'company',
  role: 'role',
  puesto: 'role',
  score: 'score',
  nota: 'score',
  puntuación: 'score',
  status: 'status',
  estado: 'status',
  pdf: 'pdf',
  report: 'report',
  informe: 'report',
  notes: 'notes',
  notas: 'notes',
};

const STATUS_ALIASES: [RegExp, StatusId][] = [
  [/^(evaluated|evaluada|evaluado)/, 'evaluated'],
  [/^(applied|aplicad|postulad)/, 'applied'],
  [/^(responded|respond)/, 'responded'],
  [/^(interview|entrevista)/, 'interview'],
  [/^(offer|oferta|hired|contratad)/, 'offer'],
  [/^(rejected|rechazad)/, 'rejected'],
  [/^(discarded|descartad|skip|do not apply|no aplicar)/, 'discarded'],
];

function cells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((c) => c.trim());
}

const isSeparator = (line: string) => /^\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line.trim());

export function normalizeStatus(raw: string): StatusId {
  const s = raw
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .replace(/^[^a-záéíóú]+/, '')
    .trim();
  for (const [re, id] of STATUS_ALIASES) if (re.test(s)) return id;
  return 'other';
}

export function parseScore(raw: string): number | null {
  const m = raw.match(/(\d+(?:\.\d+)?)\s*\/\s*5/) ?? raw.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return v >= 0 && v <= 5 ? v : null;
}

/** Extracts `reports/...md` from a markdown link or bare path. */
export function parseReportPath(raw: string): string | null {
  const m = raw.match(/\(([^)]+\.md)\)/) ?? raw.match(/(reports\/[^\s|]+\.md)/);
  if (!m) return null;
  return m[1].replace(/^\.?\//, '').replace(/^\.\.\//, '');
}

export function parseTracker(md: string): Application[] {
  const lines = md.split('\n').filter((l) => l.trim().startsWith('|'));
  let colmap: Record<number, string> | null = null;
  const out: Application[] = [];
  for (const line of lines) {
    if (isSeparator(line)) continue;
    const c = cells(line);
    if (!colmap) {
      const lower = c.map((x) => x.toLowerCase());
      if (lower.includes('company') || lower.includes('empresa')) {
        colmap = {};
        lower.forEach((h, i) => {
          const key = HEADER_ALIASES[h];
          if (key) colmap![i] = key;
        });
      }
      continue;
    }
    const row: Record<string, string> = {};
    c.forEach((v, i) => {
      const key = colmap![i];
      if (key) row[key] = v;
    });
    if (!row.company) continue;
    out.push({
      num: row.num ?? '',
      date: row.date ?? '',
      company: row.company,
      role: row.role ?? '',
      score: parseScore(row.score ?? ''),
      status: normalizeStatus(row.status ?? ''),
      statusRaw: (row.status ?? '').replace(/[*_`]/g, ''),
      reportPath: parseReportPath(row.report ?? ''),
      notes: row.notes ?? '',
    });
  }
  return out;
}

export interface ReportSummary {
  path: string;
  title: string;
  archetype: string | null;
  score: number | null;
  url: string | null;
  gaps: { gap: string; severity: string }[];
}

/** Reads a top-level YAML string list (e.g. `soft_gaps:`) from the report's Machine Summary fence. */
export function yamlList(md: string, key: string): string[] {
  const fence = md.match(/## Machine Summary\s*```ya?ml\n([\s\S]*?)```/)?.[1];
  if (!fence) return [];
  const m = fence.match(new RegExp(`^${key}:[ \\t]*(\\[\\])?[ \\t]*\\n((?:[ \\t]*- .*\\n?)*)`, 'm'));
  if (!m || m[1]) return [];
  return m[2]
    .split('\n')
    .map((l) => l.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

export function parseReport(path: string, md: string): ReportSummary {
  const field = (name: string) => md.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*(.+)`, 'i'))?.[1].trim() ?? null;
  const title = md.match(/^#\s+(.+)$/m)?.[1].replace(/^Evaluation:\s*/i, '').trim() ?? path;
  // Preferred source: the Machine Summary YAML every career-ops report carries.
  const gaps: { gap: string; severity: string }[] = [
    ...yamlList(md, 'hard_stops').map((gap) => ({ gap, severity: 'High' })),
    ...yamlList(md, 'soft_gaps').map((gap) => ({ gap, severity: 'Medium' })),
  ];
  // Fallback: a "Gaps" markdown table (older / hand-written reports).
  const gapSection = gaps.length ? undefined : md.split(/^#{2,4}\s+Gaps\s*$/im)[1];
  if (gapSection) {
    for (const line of gapSection.split('\n')) {
      if (/^#{1,4}\s/.test(line)) break;
      if (!line.trim().startsWith('|') || isSeparator(line)) continue;
      const [gap, severity] = cells(line);
      if (!gap || /^gap$/i.test(gap)) continue;
      gaps.push({ gap: gap.replace(/^"|"$/g, ''), severity: severity ?? '' });
    }
  }
  const scoreRaw = field('Score');
  return {
    path,
    title,
    archetype: field('Archetype'),
    score: scoreRaw ? parseScore(scoreRaw) : null,
    url: field('URL'),
    gaps,
  };
}

export function reachedStage(app: Application, stage: StatusId): boolean {
  if (stage === 'evaluated') return true;
  return app.status !== 'discarded' && STAGE_RANK[app.status] >= STAGE_RANK[stage];
}

export function daysSince(date: string, now = new Date()): number | null {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000);
}
