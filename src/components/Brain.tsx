import { domainCounts, wiki } from '../data/wiki';
import { useCountUp, useInView } from '../hooks/motion';

function Count({ to, start }: { to: number; start: boolean }) {
  return <>{Math.round(useCountUp(to, start)).toLocaleString()}</>;
}

export function Brain() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const t = wiki.totals;
  const counts = domainCounts().filter((d) => d.count > 0);

  const stats = [
    { v: t.pages, label: 'pages compiled' },
    { v: t.rawLinks, label: 'wikilinks written' },
    { v: t.decisions, label: 'architecture decision records' },
    { v: t.logEntries, label: 'logged ingests + maintenance runs' },
  ];

  return (
    <section id="brain" className="section brain">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">04 / Second brain</span>
          <h2 className="section__title">
            I don't re-derive. <em>I compile.</em>
          </h2>
          <p className="section__lede">
            Every system, decision, and competition feeds a version-controlled wiki that an LLM maintains, following Karpathy's LLM
            Wiki pattern. Sources go in immutable; knowledge comes out cross-linked. The numbers on this site are pulled from it at build time.
          </p>
        </header>

        <div ref={ref} className="brain__stats reveal">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="brain__num">
                <Count to={s.v} start={inView} />
              </span>
              <span className="brain__label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="brain__bars reveal">
          <div className="brain__bar-head mono">
            <span>composition by domain</span>
            <span>{t.pages} pages</span>
          </div>
          <div className="stack" role="img" aria-label={counts.map((c) => `${c.domain.label}: ${c.count}`).join(', ')}>
            {counts.map(({ domain, count }) => (
              <span key={domain.key} style={{ flexGrow: count, background: domain.color }} title={`${domain.label}: ${count}`} />
            ))}
          </div>
          <ul className="stack__legend">
            {counts.map(({ domain, count }) => (
              <li key={domain.key}>
                <i style={{ background: domain.color }} aria-hidden="true" />
                {domain.label} <span className="mono">{count}</span>
              </li>
            ))}
          </ul>

          <div className="brain__bar-head mono">
            <span>visibility</span>
            <span>
              {t.pages - t.redacted} named · {t.redacted} redacted
            </span>
          </div>
          <div className="stack stack--vis" aria-hidden="true">
            <span style={{ flexGrow: t.pages - t.redacted }} />
            <span style={{ flexGrow: t.redacted }} />
          </div>
          <p className="brain__note">
            Pages marked <code>fls-internal</code> or <code>private</code>, plus security-disclosure research, show up in the hero graph as
            hollow rings: the connections are real, the contents stay private.
          </p>
        </div>

        <ol className="flow reveal">
          <li>
            <span className="mono">raw/</span>
            <strong>Immutable sources</strong>
            <p>Papers, repos, production docs, competition writeups. Never edited after capture.</p>
          </li>
          <li>
            <span className="mono">wiki/</span>
            <strong>Compiled knowledge</strong>
            <p>Summaries, ADRs, and system-design notes with frontmatter, confidence levels, and contradiction flags.</p>
          </li>
          <li>
            <span className="mono">lint</span>
            <strong>Maintained graph</strong>
            <p>Automated passes find orphans, stale pages, and missing links, so the whole thing compounds over time.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
