import { describe, expect, it } from 'vitest';
import type { AnalyticsEnv } from './config';
import { isAnalyticsEnabled } from './config';

function env(overrides: Partial<AnalyticsEnv>): AnalyticsEnv {
  return {
    PROD: false,
    VITE_GOATCOUNTER_CODE: '',
    VITE_CLARITY_ID: '',
    ...overrides,
  };
}

describe('analytics config', () => {
  it('isAnalyticsEnabled is false when not PROD', () => {
    expect(
      isAnalyticsEnabled(
        env({
          PROD: false,
          VITE_GOATCOUNTER_CODE: 'mysite',
          VITE_CLARITY_ID: 'abc123',
        }),
      ),
    ).toBe(false);
  });

  it('isAnalyticsEnabled is false in PROD with no IDs', () => {
    expect(
      isAnalyticsEnabled(
        env({
          PROD: true,
          VITE_GOATCOUNTER_CODE: '',
          VITE_CLARITY_ID: '',
        }),
      ),
    ).toBe(false);
  });

  it('isAnalyticsEnabled is true in PROD with GoatCounter code', () => {
    expect(
      isAnalyticsEnabled(
        env({
          PROD: true,
          VITE_GOATCOUNTER_CODE: 'mysite',
          VITE_CLARITY_ID: '',
        }),
      ),
    ).toBe(true);
  });

  it('isAnalyticsEnabled is true in PROD with Clarity ID only', () => {
    expect(
      isAnalyticsEnabled(
        env({
          PROD: true,
          VITE_GOATCOUNTER_CODE: '',
          VITE_CLARITY_ID: 'abc123',
        }),
      ),
    ).toBe(true);
  });
});
