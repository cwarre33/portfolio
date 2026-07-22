import { useEffect, useRef, useState } from 'react';
import { impactStats, type ImpactStat } from '../data/impactStats';

function useCountUp(target: number, start: boolean, durationMs = 1600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);

  return value;
}

function StatCard({ stat, start, index }: { stat: ImpactStat; start: boolean; index: number }) {
  const value = useCountUp(stat.target, start);
  return (
    <div
      className={`impact-stats__card${start ? ' impact-stats__card--in' : ''}`}
      style={{ '--stat-delay': `${index * 0.1}s` } as React.CSSProperties}
    >
      <span className="impact-stats__value">
        {stat.prefix}
        {value.toLocaleString('en-US')}
        {stat.suffix}
      </span>
      <span className="impact-stats__label">{stat.label}</span>
      <span className="impact-stats__detail">{stat.detail}</span>
    </div>
  );
}

export function ImpactStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="impact-stats" ref={ref} aria-label="Headline metrics">
      {impactStats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} start={visible} index={i} />
      ))}
      <style>{`
        .impact-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 900px) {
          .impact-stats {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }
        .impact-stats__card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 1.25rem 1rem;
          box-shadow: var(--glass-shadow);
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .impact-stats__card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent, rgba(255,255,255,0.2) 30%,
            rgba(255,255,255,0.35) 50%,
            rgba(255,255,255,0.2) 70%, transparent);
          pointer-events: none;
        }
        .impact-stats__card:hover {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
        }
        .impact-stats__card--in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: no-preference) {
          .impact-stats__card--in {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--stat-delay, 0s) both;
          }
        }
        .impact-stats__value {
          font-family: var(--font-mono);
          font-size: clamp(1.75rem, 4vw, 2.375rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--accent);
          text-shadow: 0 0 24px rgba(88, 166, 255, 0.35);
          font-variant-numeric: tabular-nums;
        }
        .impact-stats__label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }
        .impact-stats__detail {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
