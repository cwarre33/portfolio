export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">
          © {year} Cameron Warren
        </p>
        <nav className="footer__nav" aria-label="Footer">
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
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
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
