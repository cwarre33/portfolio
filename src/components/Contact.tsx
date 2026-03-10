const EMAIL = 'cwarre33@uncc.edu';
const LINKEDIN = 'https://www.linkedin.com/in/cameron-warren-73a0192b2/';
const GITHUB = 'https://github.com/cwarre33';

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <h2 className="section-title">
          Get in <span>touch</span>
        </h2>
        <p className="contact__text">
          Open to collaboration, speaking, and new opportunities. Reach out via email or LinkedIn.
        </p>
        <div className="contact__links">
          <a href={`mailto:${EMAIL}`} className="contact__btn">
            {EMAIL}
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="contact__btn">
            LinkedIn
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="contact__btn">
            GitHub
          </a>
        </div>
        <p className="contact__note">
          Resume available on request or via LinkedIn.
        </p>
      </div>
      <style>{`
        .contact {
          background: var(--bg-elevated);
        }
        .contact__inner {
          text-align: center;
        }
        .contact__text {
          color: var(--text-muted);
          max-width: 42ch;
          margin: 0 auto 1.5rem;
        }
        .contact__links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .contact__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.625rem 1rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: var(--text);
          font-weight: 500;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 4px 12px rgba(0, 0, 0, 0.15);
          transition: border-color 0.2s, color 0.2s, box-shadow 0.3s, transform 0.3s;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .contact__btn:hover {
          border-color: var(--glass-border-hover);
          color: var(--accent);
          box-shadow: 0 8px 24px rgba(88, 166, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          text-decoration: none;
        }
        .contact__note {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
