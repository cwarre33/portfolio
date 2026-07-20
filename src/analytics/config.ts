export type AnalyticsEnv = {
  PROD: boolean;
  VITE_GOATCOUNTER_CODE?: string;
  VITE_CLARITY_ID?: string;
};

export function getGoatCounterCode(env: AnalyticsEnv = import.meta.env): string | undefined {
  const code = env.VITE_GOATCOUNTER_CODE?.trim();
  return code || undefined;
}

export function getClarityId(env: AnalyticsEnv = import.meta.env): string | undefined {
  const id = env.VITE_CLARITY_ID?.trim();
  return id || undefined;
}

export function isProd(env: AnalyticsEnv = import.meta.env): boolean {
  return env.PROD === true;
}

export function isAnalyticsEnabled(env: AnalyticsEnv = import.meta.env): boolean {
  return isProd(env) && Boolean(getGoatCounterCode(env) || getClarityId(env));
}
