import { experience } from '../data/experience';
import { certifications, education } from '../data/certifications';
import { projects } from '../data/projects';

const featuredElsewhere = new Set(['SofaScope', 'AutoTrader']);

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">05 / Experience</span>
          <h2 className="section__title">
            Intern to system owner <em>in eight months.</em>
          </h2>
        </header>

        <ol className="timeline">
          {experience.map((job) => (
            <li key={job.role} className="timeline__item reveal">
              <div className="timeline__when mono">{job.period}</div>
              <div className="timeline__what">
                <h3>{job.role}</h3>
                <p className="timeline__org">
                  {job.company} · {job.location}
                </p>
                <ul>
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="creds reveal">
          <div>
            <span className="mono">education</span>
            <p>{education}</p>
          </div>
          <div>
            <span className="mono">certifications</span>
            <ul>
              {certifications.map((c) => (
                <li key={c.name}>
                  {c.name}
                  {c.issuer && <span> · {c.issuer}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="subhead reveal mono" id="projects">
          more on github
        </h3>
        <ul className="repo-grid">
          {projects
            .filter((p) => !featuredElsewhere.has(p.title))
            .map((p) => (
              <li key={p.title} className="repo reveal">
                <a href={p.liveUrl ?? p.url} target="_blank" rel="noopener noreferrer">
                  <strong>
                    {p.title} <span aria-hidden="true">↗</span>
                  </strong>
                  <p>{p.description}</p>
                  <span className="mono">{p.tags.join(' · ')}</span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
