import { useEffect, useState } from 'react';
import { domainCounts, wiki, type DomainKey } from '../data/wiki';
import { KnowledgeGraph } from './KnowledgeGraph';
import { GITHUB, LINKEDIN, RESUME_HREF } from './links';
import { trackEvent } from '../analytics/track';

function useWide() {
  const query = '(min-width: 960px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    // Safari < 14 only has addListener.
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);
  return wide;
}

export function Hero() {
  // Hover previews a domain; click/tap pins it.
  const [hovered, setHovered] = useState<DomainKey | null>(null);
  const [pinned, setPinned] = useState<DomainKey | null>(null);
  const focus = hovered ?? pinned;
  const wide = useWide();
  const t = wiki.totals;

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__graph">
        <KnowledgeGraph focus={focus} centerX={wide ? 0.66 : 0.5} />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__hud hero__hud--tr mono" aria-hidden="true">
        <span className="live-dot" /> wiki.sync · {wiki.generatedAt}
        <br />
        {t.pages} nodes · {t.links} edges · {t.decisions} ADRs
      </div>

      <div className="container hero__inner">
        <p className="eyebrow reveal">AI Research Analyst · Furnitureland South · UNC Charlotte CS</p>
        <h1 className="hero__title reveal">
          Cameron Warren
          <span className="hero__line">
            builds AI systems that ship, <em>and a second brain that remembers why.</em>
          </span>
        </h1>
        <p className="hero__lede reveal">
          Production visual search, inventory platforms, contact-center automation, and LLM evaluation harnesses. The
          graph behind this text is my working knowledge base: {t.pages} pages, {t.rawLinks.toLocaleString()} wikilinks,
          rendered live. Drag it. Hover a node.
        </p>
        <div className="hero__actions reveal">
          <a href="#systems" className="btn btn--primary">
            Explore the systems <span aria-hidden="true">→</span>
          </a>
          <a href={RESUME_HREF} className="btn btn--ghost" download onClick={() => trackEvent('resume_download')}>
            Résumé <span aria-hidden="true">↓</span>
          </a>
          <a href={GITHUB} className="btn btn--icon" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
          <a href={LINKEDIN} className="btn btn--icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero__legend" role="group" aria-label="Highlight a knowledge domain">
        {domainCounts().map(({ domain, count }) => (
          <button
            key={domain.key}
            type="button"
            className={`legend-chip${focus === domain.key ? ' is-on' : ''}`}
            style={{ ['--chip' as string]: domain.color }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(domain.key)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(null)}
            onClick={() => setPinned((f) => (f === domain.key ? null : domain.key))}
            aria-pressed={pinned === domain.key}
          >
            <i aria-hidden="true" />
            {domain.label}
            <span className="mono">{count}</span>
          </button>
        ))}
      </div>

      <a href="#impact" className="hero__scroll mono" aria-label="Scroll to impact">
        scroll <span aria-hidden="true" />
      </a>
    </section>
  );
}
