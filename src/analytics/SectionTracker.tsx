import { useEffect } from 'react';
import { trackSection } from './track';

interface SectionTrackerProps {
  sectionIds: string[];
}

export function SectionTracker({ sectionIds }: SectionTrackerProps) {
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            trackSection(entry.target.id);
          }
        }
      },
      { threshold: 0.35 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return null;
}
