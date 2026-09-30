import { useEffect, useMemo, useRef, useState } from 'react';
import { EMAIL, GITHUB, LINKEDIN, RESUME_HREF, sections } from './links';
import { trackEvent } from '../analytics/track';
import { copyText, shortcutLabel } from '../hooks/platform';

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...sections.map((s) => ({ label: `Go to ${s.label}`, hint: `#${s.id}`, run: () => go(s.id) })),
      { label: 'Open GitHub', hint: 'github.com/cwarre33', run: () => window.open(GITHUB, '_blank', 'noopener') },
      { label: 'Open LinkedIn', hint: 'linkedin', run: () => window.open(LINKEDIN, '_blank', 'noopener') },
      {
        label: 'Copy email',
        hint: EMAIL,
        run: () => {
          void copyText(EMAIL).then((ok) => {
            if (ok) trackEvent('contact_email_copy');
            else window.location.href = `mailto:${EMAIL}`;
          });
        },
      },
      {
        label: 'Download résumé',
        hint: 'PDF',
        run: () => {
          trackEvent('resume_download');
          const a = document.createElement('a');
          a.href = RESUME_HREF;
          a.download = '';
          a.click();
        },
      },
    ],
    []
  );

  const results = commands.filter((c) => (c.label + c.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const run = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    c.run();
  };

  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={onClose}>
      <div className="cmdk__panel" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk__input"
          placeholder="Jump to a section, open a link…"
          enterKeyHint="go"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSel((s) => Math.min(results.length - 1, s + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            } else if (e.key === 'Enter') {
              run(results[sel]);
            } else if (e.key === 'Escape') {
              onClose();
            }
          }}
          aria-activedescendant={results[sel] ? `cmd-${sel}` : undefined}
          aria-controls="cmdk-list"
        />
        <ul className="cmdk__list" id="cmdk-list" role="listbox">
          {results.map((c, i) => (
            <li
              key={c.label}
              id={`cmd-${i}`}
              role="option"
              aria-selected={i === sel}
              className={i === sel ? 'is-sel' : ''}
              onPointerMove={() => setSel(i)}
              onClick={() => run(c)}
            >
              <span>{c.label}</span>
              <span className="mono">{c.hint}</span>
            </li>
          ))}
          {results.length === 0 && <li className="cmdk__empty">No matches</li>}
        </ul>
        <div className="cmdk__foot mono">↑↓ navigate · ↵ select · esc close</div>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        trackEvent('command_palette');
      }
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#top" className="nav__brand" aria-label="Back to top">
          <span className="nav__mark" aria-hidden="true">CW</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''}>
              {s.label}
            </a>
          ))}
        </nav>
        <button type="button" className="nav__cmd" onClick={() => setOpen(true)} aria-label="Open command palette">
          <span className="mono">{shortcutLabel}</span>
        </button>
      </header>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
