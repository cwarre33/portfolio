import { systems, type System } from '../data/story';

function Pipeline({ stages }: { stages: System['pipeline'] }) {
  return (
    <div className="pipe" aria-label="Architecture flow">
      <div className="pipe__track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="pipe__packet" style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
      </div>
      <ol className="pipe__stages">
        {stages.map((s) => (
          <li key={s.label}>
            <span className="pipe__node" aria-hidden="true" />
            <strong>{s.label}</strong>
            {s.sub && <span className="mono">{s.sub}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Systems() {
  return (
    <section id="systems" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">01 / Systems</span>
          <h2 className="section__title">
            Four systems in production, <em>traced end to end.</em>
          </h2>
          <p className="section__lede">
            Each one is written up in my wiki as architecture notes, ADRs, and a system-design interview page. Here's the short version.
          </p>
        </header>

        <div className="systems">
          {systems.map((s) => (
            <article key={s.id} className="system reveal" id={`sys-${s.id}`}>
              <div className="system__meta">
                <span className="system__index mono">{s.index}</span>
                <h3 className="system__name">{s.name}</h3>
                <p className="system__kicker mono">{s.kicker}</p>
                <p className="system__summary">{s.summary}</p>
                {s.decision && (
                  <p className="system__decision">
                    <span className="mono">decision</span>
                    {s.decision}
                  </p>
                )}
                <ul className="tags">
                  {s.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="system__viz">
                <Pipeline stages={s.pipeline} />
                <dl className="system__metrics">
                  {s.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.value}</dt>
                      <dd>{m.label}</dd>
                    </div>
                  ))}
                </dl>
                <p className="system__source mono">source: {s.source}.md</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
