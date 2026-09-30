import { useState } from 'react';
import { trackEvent } from '../analytics/track';
import { EMAIL, GITHUB, LINKEDIN, RESUME_HREF } from './links';
import { copyText } from '../hooks/platform';

export function Contact() {
  const [copied, setCopied] = useState<null | boolean>(null);

  return (
    <section id="contact" className="section contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact__inner">
        <span className="section__index mono reveal">06 / Contact</span>
        <h2 className="contact__title reveal">
          Let's build something <em>that ships.</em>
        </h2>
        <p className="contact__text reveal">
          Open to AI/ML engineering and software roles. LinkedIn is the fastest way to reach me about roles.
        </p>
        <div className="contact__actions reveal">
          <button
            type="button"
            className="btn btn--primary btn--xl"
            aria-live="polite"
            onClick={async () => {
              const ok = await copyText(EMAIL);
              setCopied(ok);
              setTimeout(() => setCopied(null), 1800);
              if (ok) trackEvent('contact_email_copy');
              else window.location.href = `mailto:${EMAIL}`;
            }}
          >
            {copied ? 'Copied ✓' : EMAIL}
          </button>
          <a href={`mailto:${EMAIL}`} className="btn btn--ghost" onClick={() => trackEvent('contact_email')}>
            Email
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" onClick={() => trackEvent('contact_linkedin')}>
            LinkedIn
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" onClick={() => trackEvent('contact_github')}>
            GitHub
          </a>
          <a href={RESUME_HREF} className="btn btn--ghost" download onClick={() => trackEvent('resume_download')}>
            Résumé ↓
          </a>
        </div>
      </div>
    </section>
  );
}
