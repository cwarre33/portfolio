import { afterEach, describe, expect, it, vi } from 'vitest';
import { initAnalytics, __resetInitForTests } from './init';

describe('initAnalytics', () => {
  afterEach(() => {
    __resetInitForTests();
    document.head.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('does not inject scripts when disabled', () => {
    initAnalytics({
      PROD: false,
      VITE_GOATCOUNTER_CODE: 'mysite',
      VITE_CLARITY_ID: 'clarityid',
    });
    expect(document.querySelectorAll('script').length).toBe(0);
  });

  it('injects GoatCounter and Clarity scripts once when enabled', () => {
    initAnalytics({
      PROD: true,
      VITE_GOATCOUNTER_CODE: 'mysite',
      VITE_CLARITY_ID: 'clarityid',
    });
    initAnalytics({
      PROD: true,
      VITE_GOATCOUNTER_CODE: 'mysite',
      VITE_CLARITY_ID: 'clarityid',
    });

    const goat = document.querySelector(
      'script[data-goatcounter="https://mysite.goatcounter.com/count"]'
    );
    const clarity = document.querySelector(
      'script[src="https://www.clarity.ms/tag/clarityid"]'
    );
    expect(goat).toBeTruthy();
    expect(clarity).toBeTruthy();
    expect(document.querySelectorAll('script').length).toBe(2);
  });
});
