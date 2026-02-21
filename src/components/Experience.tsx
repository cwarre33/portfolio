import { experience } from '../data/experience';

export function Experience() {
  return (
    <section id="experience" className="section experience">
      <div className="container">
        <h2 className="section-title">
          Experience <span>& roles</span>
        </h2>
        <div className="experience__list">
          {experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className="experience__item">
              <div className="experience__timeline" aria-hidden />
              <div className="experience__content">
                <div className="experience__meta">
                  <h3 className="experience__role">{job.role}</h3>
                  <p className="experience__company">{job.company}</p>
                  <p className="experience__location">{job.location}</p>
                  <time className="experience__period" dateTime={job.period}>
                    {job.period}
                  </time>
                </div>
                <ul className="experience__highlights">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .experience__list {
          position: relative;
        }
        .experience__item {
          position: relative;
          padding-left: 1.25rem;
          padding-bottom: 2rem;
        }
        @media (min-width: 640px) {
          .experience__item { padding-left: 1.5rem; }
        }
        .experience__item:last-child {
          padding-bottom: 0;
        }
        .experience__timeline {
          position: absolute;
          left: 0;
          top: 0.5rem;
          bottom: 0;
          width: 2px;
          background: var(--border);
          border-radius: 1px;
        }
        .experience__content {
          position: relative;
        }
        .experience__meta {
          margin-bottom: 0.75rem;
        }
        .experience__role {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.25rem;
        }
        .experience__company {
          font-size: 0.9375rem;
          color: var(--accent);
          margin-bottom: 0.125rem;
        }
        .experience__location,
        .experience__period {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .experience__period {
          display: block;
          margin-top: 0.25rem;
        }
        .experience__highlights {
          list-style: none;
          font-size: 0.9375rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .experience__highlights li {
          position: relative;
          padding-left: 1rem;
          margin-bottom: 0.35rem;
          overflow-wrap: break-word;
        }
        .experience__highlights li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5em;
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
        }
      `}</style>
    </section>
  );
}
