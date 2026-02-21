import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#aws', label: 'AWS' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
  { href: 'https://cwarre33.github.io/', label: 'Contributions', external: true },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--menu-open' : ''}`}
      role="banner"
    >
      <div className="container header__inner">
        <a href="#" className="header__logo" onClick={closeMenu}>
          Cameron Warren
        </a>
        <button
          type="button"
          className="header__menu-btn"
          aria-expanded={menuOpen}
          aria-controls="header-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="header__menu-icon" aria-hidden />
        </button>
        <nav
          id="header-nav"
          className="header__nav"
          aria-label="Main"
        >
          <ul className="header__list">
            {navLinks.map(({ href, label, external }) => (
              <li key={href}>
                <a
                  href={href}
                  className="header__link"
                  onClick={closeMenu}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
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
          padding: 0.75rem 0;
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
          font-size: 1.0625rem;
          z-index: 101;
        }
        .header__logo:hover {
          text-decoration: none;
          color: var(--accent);
        }
        .header__menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          padding: 0;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--text);
          cursor: pointer;
          z-index: 101;
        }
        .header__menu-btn:hover {
          background: var(--bg-card);
        }
        .header__menu-icon {
          position: relative;
          width: 22px;
          height: 2px;
          background: currentColor;
          box-shadow: 0 -6px 0 currentColor, 0 6px 0 currentColor;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .header__menu-icon::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 22px;
          height: 2px;
          background: currentColor;
          transform: rotate(-90deg);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .header--menu-open .header__menu-icon {
          box-shadow: none;
          transform: rotate(45deg);
        }
        .header--menu-open .header__menu-icon::after {
          opacity: 1;
          transform: rotate(-90deg);
        }
        .header__nav {
          display: none;
        }
        @media (min-width: 768px) {
          .header__menu-btn {
            display: none;
          }
          .header__nav {
            display: block;
          }
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
          display: block;
          padding: 0.5rem 0;
        }
        .header__link:hover {
          color: var(--text);
          text-decoration: none;
        }
        @media (max-width: 767px) {
          .header__nav {
            position: fixed;
            inset: 0;
            top: 0;
            padding: 5rem 1.5rem 2rem;
            background: var(--bg);
            overflow-y: auto;
            display: none;
            align-items: flex-start;
            justify-content: center;
          }
          .header--menu-open .header__nav {
            display: flex;
          }
          .header__list {
            flex-direction: column;
            align-items: center;
            gap: 0;
            width: 100%;
          }
          .header__list li {
            width: 100%;
            border-bottom: 1px solid var(--border);
          }
          .header__link {
            font-size: 1.125rem;
            padding: 1rem 0.5rem;
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}
