import { Typewriter } from './Typewriter';

const LINKEDIN = 'https://www.linkedin.com/in/cameron-warren-73a0192b2/';
const GITHUB = 'https://github.com/cwarre33';

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__bg" aria-hidden />
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">AI Research Analyst & Software Engineer</p>
          <h1 className="hero__title">
            Building at the intersection of{' '}
            <Typewriter />
          </h1>
          <p className="hero__subtitle">
            B.S. Computer Science @ UNC Charlotte · Furnitureland South · SofaScope, SellSmart & enterprise AI
          </p>
          <div className="hero__actions">
            <a href="#contact" className="hero__btn hero__btn--primary">
              Get in touch
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--secondary"
            >
              LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--secondary"
            >
              GitHub
            </a>
          </div>
          <div className="hero__social" aria-label="Social links">
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 6rem 0 4rem;
          overflow: hidden;
        }
        .hero__bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% -20%, var(--accent-soft), transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(88, 166, 255, 0.06), transparent),
            radial-gradient(ellipse 60% 40% at 0% 50%, rgba(88, 166, 255, 0.06), transparent);
          pointer-events: none;
        }
        .hero__inner {
          position: relative;
          z-index: 1;
        }
        .hero__content {
          max-width: 640px;
        }
        .hero__eyebrow {
          font-size: 0.875rem;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hero__title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 1rem;
        }
        .hero__subtitle {
          color: var(--text-muted);
          font-size: 1.0625rem;
          margin-bottom: 2rem;
        }
        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .hero__btn {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .hero__btn:hover { text-decoration: none; }
        .hero__btn--primary {
          background: var(--accent);
          color: #fff;
        }
        .hero__btn--primary:hover {
          background: #79b8ff;
        }
        .hero__btn--secondary {
          background: var(--bg-card);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .hero__btn--secondary:hover {
          border-color: var(--text-muted);
          background: var(--bg-elevated);
        }
        .hero__social {
          display: flex;
          gap: 1rem;
        }
        .hero__social a {
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .hero__social a:hover {
          color: var(--accent);
          text-decoration: none;
        }
      `}</style>
    </section>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
