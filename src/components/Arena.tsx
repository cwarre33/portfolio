import { useState } from 'react';
import { kaggle, labs } from '../data/story';

function prizeValue(p: string): number {
  const m = p.match(/\$([\d.]+)(k|M)?/);
  if (!m) return 0;
  return parseFloat(m[1]) * (m[2] === 'M' ? 1e6 : m[2] === 'k' ? 1e3 : 1);
}

const domainsInOrder = [...new Set(kaggle.competitions.map((c) => c.domain))];

export function Arena() {
  const [hot, setHot] = useState<number | null>(null);
  const size = 360, c = size / 2;

  const points = kaggle.competitions.map((comp, i) => {
    const di = domainsInOrder.indexOf(comp.domain);
    const sameDomain = kaggle.competitions.filter((x, j) => x.domain === comp.domain && j < i).length;
    const angle = (di / domainsInOrder.length) * Math.PI * 2 - Math.PI / 2 + sameDomain * 0.22;
    const v = prizeValue(comp.prize);
    const ring = v ? 150 - Math.log10(v) * 16 : 146; // bigger prize → closer to the core
    return {
      x: c + Math.cos(angle) * ring,
      y: c + Math.sin(angle) * ring,
      r: v ? 1.6 + Math.log10(v) * 0.62 : 3,
      result: Boolean(comp.result),
    };
  });

  return (
    <section id="arena" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">03 / Research</span>
          <h2 className="section__title">
            Off the clock, <em>in the arena.</em>
          </h2>
          <p className="section__lede">
            {kaggle.count} Kaggle competitions across {kaggle.domains} domains ({kaggle.prizePool} in combined prize pools), plus the eval
            harnesses and agents I built to go with them.
          </p>
        </header>

        <div className="arena reveal">
          <div className="orbit">
            <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Kaggle competitions plotted by domain; larger prize pools sit closer to the center.">
              <g className="orbit__spin">
              {[60, 95, 130, 150].map((r) => (
                <circle key={r} cx={c} cy={c} r={r} className="orbit__ring" />
              ))}
              {domainsInOrder.map((d, i) => {
                const a = (i / domainsInOrder.length) * Math.PI * 2 - Math.PI / 2;
                return <line key={d} x1={c} y1={c} x2={c + Math.cos(a) * 168} y2={c + Math.sin(a) * 168} className="orbit__spoke" />;
              })}
              <circle cx={c} cy={c} r={26} className="orbit__core" />
              <text x={c} y={c + 4} textAnchor="middle" className="orbit__core-label">
                {kaggle.count}
              </text>
              {points.map((p, i) => (
                <g key={i} className={`orbit__pt${hot === i ? ' is-hot' : ''}${p.result ? ' has-result' : ''}`} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
                  <circle cx={p.x} cy={p.y} r={p.r * 2.4} className="orbit__halo" />
                  <circle cx={p.x} cy={p.y} r={p.r} />
                </g>
              ))}
              </g>
            </svg>
          </div>

          <ul className="comp-list">
            {kaggle.competitions.map((comp, i) => (
              <li key={comp.name} className={hot === i ? 'is-hot' : ''} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
                <span className="comp-list__name">{comp.name}</span>
                <span className="comp-list__domain mono">{comp.domain}</span>
                <span className="comp-list__prize mono">{comp.prize}</span>
                {comp.result && <span className="comp-list__result">{comp.result}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="labs">
          {labs.map((lab) => (
            <article key={lab.name} className="lab reveal">
              <h3>
                {lab.url ? (
                  <a href={lab.url} target="_blank" rel="noopener noreferrer">
                    {lab.name} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  lab.name
                )}
              </h3>
              <p>{lab.line}</p>
              <dl>
                {lab.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.value}</dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
              <ul className="tags">
                {lab.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
