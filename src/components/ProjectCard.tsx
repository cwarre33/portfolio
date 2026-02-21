import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={`project-card ${project.highlight ? 'project-card--highlight' : ''}`}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project-card__link"
      >
        <div className="project-card__header">
          <h3 className="project-card__title">{project.title}</h3>
          <span className="project-card__arrow" aria-hidden>→</span>
        </div>
        <p className="project-card__description">{project.description}</p>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__live"
            onClick={(e) => e.stopPropagation()}
          >
            Live demo
          </a>
        )}
        <ul className="project-card__tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </a>
      <style>{`
        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        @media (min-width: 640px) {
          .project-card { padding: 1.5rem; }
        }
        .project-card--highlight {
          border-color: rgba(88, 166, 255, 0.3);
        }
        .project-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }
        .project-card__link {
          display: block;
          color: inherit;
          height: 100%;
        }
        .project-card__link:hover {
          text-decoration: none;
        }
        .project-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .project-card__title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text);
        }
        .project-card__arrow {
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .project-card:hover .project-card__arrow {
          transform: translate(2px, -2px);
          color: var(--accent);
        }
        .project-card__description {
          font-size: 0.9375rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 0.75rem;
          overflow-wrap: break-word;
        }
        .project-card__live {
          font-size: 0.8125rem;
          color: var(--accent);
          margin-bottom: 0.75rem;
          display: inline-block;
        }
        .project-card__live:hover {
          text-decoration: underline;
        }
        .project-card__tags {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .project-card__tags li {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
          background: var(--bg-elevated);
          border-radius: 4px;
        }
      `}</style>
    </article>
  );
}
