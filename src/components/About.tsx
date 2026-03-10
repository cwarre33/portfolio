import { skillGroups } from '../data/skills';
import { GlassCard } from './GlassCard';

const HIGHLIGHTS = [
  { value: '95%', label: 'Search speed improvement', icon: '⚡' },
  { value: '<500ms', label: 'Query latency', icon: '🚀' },
  { value: '2', label: 'AI products shipped', icon: '🤖' },
  { value: '3+', label: 'AWS serverless systems', icon: '☁️' },
];

export function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">
          About <span>me</span>
        </h2>

        {/* ── Bento grid layout ── */}
        <div className="bento">
          {/* Large bio card — spans 2 columns */}
          <GlassCard className="bento__bio" tilt={false}>
            <p>
              I'm Cameron Warren, a Computer Science graduate from UNC Charlotte and a Software Engineer
              focused on high-performance, AI-driven solutions. I'm an <strong>AI Research Analyst at
              Furnitureland South</strong>, where I bridge emerging technology and real-world retail innovation.
            </p>
            <p>
              I architected and built <strong>SofaScope</strong>, an AI-powered visual search platform for the
              world's largest furniture store — using CLIP embeddings and FAISS vector search in a Dockerized
              microservices stack. Search performance improved by 95%, with latency dropping from 15 seconds
              to under 500ms.
            </p>
            <p>
              I also drive <strong>SellSmart</strong> (Conversational AI / Copilot) and internal tooling:
              CI dashboards, vendor data pipelines, and trust/transparency in LLM outputs.
            </p>
          </GlassCard>

          {/* Highlight metric bento cards */}
          {HIGHLIGHTS.map((h) => (
            <GlassCard key={h.label} className="bento__metric">
              <span className="bento__metric-icon" aria-hidden>{h.icon}</span>
              <span className="bento__metric-value">{h.value}</span>
              <span className="bento__metric-label">{h.label}</span>
            </GlassCard>
          ))}

          {/* Skill group cards */}
          {skillGroups.map((group) => (
            <GlassCard key={group.label} className="bento__skill">
              <h3 className="bento__skill-label">{group.label}</h3>
              <ul className="bento__skill-tags">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="bento__tag">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
      <style>{`
        /* ── Bento grid ── */
        .bento {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .bento {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }

        /* Bio spans full width on mobile, 2 cols on desktop */
        .bento__bio {
          grid-column: 1 / -1;
          border-left: 3px solid var(--accent);
          padding: 1.5rem 1.5rem 1.5rem 1.25rem;
        }
        @media (min-width: 640px) {
          .bento__bio {
            grid-column: 1 / 3;
            grid-row: 1 / 3;
          }
        }
        .bento__bio p {
          margin-bottom: 1rem;
          color: var(--text-muted);
          max-width: 56ch;
          overflow-wrap: break-word;
        }
        .bento__bio p:last-child {
          margin-bottom: 0;
        }
        .bento__bio strong {
          color: var(--text);
        }

        /* Metric bento cards */
        .bento__metric {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        .bento__metric-icon {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .bento__metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent);
          font-family: var(--font-mono);
          line-height: 1.2;
        }
        .bento__metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Skill cards span full width on mobile */
        .bento__skill {
          padding: 1rem 1.25rem;
        }
        @media (max-width: 639px) {
          .bento__skill { grid-column: 1 / -1; }
        }
        .bento__skill:hover {
          border-color: var(--glass-border-hover);
        }

        .bento__skill-label {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
          background: linear-gradient(
            90deg,
            var(--text-muted) 0%,
            var(--accent) 40%,
            var(--text-muted) 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @supports not (background-clip: text) {
          .bento__skill-label {
            color: var(--text-muted);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .bento__skill:hover .bento__skill-label {
            animation: shimmer 1.8s linear infinite;
          }
        }

        .bento__skill-tags {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .bento__tag {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          font-size: 0.8125rem;
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          color: var(--text);
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          cursor: default;
        }
        .bento__tag:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
      `}</style>
    </section>
  );
}
