import { skillGroups } from '../data/skills';
import { GlassCard } from './GlassCard';

export function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">
          About <span>me</span>
        </h2>
        <div className="about__bento">
          <GlassCard className="about__bio-card" tilt={false}>
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
              CI dashboards, vendor data pipelines, and trust/transparency in LLM outputs. I'm grateful for
              the growth, the team at FLS, and the momentum at the intersection of Computer Vision and
              Full-Stack Development.
            </p>
          </GlassCard>
          <div className="about__skills-grid">
            {skillGroups.map((group) => (
              <GlassCard key={group.label} className="about__skill-cell">
                <h3 className="about__skill-label">{group.label}</h3>
                <ul className="about__skill-tags">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="about__tag">{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        /* ── Bento grid layout ── */
        .about__bento {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .about__bento {
            grid-template-columns: 1fr 280px;
            align-items: start;
          }
        }

        /* ── Bio card with glass styling + glowing left border ── */
        .about__bio-card {
          border-left: 3px solid var(--accent);
          padding: 1.5rem 1.5rem 1.5rem 1.25rem;
        }
        .about__bio-card p {
          margin-bottom: 1rem;
          color: var(--text-muted);
          max-width: 56ch;
          overflow-wrap: break-word;
        }
        .about__bio-card p:last-child {
          margin-bottom: 0;
        }
        .about__bio-card strong {
          color: var(--text);
        }

        /* ── Skill bento cells ── */
        .about__skills-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .about__skill-cell {
          padding: 1rem 1.25rem;
        }
        .about__skill-cell:hover {
          border-color: var(--glass-border-hover);
        }

        /* ── Skill label with shimmer effect ── */
        .about__skill-label {
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
          .about__skill-label {
            color: var(--text-muted);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .about__skill-cell:hover .about__skill-label {
            animation: shimmer 1.8s linear infinite;
          }
        }

        /* ── Skill tags ── */
        .about__skill-tags {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .about__tag {
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
        .about__tag:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
      `}</style>
    </section>
  );
}
