import {
  getClarityId,
  getGoatCounterCode,
  isAnalyticsEnabled,
  type AnalyticsEnv,
} from './config';
import './types';

const seenSections = new Set<string>();

export function __resetTrackedSectionsForTests(): void {
  seenSections.clear();
}

export function trackEvent(name: string, env?: AnalyticsEnv): void {
  const resolved = env ?? (import.meta.env as AnalyticsEnv);
  if (!isAnalyticsEnabled(resolved)) return;
  if (typeof window === 'undefined') return;

  if (getGoatCounterCode(resolved) && window.goatcounter?.count) {
    try {
      window.goatcounter.count({ path: name, event: true });
    } catch {
      // ignore
    }
  }

  if (getClarityId(resolved) && typeof window.clarity === 'function') {
    try {
      window.clarity('event', name);
    } catch {
      // ignore
    }
  }
}

export function trackSection(sectionId: string, env?: AnalyticsEnv): void {
  if (seenSections.has(sectionId)) return;
  seenSections.add(sectionId);
  trackEvent(`section_${sectionId}`, env);
}
