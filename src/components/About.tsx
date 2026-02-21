import { skillGroups } from '../data/skills';

export function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">
          About <span>me</span>
        </h2>
        <div className="about__grid">
          <div className="about__copy">
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
          </div>
          <div className="about__skills">
            {skillGroups.map((group) => (
              <div key={group.label} className="about__skill-group">
                <h3 className="about__skill-label">{group.label}</h3>
                <ul className="about__skill-tags">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="about__tag">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .about__grid {
          display: grid;
          gap: 2.5rem;
        }
        @media (min-width: 768px) {
          .about__grid {
            grid-template-columns: 1fr 280px;
            align-items: start;
          }
        }
        .about__copy p {
          margin-bottom: 1rem;
          color: var(--text-muted);
          max-width: 56ch;
        }
        .about__copy strong {
          color: var(--text);
        }
        .about__skill-group {
          margin-bottom: 1.5rem;
        }
        .about__skill-group:last-child {
          margin-bottom: 0;
        }
        .about__skill-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
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
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text);
        }
      `}</style>
    </section>
  );
}
