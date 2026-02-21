export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">
          © {year} Cameron Warren
        </p>
        <nav className="footer__nav" aria-label="Footer">
          <a href="https://cwarre33.github.io/" target="_blank" rel="noopener noreferrer">
            Contributions
          </a>
          <a href="https://www.linkedin.com/in/cameron-warren-73a0192b2/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/cwarre33" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
      <style>{`
        .footer {
          padding: 1.5rem 0;
          border-top: 1px solid var(--border);
          background: var(--bg);
        }
        .footer__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.75rem;
        }
        @media (min-width: 480px) {
          .footer__inner {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer__copy {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .footer__nav {
          display: flex;
          gap: 1.25rem;
        }
        .footer__nav a {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .footer__nav a:hover {
          color: var(--accent);
        }
      `}</style>
    </footer>
  );
}
