import { getClarityId, getGoatCounterCode, isAnalyticsEnabled } from './config';
import './types';

type AnalyticsEnv = {
  PROD: boolean;
  VITE_GOATCOUNTER_CODE?: string;
  VITE_CLARITY_ID?: string;
};

let initialized = false;

export function __resetInitForTests(): void {
  initialized = false;
}

export function initAnalytics(env?: AnalyticsEnv): void {
  const resolved = env ?? (import.meta.env as AnalyticsEnv);
  if (initialized) return;
  if (!isAnalyticsEnabled(resolved)) return;
  if (typeof document === 'undefined') return;

  initialized = true;

  const goatCode = getGoatCounterCode(resolved);
  if (goatCode) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${goatCode}.goatcounter.com/count`;
    document.head.appendChild(s);
  }

  const clarityId = getClarityId(resolved);
  if (clarityId) {
    const w = window;
    if (!w.clarity) {
      const queue = ((...args: unknown[]) => {
        (queue as { q?: unknown[] }).q = (queue as { q?: unknown[] }).q || [];
        (queue as { q: unknown[] }).q.push(args);
      }) as Window['clarity'];
      w.clarity = queue;
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(s);
  }
}
