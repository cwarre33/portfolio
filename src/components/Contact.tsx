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
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .contact__btn {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-weight: 500;
          transition: border-color 0.2s, color 0.2s;
        }
        .contact__btn:hover {
          border-color: var(--accent);
          color: var(--accent);
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
