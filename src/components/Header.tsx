import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#projects', label: 'Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const onScroll=()=>setScrolled(window.scrollY>32); window.addEventListener('scroll',onScroll,{passive:true}); return()=>window.removeEventListener('scroll',onScroll); },[]);
  useEffect(()=>{document.body.style.overflow=menuOpen?'hidden':'';return()=>{document.body.style.overflow=''}},[menuOpen]);
  return <header className={`header ${scrolled?'header--scrolled':''} ${menuOpen?'header--open':''}`}>
    <div className="container header__inner">
      <a href="#" className="header__brand" onClick={()=>setMenuOpen(false)}><span className="header__mark">CW</span><span>Cameron Warren<small>Software / AI Systems</small></span></a>
      <button className="header__toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><i/><i/></button>
      <nav className="header__nav" aria-label="Main navigation">{navLinks.map((link,i)=><a key={link.href} href={link.href} onClick={()=>setMenuOpen(false)}><span>0{i+1}</span>{link.label}</a>)}</nav>
    </div>
    <style>{`
      .header{position:fixed;z-index:100;inset:0 0 auto;padding:1rem 0;transition:.3s ease}.header--scrolled{background:rgba(7,10,9,.82);backdrop-filter:blur(18px);border-bottom:1px solid var(--border)}.header__inner{display:flex;align-items:center;justify-content:space-between}.header__brand{display:flex;align-items:center;gap:.75rem;color:var(--text);font-size:.85rem;font-weight:650;line-height:1.1;letter-spacing:-.01em}.header__brand:hover{text-decoration:none}.header__brand small{display:block;margin-top:.25rem;color:#64706c;font:500 .56rem var(--font-mono);text-transform:uppercase;letter-spacing:.11em}.header__mark{width:35px;height:35px;display:grid;place-items:center;border:1px solid var(--accent);color:var(--accent);font:700 .68rem var(--font-mono)}.header__nav{display:flex;align-items:center;gap:1.8rem}.header__nav a{color:#9aa49f;font:600 .68rem var(--font-mono);text-transform:uppercase;letter-spacing:.08em}.header__nav a span{color:#46534e;margin-right:.45rem}.header__nav a:hover{color:var(--text);text-decoration:none}.header__toggle{display:none;width:44px;height:44px;background:transparent;border:0;position:relative}.header__toggle i{position:absolute;width:22px;height:1px;background:var(--text);left:11px;top:19px;transition:.2s}.header__toggle i+ i{top:25px}.header--open .header__toggle i{transform:translateY(3px) rotate(45deg)}.header--open .header__toggle i+i{transform:translateY(-3px) rotate(-45deg)}
      @media(max-width:760px){.header__toggle{display:block}.header__nav{display:none;position:fixed;inset:0;background:rgba(7,10,9,.98);padding:7rem 1.5rem;flex-direction:column;align-items:flex-start;gap:0}.header--open .header__nav{display:flex}.header__nav a{width:100%;padding:1.3rem 0;border-bottom:1px solid var(--border);font-size:1rem}.header__brand,.header__toggle{z-index:2}}
    `}</style>
  </header>;
}
