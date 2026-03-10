import { useRef, type ReactNode, type CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'article' | 'section';
  tilt?: boolean;
  /** Stack depth offset in px (for stackable glass look) */
  stackIndex?: number;
}

/**
 * A frosted-glass card component inspired by Spline's "Stackable Glass" designs.
 *
 * Features:
 *  - Semi-transparent background with backdrop blur
 *  - Subtle reflection/glare streak
 *  - 3D perspective tilt on hover (when tilt=true)
 *  - Light-catching edge highlights
 *  - Depth shadow for glass-thickness illusion
 */
export function GlassCard({
  children,
  className = '',
  style,
  as: Tag = 'div',
  tilt = true,
  stackIndex = 0,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const ty = stackIndex ? 0 : -2;
    cardRef.current.style.transform =
      `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(${ty}px)`;
  }

  function handleMouseLeave() {
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = '';
  }

  return (
    <Tag
      ref={cardRef as React.RefObject<never>}
      className={`glass-card ${className}`}
      style={{
        '--stack-offset': `${stackIndex * 4}px`,
        ...style,
      } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reflection glare overlay */}
      <div className="glass-card__reflection" aria-hidden />
      {/* Content layer above reflection */}
      <div className="glass-card__content">{children}</div>

      <style>{`
        .glass-card {
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: var(--glass-shadow);
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.3s,
            box-shadow 0.3s;
          will-change: transform;
          transform-style: preserve-3d;
        }

        /* Top edge highlight — light catching on the glass */
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.2) 70%,
            transparent 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        /* Bottom edge shadow for glass thickness */
        .glass-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: rgba(0, 0, 0, 0.3);
          z-index: 2;
          pointer-events: none;
        }

        .glass-card:hover {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
        }

        /* Diagonal reflection glare */
        .glass-card__reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.03) 30%,
            rgba(255, 255, 255, 0.08) 45%,
            rgba(255, 255, 255, 0.03) 55%,
            rgba(255, 255, 255, 0) 80%
          );
          z-index: 1;
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .glass-card:hover .glass-card__reflection {
          opacity: 1;
        }

        .glass-card__content {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </Tag>
  );
}
