import raw from './wiki.generated.json';

/** Regenerate with `npm run sync:wiki` (reads ../cameron-wiki). */
export interface WikiNode {
  /** wiki/ section the page lives in */
  s: string;
  /** public title, or null when the page is redacted */
  t: string | null;
  /** unique wikilink degree */
  d: number;
}

export interface WikiData {
  generatedAt: string;
  totals: {
    pages: number;
    links: number;
    rawLinks: number;
    decisions: number;
    public: number;
    redacted: number;
    logEntries: number;
    firstDate: string | null;
    lastDate: string | null;
  };
  sections: Record<string, number>;
  nodes: WikiNode[];
  links: [number, number][];
}

export const wiki = raw as unknown as WikiData;

export type DomainKey = 'production' | 'research' | 'engineering' | 'decisions' | 'trading' | 'meta' | 'security';

export interface Domain {
  key: DomainKey;
  label: string;
  color: string;
  sections: string[];
}

export const domains: Domain[] = [
  {
    key: 'production',
    label: 'Production',
    color: '#ff8a5b',
    sections: ['production-systems', 'initiatives', 'integrations', 'work-log'],
  },
  { key: 'research', label: 'Kaggle & research', color: '#b89cff', sections: ['kaggle', 'benchmarks', 'models'] },
  { key: 'engineering', label: 'Techniques', color: '#5ee0d0', sections: ['techniques', 'architectures', 'tools'] },
  { key: 'decisions', label: 'Decisions', color: '#d4ff5a', sections: ['decisions', 'interview-prep'] },
  { key: 'trading', label: 'Trading', color: '#ffd166', sections: ['trading'] },
  { key: 'meta', label: 'Methodology', color: '#7aa2ff', sections: ['methodology', 'comparisons', 'core', 'people'] },
  { key: 'security', label: 'Security', color: '#8a8f98', sections: ['open-questions', 'case-studies'] },
];

const sectionToDomain = new Map<string, Domain>();
for (const d of domains) for (const s of d.sections) sectionToDomain.set(s, d);

export function domainOf(section: string): Domain {
  return sectionToDomain.get(section) ?? domains[domains.length - 2];
}

export function domainCounts(): { domain: Domain; count: number }[] {
  return domains.map((domain) => ({
    domain,
    count: domain.sections.reduce((n, s) => n + (wiki.sections[s] ?? 0), 0),
  }));
}
