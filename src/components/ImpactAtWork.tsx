import { impactAtWork } from '../data/impactAtWork';

export function ImpactAtWork() {
  return (
    <section id="impact" className="section impact-at-work">
      <div className="container">
        <h2 className="section-title">
          Impact <span>at work</span>
        </h2>
        <p className="impact-at-work__intro">
          Selected outcomes from enterprise AI, cloud, and customer-operations work—summarized for a public audience
          (details are curated; raw delivery tracking stays offline).
        </p>
        <div className="impact-at-work__grid">
          {impactAtWork.map((item) => (
            <article key={item.title} className="impact-card">
              <div className="impact-card__header">
                <span className="impact-card__emoji" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="impact-card__title">{item.title}</h3>
              </div>
              <p className="impact-card__impact">{item.impact}</p>
              <div className="impact-card__section">
                <h4 className="impact-card__label">Outcomes</h4>
                <ul className="impact-card__list">
                  {item.outcomes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="impact-card__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="impact-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .impact-at-work__intro {
          color: var(--text-muted);
          margin-bottom: 2rem;
          max-width: 62ch;
        }
        .impact-at-work__grid {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .impact-at-work__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .impact-at-work__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .impact-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .impact-card { padding: 1.5rem; }
        }
        .impact-card__header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .impact-card__emoji {
          font-size: 1.5rem;
        }
        .impact-card__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        .impact-card__impact {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }
        .impact-card__section {
          margin: 0;
        }
        .impact-card__label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }
        .impact-card__list {
          margin: 0;
          padding-left: 1.15rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .impact-card__list li {
          margin-bottom: 0.35rem;
        }
        .impact-card__list li:last-child {
          margin-bottom: 0;
        }
        .impact-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: auto;
        }
        .impact-card__tag {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.2rem 0.55rem;
        }
        @media (max-width: 767px) {
          .impact-at-work__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
