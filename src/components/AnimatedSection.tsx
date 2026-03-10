import { useEffect, useRef, useState, type ReactNode } from 'react';

type AnimationVariant = 'fade-up' | 'fade-in' | 'slide-right';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
}

const hiddenTransforms: Record<AnimationVariant, string> = {
  'fade-up':    'translateY(28px)',
  'fade-in':    'scale(0.97)',
  'slide-right': 'translateX(-20px)',
};

const visibleTransforms: Record<AnimationVariant, string> = {
  'fade-up':    'translateY(0)',
  'fade-in':    'scale(1)',
  'slide-right': 'translateX(0)',
};

export function AnimatedSection({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animated-section ${visible ? 'animated-section--visible' : ''} ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? visibleTransforms[variant] : hiddenTransforms[variant],
        transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
