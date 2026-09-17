import { useEffect, useRef } from 'react';

const LINKEDIN = 'https://www.linkedin.com/in/cameron-warren-73a0192b2/';
const GITHUB = 'https://github.com/cwarre33';

const STATS = [
  { value: '4,000+', label: 'tickets automated' },
  { value: '22×', label: 'faster inventory browsing' },
  { value: '95%', label: 'visual-search latency reduced' },
];

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      const r = visual.getBoundingClientRect();
      const x = ((event.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((event.clientY - r.top) / r.height - 0.5) * 2;
      visual.style.setProperty('--rx', `${-y * 3.5}deg`);
      visual.style.setProperty('--ry', `${x * 5}deg`);
      visual.style.setProperty('--mx', `${(x + 1) * 50}%`);
      visual.style.setProperty('--my', `${(y + 1) * 50}%`);
    };
    const leave = () => {
      visual.style.setProperty('--rx', '0deg');
      visual.style.setProperty('--ry', '0deg');
    };
    visual.addEventListener('pointermove', move);
    visual.addEventListener('pointerleave', leave);
    return () => {
      visual.removeEventListener('pointermove', move);
      visual.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker"><span /> AI Research Analyst · Software Engineer</p>
          <h1 className="hero__title">I build AI systems<br />that <em>survive production.</em></h1>
          <p className="hero__lede">From model experiments to cloud infrastructure — I design and ship fast, measurable systems for real teams and real data.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#projects">Explore selected systems <span>↘</span></a>
            <a className="button button--quiet" href="#contact">Get in touch</a>
          </div>
          <div className="hero__meta">
            <span>UNC Charlotte · Computer Science</span>
            <span>Furnitureland South · Jamestown, NC</span>
            <span><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a> · <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a></span>
          </div>
        </div>

        <div className="hero__visual" ref={visualRef} aria-label="Reactive network connecting Charlotte and Jamestown, North Carolina">
          <div className="hero__glow" aria-hidden="true" />
          <svg viewBox="0 0 720 620" role="img" aria-labelledby="network-title network-desc">
            <title id="network-title">Charlotte to Jamestown engineering network</title>
            <desc id="network-desc">An abstract reactive network connecting Charlotte, UNC Charlotte, and Jamestown with production system nodes.</desc>
            <defs>
              <linearGradient id="lineGlow" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".12"/><stop offset=".5" stopColor="#00b388" stopOpacity=".9"/><stop offset="1" stopColor="#fff" stopOpacity=".1"/></linearGradient>
              <filter id="soft"><feGaussianBlur stdDeviation="5"/></filter>
            </defs>
            <g className="network__contours" fill="none">
              <path d="M20 480 C120 390 170 540 275 450 S460 370 700 430"/>
              <path d="M0 520 C110 430 180 590 310 485 S510 420 720 485"/>
              <path d="M60 565 C180 485 245 610 365 525 S565 470 700 535"/>
              <path d="M80 405 C160 340 230 445 335 390 S510 320 670 365"/>
            </g>
            <g className="network__links" fill="none">
              <path d="M128 390 L262 315 L382 366 L520 260 L615 165"/>
              <path d="M262 315 L330 205 L520 260 L575 390 L382 366 L250 495 L128 390"/>
              <path d="M330 205 L420 130 L615 165"/>
            </g>
            <path className="network__route" d="M128 390 C250 330 410 300 615 165" fill="none"/>
            <circle className="network__pulse" r="5"><animateMotion dur="4s" repeatCount="indefinite" path="M128 390 C250 330 410 300 615 165"/></circle>
            <g className="network__minor">
              <circle cx="262" cy="315" r="4"/><circle cx="382" cy="366" r="4"/><circle cx="520" cy="260" r="4"/><circle cx="330" cy="205" r="4"/><circle cx="420" cy="130" r="4"/><circle cx="575" cy="390" r="4"/><circle cx="250" cy="495" r="4"/>
            </g>
            <g className="network__place network__place--charlotte" transform="translate(128 390)">
              <circle className="network__halo" r="28"/><circle r="8"/><text x="18" y="-8">CHARLOTTE</text><text className="network__sub" x="18" y="10">UNC CHARLOTTE</text>
            </g>
            <g className="network__place network__place--jamestown" transform="translate(615 165)">
              <circle className="network__halo" r="28"/><circle r="8"/><text textAnchor="end" x="-18" y="-8">JAMESTOWN</text><text className="network__sub" textAnchor="end" x="-18" y="10">FURNITURELAND SOUTH</text>
            </g>
            <g className="network__label" transform="translate(455 285)"><rect width="118" height="32" rx="16"/><text x="59" y="20" textAnchor="middle">PRODUCTION AI</text></g>
            <g className="network__label" transform="translate(205 455)"><rect width="100" height="32" rx="16"/><text x="50" y="20" textAnchor="middle">AWS / RDS</text></g>
          </svg>
          <div className="hero__visual-caption"><span>NC / 35.2271° N</span><span>LIVE SYSTEMS / 04</span></div>
        </div>
      </div>

      <div className="container hero__stats" aria-label="Selected engineering impact">
        {STATS.map((stat, index) => <div className="hero__stat" key={stat.label}><span className="hero__stat-index">0{index + 1}</span><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;padding:8rem 0 2rem;overflow:hidden;border-bottom:1px solid var(--border)}
        .hero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black 35%,transparent 88%)}
        .hero__inner{position:relative;display:grid;grid-template-columns:minmax(0,.95fr) minmax(420px,1.05fr);align-items:center;gap:3rem;min-height:620px}
        .hero__copy{position:relative;z-index:2}.hero__kicker{font:600 .72rem/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center;gap:.65rem;margin-bottom:2rem}.hero__kicker span{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 18px var(--accent)}
        .hero__title{font-size:clamp(3.2rem,6.2vw,6.8rem);font-weight:600;line-height:.91;letter-spacing:-.065em;max-width:780px}.hero__title em{font-family:Georgia,serif;font-weight:400;color:var(--accent);letter-spacing:-.055em}.hero__lede{max-width:600px;margin:2rem 0;color:var(--text-muted);font-size:clamp(1rem,1.35vw,1.2rem);line-height:1.7}
        .hero__actions{display:flex;gap:.8rem;flex-wrap:wrap}.button{min-height:48px;padding:.8rem 1.15rem;border:1px solid var(--border);display:inline-flex;align-items:center;gap:.75rem;font:600 .8rem var(--font-mono);text-transform:uppercase;letter-spacing:.05em;transition:.25s ease}.button:hover{text-decoration:none;transform:translateY(-2px)}.button--primary{background:var(--accent);border-color:var(--accent);color:#001b14}.button--primary:hover{background:#19c99b;box-shadow:0 12px 40px rgba(0,179,136,.22)}.button--quiet{color:var(--text);background:rgba(255,255,255,.025)}
        .hero__meta{display:flex;flex-wrap:wrap;gap:.55rem 1.2rem;margin-top:2.2rem;font:500 .68rem var(--font-mono);letter-spacing:.04em;text-transform:uppercase;color:#727b78}.hero__meta a{color:inherit}.hero__meta a:hover{color:var(--accent)}
        .hero__visual{--rx:0deg;--ry:0deg;--mx:50%;--my:50%;position:relative;min-height:590px;transform:perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry));transform-style:preserve-3d;transition:transform .18s ease-out}.hero__visual svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.hero__glow{position:absolute;width:360px;height:360px;left:var(--mx);top:var(--my);transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(0,179,136,.16),transparent 68%);filter:blur(10px);pointer-events:none;transition:left .12s,top .12s}.network__contours path{stroke:#fff;stroke-opacity:.055;stroke-width:1}.network__links path{stroke:#fff;stroke-opacity:.12;stroke-width:1}.network__route{stroke:url(#lineGlow);stroke-width:1.5;stroke-dasharray:5 9}.network__pulse{fill:#fff;filter:drop-shadow(0 0 8px #00b388)}.network__minor circle{fill:#0b0e0d;stroke:#00b388;stroke-width:1.5}.network__place>circle:not(.network__halo){fill:#00b388;stroke:#bfffee;stroke-width:2}.network__halo{fill:none;stroke:#00b388;stroke-opacity:.35;stroke-width:1}.network__place text{fill:#f6fbf9;font:700 13px var(--font-mono);letter-spacing:.1em}.network__place .network__sub{fill:#77827e;font-size:9px;font-weight:500}.network__label rect{fill:#0d1311;stroke:#29433b}.network__label text{fill:#8ea099;font:600 8px var(--font-mono);letter-spacing:.08em}
        .hero__visual-caption{position:absolute;bottom:2rem;left:2rem;right:2rem;display:flex;justify-content:space-between;color:#53605c;font:600 .62rem var(--font-mono);letter-spacing:.12em}
        .hero__stats{position:relative;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--border)}.hero__stat{padding:1.5rem 1.5rem 1.2rem 0;display:grid;grid-template-columns:auto 1fr;gap:.2rem 1rem;border-right:1px solid var(--border)}.hero__stat:not(:first-child){padding-left:1.5rem}.hero__stat:last-child{border-right:0}.hero__stat-index{grid-row:1/3;color:#4e5a56;font:600 .62rem var(--font-mono)}.hero__stat strong{font-size:clamp(1.8rem,3vw,3rem);line-height:1;color:var(--accent);letter-spacing:-.04em}.hero__stat>span:last-child{color:var(--text-muted);font-size:.78rem;text-transform:uppercase;letter-spacing:.06em}
        @media(prefers-reduced-motion:no-preference){.network__halo{animation:halo 2.6s ease-out infinite}.network__route{animation:dash 14s linear infinite}.hero__copy{animation:reveal .8s cubic-bezier(.16,1,.3,1) both}@keyframes halo{0%{r:12;opacity:.8}100%{r:38;opacity:0}}@keyframes dash{to{stroke-dashoffset:-140}}@keyframes reveal{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}}
        @media(max-width:900px){.hero{padding-top:7rem}.hero__inner{grid-template-columns:1fr;min-height:auto}.hero__visual{min-height:440px;margin-top:-2rem}.hero__stats{grid-template-columns:1fr}.hero__stat,.hero__stat:not(:first-child){padding:1.2rem 0;border-right:0;border-bottom:1px solid var(--border)}}
        @media(max-width:560px){.hero__title{font-size:clamp(2.8rem,14vw,4.5rem)}.hero__visual{min-height:340px;margin-inline:-2rem}.hero__visual-caption{display:none}.network__place text{font-size:11px}.network__place .network__sub{font-size:8px}}
      `}</style>
    </section>
  );
}
