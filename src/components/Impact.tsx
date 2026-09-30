import { useEffect, useState } from 'react';
import { prefersReducedMotion, useCountUp, useInView } from '../hooks/motion';

/** Real-time race: 16.8s cold model load vs <500ms persistent CLIP (time compressed 4×). */
function LatencyRace() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [run, setRun] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const SPEED = 4;
  const BEFORE = 16.8, AFTER = 0.48;

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setElapsed(BEFORE);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = ((now - t0) / 1000) * SPEED;
      setElapsed(Math.min(BEFORE, s));
      if (s < BEFORE) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, run]);

  const lane = (label: string, total: number, tone: string) => {
    const t = Math.min(elapsed, total);
    const done = elapsed >= total;
    return (
      <div className={`race__lane${done ? ' is-done' : ''}`}>
        <div className="race__label">
          <span>{label}</span>
          <span className="mono">{done ? (total < 1 ? `${Math.round(total * 1000)}ms` : `${total.toFixed(1)}s`) : `${t.toFixed(2)}s`}</span>
        </div>
        <div className="race__track">
          <div className="race__bar" style={{ width: `${(t / BEFORE) * 100}%`, background: tone }} />
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className="race">
      {lane('Before: model reloaded per request', BEFORE, 'var(--ember)')}
      {lane('After: CLIP resident in memory', AFTER, 'var(--signal)')}
      <button
        type="button"
        className="race__replay mono"
        onClick={() => {
          setElapsed(0);
          setRun((r) => r + 1);
        }}
      >
        ↻ replay · 4× speed
      </button>
    </div>
  );
}

/** Round-robin dealing into agent lanes; one lane reserved for dedicated-agent matches. */
function RoundRobin() {
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  const LANES = 6;
  const [dealt, setDealt] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDealt(LANES * 12);
      return;
    }
    const id = setInterval(() => setDealt((d) => (d >= LANES * 18 ? 0 : d + 1)), 110);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="rr" aria-hidden="true">
      {Array.from({ length: LANES }, (_, lane) => {
        const count = Math.floor(dealt / LANES) + (dealt % LANES > lane ? 1 : 0);
        const next = dealt % LANES === lane;
        return (
          <div key={lane} className={`rr__lane${next ? ' is-next' : ''}${lane === 0 ? ' is-dedicated' : ''}`}>
            {Array.from({ length: count }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Each dot ≈ 1,000 serials. */
function SerialField() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`field${inView ? ' is-on' : ''}`} aria-hidden="true">
      {Array.from({ length: 1300 }, (_, i) => (
        <i key={i} style={{ animationDelay: `${((i * 37) % 1300) * 0.9}ms` }} />
      ))}
    </div>
  );
}

function Stat({ to, decimals = 0, prefix = '', suffix = '', start }: { to: number; decimals?: number; prefix?: string; suffix?: string; start: boolean }) {
  const v = useCountUp(to, start);
  return (
    <span className="tile__num">
      {prefix}
      {v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Impact() {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  return (
    <section id="impact" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">00 / Impact</span>
          <h2 className="section__title">
            Numbers from production, <em>not from a slide.</em>
          </h2>
        </header>

        <div
          ref={ref}
          className="bento"
          onPointerMove={(e) => {
            const tile = (e.target as HTMLElement).closest<HTMLElement>('.tile');
            if (!tile) return;
            const r = tile.getBoundingClientRect();
            tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
            tile.style.setProperty('--my', `${e.clientY - r.top}px`);
          }}
        >
          <article className="tile tile--race reveal">
            <span className="tile__kicker mono">SofaScope · image search latency</span>
            <Stat to={33} suffix="×" start={inView} />
            <p className="tile__label">faster after profiling found the model reloading on every request.</p>
            <LatencyRace />
          </article>

          <article className="tile tile--rr reveal">
            <span className="tile__kicker mono">Zendesk · custom round robin</span>
            <Stat to={4000} suffix="+" start={inView} />
            <p className="tile__label">tickets auto-assigned with dedicated-agent preference and daily caps.</p>
            <RoundRobin />
          </article>

          <article className="tile tile--field reveal">
            <span className="tile__kicker mono">ClearView · inventory</span>
            <Stat to={1.3} decimals={1} suffix="M+" start={inView} />
            <p className="tile__label">serials, ~23 years of history. Each dot is ~1,000 of them.</p>
            <SerialField />
          </article>

          <article className="tile reveal">
            <span className="tile__kicker mono">ClearView · default browse</span>
            <Stat to={22} suffix="×" start={inView} />
            <p className="tile__label">faster: ~11s → ~500ms with matviews, query redesign, and statement timeouts.</p>
            <div className="steps" aria-hidden="true">
              <span style={{ height: '100%' }} />
              <span style={{ height: '4.5%' }} />
            </div>
          </article>

          <article className="tile reveal">
            <span className="tile__kicker mono">ClearView · AWS steady state</span>
            <Stat to={159} prefix="$" suffix="/mo" start={inView} />
            <p className="tile__label">including public ALB + WAF, under the ~$201–216 estimate.</p>
            <div className="budget" aria-hidden="true">
              <span className="budget__est" />
              <span className="budget__act" />
            </div>
          </article>

          <article className="tile reveal">
            <span className="tile__kicker mono">Kaggle · AI Mathematical Olympiad 3</span>
            <Stat to={8.7} decimals={1} prefix="top " suffix="%" start={inView} />
            <p className="tile__label">358th of 4,138 teams, inside the bronze-medal line.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
