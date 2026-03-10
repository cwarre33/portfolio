import { useState } from 'react';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <h2 className="section-title">
          Projects <span>& open source</span>
        </h2>

        <div className="projects__stack-layout">
          {/* Interactive glass card stack */}
          <div className="projects__stack" aria-label="Project cards">
            {projects.map((project, i) => {
              const offset = i - activeIndex;
              return (
                <StackedProjectCard
                  key={project.title}
                  project={project}
                  offset={offset}
                  total={projects.length}
                  onClick={() => setActiveIndex(i)}
                  isActive={i === activeIndex}
                />
              );
            })}
          </div>

          {/* Navigation dots */}
          <div className="projects__nav" aria-label="Project navigation">
            {projects.map((project, i) => (
              <button
                key={project.title}
                type="button"
                className={`projects__dot ${i === activeIndex ? 'projects__dot--active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`View ${project.title}`}
              />
            ))}
          </div>

          {/* Arrow navigation */}
          <div className="projects__arrows">
            <button
              type="button"
              className="projects__arrow"
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous project"
            >
              ←
            </button>
            <span className="projects__counter">
              {activeIndex + 1} / {projects.length}
            </span>
            <button
              type="button"
              className="projects__arrow"
              onClick={() => setActiveIndex(Math.min(projects.length - 1, activeIndex + 1))}
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .projects__stack-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        /* ── Card stack container ── */
        .projects__stack {
          position: relative;
          width: 100%;
          max-width: 520px;
          height: 340px;
          perspective: 1200px;
        }
        @media (min-width: 640px) {
          .projects__stack { height: 360px; }
        }

        /* ── Navigation dots ── */
        .projects__nav {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .projects__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          padding: 0;
        }
        .projects__dot:hover {
          border-color: var(--accent);
          transform: scale(1.2);
        }
        .projects__dot--active {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* ── Arrow controls ── */
        .projects__arrows {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .projects__arrow {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: var(--text);
          font-size: 1rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .projects__arrow:hover:not(:disabled) {
          border-color: var(--accent);
          background: var(--glass-bg-hover);
        }
        .projects__arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .projects__counter {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          min-width: 4ch;
          text-align: center;
        }
      `}</style>
    </section>
  );
}

/* ── Individual stacked glass project card ── */
interface StackedProjectCardProps {
  project: Project;
  offset: number;
  total: number;
  onClick: () => void;
  isActive: boolean;
}

function StackedProjectCard({ project, offset, onClick, isActive }: StackedProjectCardProps) {
  const absOffset = Math.abs(offset);
  const behind = offset > 0;
  const gone = offset < 0;

  // Cards behind stack upward and scale down; cards that have passed slide left and fade
  const translateY = behind ? -absOffset * 12 : 0;
  const translateX = gone ? -absOffset * 60 : 0;
  const scale = behind ? 1 - absOffset * 0.04 : gone ? 1 - absOffset * 0.06 : 1;
  const rotateY = gone ? absOffset * 4 : 0;
  const opacity = absOffset > 3 ? 0 : gone ? Math.max(0, 1 - absOffset * 0.35) : Math.max(0.4, 1 - absOffset * 0.15);
  const zIndex = 100 - absOffset;

  return (
    <article
      className={`stack-card ${isActive ? 'stack-card--active' : ''}`}
      style={{
        transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex,
        pointerEvents: absOffset > 2 ? 'none' : 'auto',
      }}
      onClick={onClick}
    >
      {/* Glass reflection */}
      <div className="stack-card__reflection" aria-hidden />
      <div className="stack-card__inner">
        <div className="stack-card__header">
          <h3 className="stack-card__title">{project.title}</h3>
          {project.highlight && <span className="stack-card__badge">Featured</span>}
        </div>
        <p className="stack-card__description">{project.description}</p>
        <ul className="stack-card__tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="stack-card__links">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="stack-card__link">
            GitHub →
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="stack-card__link stack-card__link--live">
              Live demo →
            </a>
          )}
        </div>
      </div>

      <style>{`
        .stack-card {
          position: absolute;
          inset: 0;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--glass-shadow);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.4s ease,
            border-color 0.3s,
            box-shadow 0.3s;
          transform-style: preserve-3d;
        }

        /* Top edge highlight */
        .stack-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.15) 20%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0.15) 80%,
            transparent 100%);
          z-index: 3;
          pointer-events: none;
        }

        .stack-card--active {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
        }

        /* Glass reflection */
        .stack-card__reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.03) 25%,
            rgba(255,255,255,0.08) 45%,
            rgba(255,255,255,0.03) 55%,
            rgba(255,255,255,0) 75%
          );
          z-index: 1;
          pointer-events: none;
        }

        .stack-card__inner {
          position: relative;
          z-index: 2;
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 640px) {
          .stack-card__inner { padding: 2rem; }
        }

        .stack-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .stack-card__title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }
        .stack-card__badge {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 6px;
          padding: 0.2rem 0.5rem;
          flex-shrink: 0;
        }

        .stack-card__description {
          font-size: 0.9375rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
          overflow-wrap: break-word;
        }

        .stack-card__tags {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 1rem;
        }
        .stack-card__tags li {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
        }

        .stack-card__links {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }
        .stack-card__link {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--accent);
          transition: color 0.2s;
        }
        .stack-card__link:hover {
          color: #79b8ff;
          text-decoration: none;
        }
        .stack-card__link--live {
          color: var(--success);
        }
        .stack-card__link--live:hover {
          color: #56d364;
        }
      `}</style>
    </article>
  );
}
