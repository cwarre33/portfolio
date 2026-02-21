import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#aws', label: 'AWS' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      role="banner"
    >
      <div className="container header__inner">
        <a href="#" className="header__logo">
          Cameron Warren
        </a>
        <nav className="header__nav" aria-label="Main">
          <ul className="header__list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="header__link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 0;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .header--scrolled {
          background: rgba(15, 17, 21, 0.85);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--border);
        }
        .header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header__logo {
          font-weight: 600;
          color: var(--text);
          font-size: 1.125rem;
        }
        .header__logo:hover {
          text-decoration: none;
          color: var(--accent);
        }
        .header__list {
          list-style: none;
          display: flex;
          gap: 1.5rem;
        }
        .header__link {
          color: var(--text-muted);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .header__link:hover {
          color: var(--text);
          text-decoration: none;
        }
        @media (max-width: 640px) {
          .header__nav .header__list { gap: 1rem; }
          .header__link { font-size: 0.875rem; }
        }
      `}</style>
    </header>
  );
}
