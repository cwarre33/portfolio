import { Typewriter } from './Typewriter';

const LINKEDIN = 'https://www.linkedin.com/in/cameron-warren-73a0192b2/';
const GITHUB = 'https://github.com/cwarre33';

const STATS = [
  { value: '95%', label: 'faster search' },
  { value: '< 500ms', label: 'latency' },
  { value: '2', label: 'AI products shipped' },
];

const SPLINE_SCENE_URL = 'https://prod.spline.design/xkOKuZbsmNGFlpat/scene.splinecode?v=2';

function HeroBackground() {
  return (
    <div className="hero__spline-fallback" aria-hidden="true">
      <div className="hero__fallback-orb hero__fallback-orb--1" />
      <div className="hero__fallback-orb hero__fallback-orb--2" />
      <div className="hero__fallback-orb hero__fallback-orb--3" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      {/* Spline 3D background with gradient fallback */}
      <div className="hero__spline" aria-hidden="true">
        <HeroBackground />
        <spline-viewer
          url={SPLINE_SCENE_URL}
          className="hero__spline-viewer"
        />
      </div>

      {/* Gradient vignette for text readability */}
      <div className="hero__vignette" aria-hidden="true" />

      <div className="container hero__inner">
        {/* Left: text content */}
        <div className="hero__content">
          <p className="hero__eyebrow">AI Research Analyst &amp; Software Engineer</p>
          <h1 className="hero__title">
            Building at the intersection of{' '}
            <Typewriter />
          </h1>
          <p className="hero__subtitle">
            B.S. Computer Science @ UNC Charlotte · Furnitureland South · SofaScope, SellSmart &amp; enterprise AI
          </p>
          <div className="hero__actions">
            <a href="#contact" className="hero__btn hero__btn--primary">
              Get in touch
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--glass"
            >
              LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--glass"
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

        {/* Right: bento stat grid */}
        <div className="hero__bento" aria-label="Key metrics">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="hero__bento-card"
              style={{ '--badge-delay': `${i * 0.12}s` } as React.CSSProperties}
            >
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding: 5rem 0 2.5rem;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .hero {
            padding: 6rem 0 4rem;
          }
        }

        /* ── Spline 3D background ── */
        .hero__spline {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero__spline-viewer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
        }
        .hero__spline-viewer::part(canvas),
        .hero__spline canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        /* Animated gradient fallback (behind viewer until scene loads) */
        .hero__spline-fallback {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }
        .hero__fallback-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .hero__fallback-orb--1 {
          width: 600px; height: 600px;
          top: -120px; left: -100px;
          background: var(--accent-soft);
        }
        .hero__fallback-orb--2 {
          width: 500px; height: 500px;
          top: 10%; right: -80px;
          background: rgba(88, 166, 255, 0.08);
        }
        .hero__fallback-orb--3 {
          width: 400px; height: 400px;
          bottom: -80px; left: 30%;
          background: rgba(88, 166, 255, 0.06);
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero__fallback-orb--1 { animation: float-orb 22s ease-in-out infinite alternate; }
          .hero__fallback-orb--2 { animation: float-orb 18s ease-in-out infinite alternate-reverse; }
          .hero__fallback-orb--3 { animation: float-orb 26s ease-in-out infinite alternate; }
        }

        /* Gradient vignette overlay for text readability */
        .hero__vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg,
              rgba(15, 17, 21, 0.6) 0%,
              rgba(15, 17, 21, 0.3) 40%,
              rgba(15, 17, 21, 0.4) 70%,
              rgba(15, 17, 21, 0.85) 100%
            ),
            linear-gradient(90deg,
              rgba(15, 17, 21, 0.7) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        /* ── Layout ── */
        .hero__inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        @media (min-width: 900px) {
          .hero__inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        /* ── Left: text content ── */
        .hero__content {
          max-width: 600px;
        }

        /* ── Staggered entrance animations ── */
        @media (prefers-reduced-motion: no-preference) {
          .hero__eyebrow {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
          }
          .hero__title {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
          }
          .hero__subtitle {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
          }
          .hero__actions {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
          }
          .hero__social {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
          }
          .hero__bento-card {
            animation: entrance-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--badge-delay, 0s) both;
          }
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
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 1rem;
          word-wrap: break-word;
        }
        .hero__subtitle {
          color: var(--text-muted);
          font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
          margin-bottom: 1.5rem;
        }
        @media (min-width: 640px) {
          .hero__subtitle { margin-bottom: 2rem; }
        }
        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        /* ── CTA button with animated gradient border ── */
        .hero__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .hero__btn:hover { text-decoration: none; }
        .hero__btn--primary {
          position: relative;
          background: var(--accent);
          color: #fff;
          overflow: hidden;
          z-index: 0;
        }
        .hero__btn--primary::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          background: conic-gradient(
            from 0deg,
            var(--accent),
            rgba(88, 166, 255, 0.4),
            var(--accent)
          );
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero__btn--primary::before {
            animation: rotate-gradient 3s linear infinite;
          }
        }
        .hero__btn--primary:hover {
          background: #79b8ff;
          box-shadow: var(--accent-glow);
        }
        .hero__btn--primary:hover::before {
          opacity: 1;
        }

        /* Glass-style button */
        .hero__btn--glass {
          background: var(--glass-bg);
          color: var(--text);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .hero__btn--glass:hover {
          border-color: var(--glass-border-hover);
          background: var(--glass-bg-hover);
          box-shadow: 0 4px 16px rgba(88, 166, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
        .hero__social a {
          padding: 0.5rem;
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Right: bento stat grid ── */
        .hero__bento {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          flex-shrink: 0;
          max-width: 320px;
        }
        .hero__bento-card:last-child {
          grid-column: 1 / -1;
        }
        .hero__bento-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          box-shadow: var(--glass-shadow);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero__bento-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent, rgba(255,255,255,0.2) 30%,
            rgba(255,255,255,0.35) 50%,
            rgba(255,255,255,0.2) 70%, transparent);
          pointer-events: none;
        }
        .hero__bento-card:hover {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
          transform: translateY(-2px);
        }

        .hero__stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent);
          font-family: var(--font-mono);
          line-height: 1.2;
        }
        .hero__stat-label {
          display: block;
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </section>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
