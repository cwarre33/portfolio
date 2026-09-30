import { useEffect, useRef, useState } from 'react';
import { domainOf, wiki, type DomainKey, domains } from '../data/wiki';
import { prefersReducedMotion } from '../hooks/motion';

interface Layout {
  pos: Float32Array;
  color: string[];
  domain: DomainKey[];
  radius: number[];
  neighbors: Set<number>[];
}

let cached: Layout | null = null;

/** Deterministic 3D force layout, clustered by domain. Computed once per page load. */
function computeLayout(): Layout {
  if (cached) return cached;
  const n = wiki.nodes.length;
  const pos = new Float32Array(n * 3);
  const vel = new Float32Array(n * 3);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

  // Domain anchors on a Fibonacci sphere.
  const anchors = new Map<DomainKey, [number, number, number]>();
  domains.forEach((d, i) => {
    const y = 1 - (i / (domains.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    anchors.set(d.key, [Math.cos(phi) * r * 80, y * 60, Math.sin(phi) * r * 80]);
  });

  const domain = wiki.nodes.map((node) => domainOf(node.s).key);
  for (let i = 0; i < n; i++) {
    const a = anchors.get(domain[i])!;
    pos[i * 3] = a[0] + rand() * 40;
    pos[i * 3 + 1] = a[1] + rand() * 40;
    pos[i * 3 + 2] = a[2] + rand() * 40;
  }

  const neighbors = wiki.nodes.map(() => new Set<number>());
  for (const [a, b] of wiki.links) {
    neighbors[a].add(b);
    neighbors[b].add(a);
  }

  for (let step = 0; step < 280; step++) {
    const cool = 1 - step / 280;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz + 0.01;
        const f = 900 / d2;
        const d = Math.sqrt(d2);
        const fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
        vel[i * 3] += fx; vel[i * 3 + 1] += fy; vel[i * 3 + 2] += fz;
        vel[j * 3] -= fx; vel[j * 3 + 1] -= fy; vel[j * 3 + 2] -= fz;
      }
    }
    for (const [a, b] of wiki.links) {
      const dx = pos[b * 3] - pos[a * 3];
      const dy = pos[b * 3 + 1] - pos[a * 3 + 1];
      const dz = pos[b * 3 + 2] - pos[a * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
      const f = (d - 34) * 0.035;
      const fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
      vel[a * 3] += fx; vel[a * 3 + 1] += fy; vel[a * 3 + 2] += fz;
      vel[b * 3] -= fx; vel[b * 3 + 1] -= fy; vel[b * 3 + 2] -= fz;
    }
    for (let i = 0; i < n; i++) {
      const a = anchors.get(domain[i])!;
      for (let k = 0; k < 3; k++) {
        vel[i * 3 + k] += (a[k] - pos[i * 3 + k]) * 0.012 - pos[i * 3 + k] * 0.002;
        vel[i * 3 + k] *= 0.6;
        pos[i * 3 + k] += Math.max(-8, Math.min(8, vel[i * 3 + k])) * cool;
      }
    }
  }

  // Center, then normalize so ~90% of nodes sit inside the unit sphere;
  // pull stragglers (isolated pages) in so they don't shrink everything else.
  const c = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) c[k] += pos[i * 3 + k] / n;
  const dist: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) pos[i * 3 + k] -= c[k];
    dist.push(Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
  }
  const p90 = [...dist].sort((a, b) => a - b)[Math.floor(n * 0.9)] || 1;
  for (let i = 0; i < n; i++) {
    const d = dist[i] / p90;
    const k = d > 1.15 ? 1.15 / d : 1;
    for (let j = 0; j < 3; j++) pos[i * 3 + j] = (pos[i * 3 + j] / p90) * k;
  }

  cached = {
    pos,
    domain,
    color: wiki.nodes.map((node) => domainOf(node.s).color),
    radius: wiki.nodes.map((node) => 1.4 + Math.sqrt(node.d) * 0.95),
    neighbors,
  };
  return cached;
}

function hexA(hex: string, a: number) {
  const v = parseInt(hex.slice(1), 16);
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a.toFixed(3)})`;
}

interface Props {
  focus: DomainKey | null;
  /** Horizontal center of the graph as a fraction of the canvas width. */
  centerX?: number;
}

interface Hover {
  index: number;
  x: number;
  y: number;
}

export function KnowledgeGraph({ focus, centerX = 0.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef(focus);
  const centerRef = useRef(centerX);
  const [hover, setHover] = useState<Hover | null>(null);
  focusRef.current = focus;
  centerRef.current = centerX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const L = computeLayout();
    const n = wiki.nodes.length;
    const reduced = prefersReducedMotion();
    const proj = new Float32Array(n * 3); // x, y, depth(0..1)
    const order = Array.from({ length: n }, (_, i) => i);

    let w = 0, h = 0, dpr = 1;
    let rotY = 0.6, rotX = -0.18, tiltX = 0, tiltY = 0;
    let dragging = false, lastX = 0, lastY = 0, velY = 0;
    let hovered = -1;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const pulses = Array.from({ length: reduced ? 0 : 26 }, () => ({
      link: Math.floor(Math.random() * wiki.links.length),
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.5,
      dir: Math.random() < 0.5,
    }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const project = () => {
      const cy = Math.cos(rotY + tiltY), sy = Math.sin(rotY + tiltY);
      const cx = Math.cos(rotX + tiltX), sx = Math.sin(rotX + tiltX);
      const scale = Math.min(w, h) * (w < 720 ? 0.44 : 0.36);
      const ox = w * centerRef.current, oy = h * 0.5;
      for (let i = 0; i < n; i++) {
        const x = L.pos[i * 3], y = L.pos[i * 3 + 1], z = L.pos[i * 3 + 2];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const p = 2.6 / (2.6 + z2);
        proj[i * 3] = ox + x1 * scale * p;
        proj[i * 3 + 1] = oy + y1 * scale * p;
        proj[i * 3 + 2] = (1 - z2) / 2; // 1 = near
      }
      order.sort((a, b) => proj[a * 3 + 2] - proj[b * 3 + 2]);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const f = focusRef.current;
      const hv = hovered;
      const active = (i: number) =>
        hv >= 0 ? i === hv || L.neighbors[hv].has(i) : f ? L.domain[i] === f : true;

      ctx.lineWidth = 1;
      for (const [a, b] of wiki.links) {
        const depth = (proj[a * 3 + 2] + proj[b * 3 + 2]) / 2;
        const on = hv >= 0 ? a === hv || b === hv : f ? L.domain[a] === f && L.domain[b] === f : true;
        const alpha = on ? (hv >= 0 || f ? 0.55 : 0.05 + depth * 0.12) : 0.025;
        ctx.strokeStyle = on && (hv >= 0 || f) ? hexA(L.color[hv >= 0 ? hv : a], alpha) : `rgba(233,230,223,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(proj[a * 3], proj[a * 3 + 1]);
        ctx.lineTo(proj[b * 3], proj[b * 3 + 1]);
        ctx.stroke();
      }

      for (const pl of pulses) {
        const [a0, b0] = wiki.links[pl.link];
        const [a, b] = pl.dir ? [a0, b0] : [b0, a0];
        const x = proj[a * 3] + (proj[b * 3] - proj[a * 3]) * pl.t;
        const y = proj[a * 3 + 1] + (proj[b * 3 + 1] - proj[a * 3 + 1]) * pl.t;
        const on = active(a) || active(b);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, hexA(L.color[a], on ? 0.95 : 0.2));
        g.addColorStop(1, hexA(L.color[a], 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const i of order) {
        const x = proj[i * 3], y = proj[i * 3 + 1], depth = proj[i * 3 + 2];
        const on = active(i);
        const r = L.radius[i] * (0.65 + depth * 0.7) * (i === hv ? 1.6 : 1);
        const a = on ? 0.45 + depth * 0.55 : 0.12;
        const named = wiki.nodes[i].t !== null;
        if (on && named) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
          g.addColorStop(0, hexA(L.color[i], 0.35 * a));
          g.addColorStop(1, hexA(L.color[i], 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (named) {
          ctx.fillStyle = hexA(L.color[i], a);
          ctx.fill();
        } else {
          ctx.strokeStyle = hexA(L.color[i], a * 0.9);
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      if (hv >= 0) {
        ctx.strokeStyle = hexA(L.color[hv], 0.9);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(proj[hv * 3], proj[hv * 3 + 1], L.radius[hv] * 2.6 + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        velY *= 0.95;
        rotY += (reduced ? 0 : 0.06) * dt + velY;
      }
      for (const pl of pulses) {
        pl.t += pl.speed * dt;
        if (pl.t >= 1) {
          pl.t = 0;
          pl.link = Math.floor(Math.random() * wiki.links.length);
          pl.dir = Math.random() < 0.5;
        }
      }
      project();
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const pick = (mx: number, my: number) => {
      let best = -1, bestD = 18 * 18;
      for (let i = 0; i < n; i++) {
        const dx = proj[i * 3] - mx, dy = proj[i * 3 + 1] - my;
        const d = dx * dx + dy * dy - proj[i * 3 + 2] * 30; // prefer near nodes
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        rotY += dx * 0.006;
        velY = dx * 0.0008;
        rotX = Math.max(-1.1, Math.min(1.1, rotX + dy * 0.004));
      } else if (!reduced) {
        tiltY = ((mx / w) - 0.5) * 0.25;
        tiltX = ((my / h) - 0.5) * -0.18;
      }
      if (e.pointerType === 'mouse') {
        const idx = dragging ? -1 : pick(mx, my);
        if (idx !== hovered) {
          hovered = idx;
          canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab';
          setHover(idx >= 0 ? { index: idx, x: proj[idx * 3], y: proj[idx * 3 + 1] } : null);
        }
      }
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.pointerType !== 'mouse') {
        const idx = pick(e.clientX - r.left, e.clientY - r.top);
        hovered = idx;
        setHover(idx >= 0 ? { index: idx, x: proj[idx * 3], y: proj[idx * 3 + 1] } : null);
      }
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = hovered >= 0 ? 'pointer' : 'grab';
    };
    const onLeave = () => {
      tiltX = tiltY = 0;
      if (hovered >= 0) {
        hovered = -1;
        setHover(null);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const node = hover ? wiki.nodes[hover.index] : null;
  const dom = node ? domainOf(node.s) : null;

  return (
    <div className="kg">
      <canvas
        ref={canvasRef}
        className="kg__canvas"
        role="img"
        aria-label={`Interactive 3D map of Cameron's knowledge wiki: ${wiki.totals.pages} pages connected by ${wiki.totals.links} links.`}
      />
      {node && dom && hover && (
        <div className="kg__tip" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
          <span className="kg__tip-domain" style={{ color: dom.color }}>
            {dom.label}
          </span>
          <strong>{node.t ?? 'Redacted: internal page'}</strong>
          <span className="kg__tip-meta">
            {node.d} link{node.d === 1 ? '' : 's'} · wiki/{node.s}
          </span>
        </div>
      )}
    </div>
  );
}
