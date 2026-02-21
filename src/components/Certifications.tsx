import { certifications, education } from '../data/certifications';

export function Certifications() {
  return (
    <section id="certifications" className="section certifications">
      <div className="container">
        <h2 className="section-title">
          Education <span>& certifications</span>
        </h2>
        <p className="certifications__education">{education}</p>
        <div className="certifications__grid">
          {certifications.map((cert) => (
            <div key={cert.name} className="cert-card">
              <span className="cert-card__name">{cert.name}</span>
              {cert.issuer && (
                <span className="cert-card__issuer">{cert.issuer}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .certifications__education {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 1.5rem;
        }
        .certifications__grid {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.875rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .cert-card__name {
          font-size: 0.9375rem;
          color: var(--text);
          font-weight: 500;
        }
        .cert-card__issuer {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
