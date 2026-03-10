import { useRef } from 'react';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `
      perspective(800px)
      rotateY(${x * 5}deg)
      rotateX(${-y * 5}deg)
      translateY(-4px)
    `;
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  }

  return (
    <article
      ref={cardRef}
      className={`project-card ${project.highlight ? 'project-card--highlight' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glass reflection overlay */}
      <div className="project-card__glare" aria-hidden />
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
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.25rem;
          overflow: hidden;
          box-shadow: var(--glass-shadow);
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
          transform-style: preserve-3d;
        }
        @media (min-width: 640px) {
          .project-card { padding: 1.5rem; }
        }

        /* Top edge highlight — light catching on glass */
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.2) 70%,
            transparent 100%
          );
          z-index: 3;
          pointer-events: none;
        }

        /* Accent indicator bar on hover */
        .project-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), rgba(88, 166, 255, 0.4));
          border-radius: 16px 16px 0 0;
          opacity: 0;
          transition: opacity 0.25s;
          z-index: 3;
        }

        /* Glass reflection/glare overlay */
        .project-card__glare {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.03) 30%,
            rgba(255, 255, 255, 0.08) 45%,
            rgba(255, 255, 255, 0.03) 55%,
            rgba(255, 255, 255, 0) 80%
          );
          z-index: 1;
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .project-card--highlight {
          border-color: rgba(88, 166, 255, 0.2);
        }

        .project-card--highlight::after {
          background: linear-gradient(90deg, var(--accent), rgba(88, 166, 255, 0.5), var(--accent));
          background-size: 200% 100%;
          opacity: 0.6;
        }

        @media (prefers-reduced-motion: no-preference) {
          .project-card--highlight::after {
            animation: shimmer 3s linear infinite;
          }
        }

        .project-card:hover {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
        }
        .project-card:hover::after {
          opacity: 1;
        }
        .project-card:hover .project-card__glare {
          opacity: 1;
        }

        .project-card__link {
          display: block;
          color: inherit;
          height: 100%;
          position: relative;
          z-index: 2;
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
          transition: transform 0.2s, color 0.2s;
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
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
        }
      `}</style>
    </article>
  );
}
