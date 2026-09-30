import { useState } from 'react';
import { decisions } from '../data/story';
import { wiki } from '../data/wiki';

const tone: Record<string, string> = {
  production: 'var(--ember)',
  research: 'var(--violet)',
  trading: 'var(--amber)',
  meta: 'var(--blue)',
};

export function Decisions() {
  const [open, setOpen] = useState(0);
  const d = decisions[open];

  return (
    <section id="decisions" className="section">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index mono">02 / Decisions</span>
          <h2 className="section__title">
            Why X over Y. <em>Every call, on the record.</em>
          </h2>
          <p className="section__lede">
            {wiki.totals.decisions} architecture decision records live in the wiki. Most are about internal systems; these{' '}
            {decisions.length} are public. Each one names the alternative and the cost I accepted.
          </p>
        </header>

        <div className="adr reveal">
          <ol className="adr__list" role="tablist" aria-label="Decision records">
            {decisions.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  role="tab"
                  id={`adr-tab-${i}`}
                  aria-selected={i === open}
                  aria-controls="adr-panel"
                  className={i === open ? 'is-open' : ''}
                  style={{ ['--tone' as string]: tone[item.domain] }}
                  onClick={() => {
                    setOpen(i);
                    // Panel stacks above the list on narrow screens; bring it into view.
                    if (window.matchMedia('(max-width: 960px)').matches) {
                      document.getElementById('adr-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
                >
                  <span className="mono">ADR-{String(i + 1).padStart(2, '0')}</span>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>

          <div className="adr__panel" id="adr-panel" role="tabpanel" aria-labelledby={`adr-tab-${open}`} key={open}>
            <div className="adr__term mono" aria-hidden="true">
              <span /> <span /> <span /> decisions/{d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md
            </div>
            <div className="adr__body">
              <div className="adr__versus">
                <div>
                  <span className="mono">chose</span>
                  <strong style={{ color: tone[d.domain] }}>{d.chose}</strong>
                </div>
                <span className="adr__vs mono" aria-hidden="true">vs</span>
                <div>
                  <span className="mono">over</span>
                  <strong className="adr__over">{d.over}</strong>
                </div>
              </div>
              <p className="adr__why">{d.why}</p>
              <p className="adr__cost">
                <span className="mono">tradeoff accepted</span>
                {d.cost}
              </p>
              {d.metric && <p className="adr__metric mono">{d.metric}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
