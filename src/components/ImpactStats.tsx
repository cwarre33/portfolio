import { useEffect, useRef, useState } from 'react';
import { impactStats, type ImpactStat } from '../data/impactStats';

function formatStat(stat: ImpactStat, value: number) {
  const display = value.toLocaleString('en-US',{minimumFractionDigits:stat.decimals??0,maximumFractionDigits:stat.decimals??0});
  return `${stat.prefix??''}${display}${stat.suffix??''}`;
}
function StatCard({stat,start,index}:{stat:ImpactStat;start:boolean;index:number}) {
  const valueRef=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    if(!start||!valueRef.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const node=valueRef.current,t0=performance.now();let raf=0;
    const tick=(now:number)=>{const p=Math.min((now-t0)/1500,1),e=1-Math.pow(1-p,3);node.textContent=formatStat(stat,stat.target*e);if(p<1)raf=requestAnimationFrame(tick)};
    node.textContent=formatStat(stat,0);raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
  },[start,stat]);
  return <div className={`impact-stats__card${start?' impact-stats__card--in':''}`} style={{'--stat-delay':`${index*.08}s`} as React.CSSProperties}>
    <span ref={valueRef} className="impact-stats__value" data-count-to={stat.target}>{formatStat(stat,stat.target)}</span>
    <span className="impact-stats__label">{stat.label}</span><span className="impact-stats__detail">{stat.detail}</span>
  </div>;
}
export function ImpactStats(){const ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.25});observer.observe(el);return()=>observer.disconnect()},[]);return <div className="impact-stats" ref={ref} aria-label="Headline metrics">{impactStats.map((stat,i)=><StatCard key={stat.label} stat={stat} start={visible} index={i}/>)}<style>{`
.impact-stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--border);margin-bottom:3rem}.impact-stats__card{padding:1.5rem;border-right:1px solid var(--border);background:rgba(255,255,255,.012);opacity:.5;transform:translateY(12px)}.impact-stats__card:last-child{border-right:0}.impact-stats__card--in{opacity:1;transform:none}.impact-stats__value{display:block;font:700 clamp(1.8rem,3vw,3.1rem)/1 var(--font-mono);letter-spacing:-.06em;color:var(--accent);font-variant-numeric:tabular-nums}.impact-stats__label{display:block;margin-top:.7rem;font-size:.78rem;font-weight:650;text-transform:uppercase;letter-spacing:.05em}.impact-stats__detail{display:block;margin-top:.35rem;color:var(--text-muted);font-size:.7rem;line-height:1.45}@media(prefers-reduced-motion:no-preference){.impact-stats__card--in{animation:statin .55s cubic-bezier(.16,1,.3,1) var(--stat-delay) both}@keyframes statin{from{opacity:.5;transform:translateY(12px)}to{opacity:1;transform:none}}}@media(max-width:800px){.impact-stats{grid-template-columns:repeat(2,1fr)}.impact-stats__card:nth-child(2){border-right:0}.impact-stats__card{border-bottom:1px solid var(--border)}}@media(max-width:480px){.impact-stats{grid-template-columns:1fr}.impact-stats__card{border-right:0}}
`}</style></div>}
