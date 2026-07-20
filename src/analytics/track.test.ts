import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent, trackSection, __resetTrackedSectionsForTests } from './track';

describe('track helpers', () => {
  afterEach(() => {
    __resetTrackedSectionsForTests();
    vi.restoreAllMocks();
    delete (globalThis as { window?: Window }).window;
  });

  it('trackEvent no-ops when analytics disabled', () => {
    const count = vi.fn();
    (globalThis as unknown as { window: Window }).window = {
      goatcounter: { count },
      clarity: vi.fn(),
    } as unknown as Window;

    trackEvent('resume_download', {
      PROD: false,
      VITE_GOATCOUNTER_CODE: 'site',
      VITE_CLARITY_ID: 'id',
    });

    expect(count).not.toHaveBeenCalled();
  });

  it('trackEvent sends GoatCounter event and Clarity event when enabled', () => {
    const count = vi.fn();
    const clarity = vi.fn();
    (globalThis as unknown as { window: Window }).window = {
      goatcounter: { count },
      clarity,
    } as unknown as Window;

    trackEvent('resume_download', {
      PROD: true,
      VITE_GOATCOUNTER_CODE: 'site',
      VITE_CLARITY_ID: 'id',
    });

    expect(count).toHaveBeenCalledWith({
      path: 'resume_download',
      event: true,
    });
    expect(clarity).toHaveBeenCalledWith('event', 'resume_download');
  });

  it('trackSection fires once per section id', () => {
    const count = vi.fn();
    const clarity = vi.fn();
    (globalThis as unknown as { window: Window }).window = {
      goatcounter: { count },
      clarity,
    } as unknown as Window;

    const env = {
      PROD: true,
      VITE_GOATCOUNTER_CODE: 'site',
      VITE_CLARITY_ID: 'id',
    };

    trackSection('about', env);
    trackSection('about', env);
    trackSection('projects', env);

    expect(count).toHaveBeenCalledTimes(2);
    expect(clarity).toHaveBeenCalledWith('event', 'section_about');
    expect(clarity).toHaveBeenCalledWith('event', 'section_projects');
  });
});
