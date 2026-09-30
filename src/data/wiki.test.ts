import { describe, expect, it } from 'vitest';
import { domainCounts, wiki } from './wiki';

describe('wiki.generated.json', () => {
  it('never names security-research pages', () => {
    const leaked = wiki.nodes.filter((n) => (n.s === 'open-questions' || n.s === 'case-studies') && n.t !== null);
    expect(leaked).toEqual([]);
  });

  it('has valid link indices and matching totals', () => {
    for (const [a, b] of wiki.links) {
      expect(wiki.nodes[a]).toBeDefined();
      expect(wiki.nodes[b]).toBeDefined();
    }
    expect(wiki.links.length).toBe(wiki.totals.links);
    expect(wiki.nodes.length).toBe(wiki.totals.pages);
    expect(wiki.nodes.filter((n) => n.t === null).length).toBe(wiki.totals.redacted);
  });

  it('maps every page to a domain', () => {
    const total = domainCounts().reduce((n, d) => n + d.count, 0);
    expect(total).toBe(wiki.totals.pages);
  });
});
