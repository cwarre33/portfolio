import { useState } from 'react';
import { kaggle, labs, topPercent } from '../data/story';

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (v: number) => (v < 10 ? v.toFixed(1) : Math.round(v).toString());

export function Arena() {
  const [hot, setHot] = useState<number | null>(null);
  const finals = kaggle.ranked.filter((c) => c.status === 'final');
  const best = [...finals].sort((a, b) => topPercent(a) - topPercent(b))[0];
  const median = [...finals.map(topPercent)].sort((a, b) => a - b)[Math.floor(finals.length / 2)];

  const stats = [
    { value: String(kaggle.competitionMedals), label: 'competition medal', sub: `bronze · ${best.name}` },
    { value: `top ${pct(topPercent(best))}%`, label: 'best final finish', sub: `${fmt(best.rank!)} of ${fmt(best.teams)} teams` },
    { value: String(kaggle.codeMedals), label: 'code medals', sub: 'notebooks voted up by the community' },
    { value: String(kaggle.badges), label: 'badges earned', sub: `${kaggle.entered} competitions entered` },
  ];

  return (
    <section id="arena" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">03 / Research</span>
          <h2 className="section__title">
            Off the clock, <em>in the arena.</em>
          </h2>
          <p className="section__lede">
            {kaggle.entered} Kaggle competitions across math reasoning, bioinformatics, NLP, vision, simulation and tabular ML. No prize
            wins yet. Here's exactly where I finished, plus the eval harnesses and agents I built along the way.
          </p>
        </header>

        <dl className="kstats reveal">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>
                {s.label}
                <span>{s.sub}</span>
              </dd>
            </div>
          ))}
        </dl>

        <figure className="finish reveal">
          <figcaption className="finish__head">
            <span>Finish position, as % of the field</span>
            <span className="mono">
              lower is better · median final finish top {pct(median)}%
            </span>
          </figcaption>

          <div className="finish__axis mono" aria-hidden="true">
            <span />
            <div className="finish__scale">
              <span style={{ left: '0%' }}>0%</span>
              <span className="finish__tick-10" style={{ left: '10%' }}>10%</span>
              <span style={{ left: '25%' }}>25%</span>
              <span style={{ left: '50%' }}>50%</span>
              <span style={{ left: '75%' }}>75%</span>
              <span style={{ left: '100%' }}>100%</span>
            </div>
          </div>

          <ol className="finish__rows">
            {kaggle.ranked.map((c, i) => {
              const p = topPercent(c);
              const tip = `${c.name}: ${fmt(c.rank!)} of ${fmt(c.teams)} (top ${pct(p)}%)${c.status === 'live' ? ', live leaderboard' : ''}${c.medal ? ', bronze medal' : ''}`;
              return (
                <li
                  key={c.name}
                  className={`finish__row${hot === i ? ' is-hot' : ''}${c.medal ? ' is-medal' : ''}${c.status === 'live' ? ' is-live' : ''}`}
                  onPointerEnter={() => setHot(i)}
                  onPointerLeave={() => setHot(null)}
                >
                  <a className="finish__name" href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.name}
                    <span className="mono">
                      {c.domain} · {c.kind}
                    </span>
                  </a>
                  <div className="finish__track" role="img" aria-label={tip}>
                    {(c.kind === 'Featured' || c.kind === 'Research') && <span className="finish__zone" aria-hidden="true" />}
                    <span className="finish__bar" style={{ width: `${p}%` }} aria-hidden="true" />
                    <span className="finish__dot" style={{ left: `${p}%` }} aria-hidden="true" />
                    {hot === i && (
                      <span className="finish__tip mono" style={{ left: `${p}%` }} aria-hidden="true">
                        {fmt(c.rank!)} / {fmt(c.teams)} · beat {fmt(c.teams - c.rank!)} teams
                      </span>
                    )}
                  </div>
                  <span className="finish__rank mono">
                    {fmt(c.rank!)}/{fmt(c.teams)}
                    {c.medal && <b className="finish__tag finish__tag--medal">bronze</b>}
                    {c.status === 'live' && <b className="finish__tag">live</b>}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="finish__note">
            <span className="finish__key finish__key--zone" aria-hidden="true" /> top 10%: the bronze line, shaded only where a medal was possible
            (featured and research competitions with 1,000+ teams). Playground and community competitions don't award medals.{' '}
            <span className="finish__key finish__key--live" aria-hidden="true" /> live: provisional leaderboard as of {kaggle.snapshot}.
          </p>
          <p className="finish__note">
            <span className="mono">also entered, unranked:</span> {kaggle.unranked.join(' · ')}.{' '}
            <a href={kaggle.profile} target="_blank" rel="noopener noreferrer">
              Full profile ↗
            </a>
          </p>
        </figure>

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
