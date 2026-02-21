import { awsWork } from '../data/awsWork';

export function AwsWork() {
  return (
    <section id="aws" className="section aws-work">
      <div className="container">
        <h2 className="section-title">
          AWS &amp; infrastructure <span>work</span>
        </h2>
        <p className="aws-work__intro">
          Serverless and event-driven systems on AWS—focused on cost efficiency and clear business impact.
        </p>
        <div className="aws-work__grid">
          {awsWork.map((item) => (
            <article key={item.title} className="aws-card">
              <div className="aws-card__header">
                <span className="aws-card__emoji" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="aws-card__title">{item.title}</h3>
              </div>
              <div className="aws-card__section">
                <h4 className="aws-card__label">Architecture</h4>
                <p className="aws-card__architecture">{item.architecture[0]}</p>
              </div>
              <div className="aws-card__section">
                <h4 className="aws-card__label">Business outcome</h4>
                <p className="aws-card__text">{item.businessOutcome}</p>
              </div>
              <div className="aws-card__section">
                <h4 className="aws-card__label">Cost</h4>
                <p className="aws-card__cost">{item.cost}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .aws-work__intro {
          color: var(--text-muted);
          margin-bottom: 2rem;
          max-width: 56ch;
        }
        .aws-work__grid {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .aws-work__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .aws-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .aws-card { padding: 1.5rem; }
        }
        .aws-card__header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .aws-card__emoji {
          font-size: 1.5rem;
        }
        .aws-card__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }
        .aws-card__section {
          margin: 0;
        }
        .aws-card__label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .aws-card__architecture,
        .aws-card__text,
        .aws-card__cost {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .aws-card__cost {
          color: var(--success);
        }
        @media (max-width: 768px) {
          .aws-work__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
