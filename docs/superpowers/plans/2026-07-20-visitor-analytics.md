# Visitor Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add invisible GoatCounter + Microsoft Clarity tracking (traffic + engagement + custom events) to the GitHub Pages portfolio, and a Tailscale-only hub page served from this Mac.

**Architecture:** Production-only scripts load from `src/analytics/` with env-based site IDs. Custom events fire into both tools. A separate `private-dashboard/` static page is served locally and exposed only via Tailscale Serve — not GitHub Pages.

**Tech Stack:** React 18, TypeScript, Vite 5, GoatCounter, Microsoft Clarity, Node http (private hub), Tailscale Serve, Vitest (unit tests for analytics helpers).

**Spec:** `docs/superpowers/specs/2026-07-20-visitor-analytics-design.md`

## Global Constraints

- No cookie banner, badge, or analytics UI on the public portfolio.
- Analytics scripts load only when `import.meta.env.PROD` is true and the relevant `VITE_*` ID is set.
- Missing IDs or failed script load must silently no-op; the site must still render.
- Private hub must not be deployed by `.github/workflows/deploy-pages.yml`.
- Do not add Google Analytics.
- Prefer small focused files under `src/analytics/`.

## File structure

| Path | Responsibility |
|------|----------------|
| `src/analytics/config.ts` | Read env IDs; `isAnalyticsEnabled()` |
| `src/analytics/init.ts` | Inject GoatCounter + Clarity scripts once |
| `src/analytics/track.ts` | `trackEvent`, `trackSection` |
| `src/analytics/SectionTracker.tsx` | IntersectionObserver → `trackSection` once per id |
| `src/analytics/types.ts` | `Window` augmentations for `goatcounter` / `clarity` |
| `src/analytics/config.test.ts` | Unit tests for enablement logic |
| `src/analytics/track.test.ts` | Unit tests for no-op / dispatch |
| `public/downloads/CameronWarrenResumeDownload.pdf` | Resume asset shipped in `dist/` |
| `.env.example` | Document `VITE_GOATCOUNTER_CODE`, `VITE_CLARITY_ID` |
| `private-dashboard/index.html` | Tailscale hub UI (v1 links + status) |
| `private-dashboard/serve.mjs` | Local static server on `127.0.0.1` |
| `private-dashboard/README.md` | Run + Tailscale Serve instructions |

---

### Task 1: Vitest + analytics config

**Files:**
- Create: `src/analytics/config.ts`
- Create: `src/analytics/config.test.ts`
- Modify: `package.json` (scripts + vitest devDependency)
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: `getGoatCounterCode(): string | undefined`, `getClarityId(): string | undefined`, `isProd(): boolean`, `isAnalyticsEnabled(): boolean`

- [ ] **Step 1: Add Vitest**

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Write failing tests for config**

Create `src/analytics/config.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('analytics config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('isAnalyticsEnabled is false when not PROD', async () => {
    vi.stubEnv('PROD', '');
    vi.stubEnv('VITE_GOATCOUNTER_CODE', 'mysite');
    vi.stubEnv('VITE_CLARITY_ID', 'abc123');
    const { isAnalyticsEnabled } = await import('./config');
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it('isAnalyticsEnabled is false in PROD with no IDs', async () => {
    vi.stubEnv('PROD', 'true');
    vi.stubEnv('VITE_GOATCOUNTER_CODE', '');
    vi.stubEnv('VITE_CLARITY_ID', '');
    const { isAnalyticsEnabled } = await import('./config');
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it('isAnalyticsEnabled is true in PROD with GoatCounter code', async () => {
    vi.stubEnv('PROD', 'true');
    vi.stubEnv('VITE_GOATCOUNTER_CODE', 'mysite');
    vi.stubEnv('VITE_CLARITY_ID', '');
    const { isAnalyticsEnabled } = await import('./config');
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it('isAnalyticsEnabled is true in PROD with Clarity ID only', async () => {
    vi.stubEnv('PROD', 'true');
    vi.stubEnv('VITE_GOATCOUNTER_CODE', '');
    vi.stubEnv('VITE_CLARITY_ID', 'abc123');
    const { isAnalyticsEnabled } = await import('./config');
    expect(isAnalyticsEnabled()).toBe(true);
  });
});
```

Note: Vite exposes `import.meta.env.PROD` as a boolean at build time. For Vitest, implement `isProd()` using `import.meta.env.PROD === true` (Vitest/Vite plugin will provide it). Prefer stubbing via `vi.stubEnv('MODE', 'production')` if `PROD` stubbing is unreliable — then implement:

```ts
export function isProd(): boolean {
  return import.meta.env.PROD === true;
}
```

If `vi.stubEnv('PROD', ...)` does not flip `import.meta.env.PROD`, switch tests to inject a testable seam:

```ts
export function isAnalyticsEnabled(env = import.meta.env): boolean {
  const prod = env.PROD === true;
  const goat = Boolean(env.VITE_GOATCOUNTER_CODE);
  const clarity = Boolean(env.VITE_CLARITY_ID);
  return prod && (goat || clarity);
}
```

And call `isAnalyticsEnabled({ PROD: true, VITE_GOATCOUNTER_CODE: 'x', VITE_CLARITY_ID: '' } as ImportMetaEnv)` in tests. Prefer this seam if stubbing fails.

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL (module `./config` missing or `isAnalyticsEnabled` undefined).

- [ ] **Step 4: Implement config**

Create `src/analytics/config.ts`:

```ts
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
```

Update tests to pass an explicit `env` object (preferred over `vi.stubEnv`).

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/analytics/config.ts src/analytics/config.test.ts
git commit -m "$(cat <<'EOF'
test: add vitest and analytics enablement config

EOF
)"
```

---

### Task 2: trackEvent / trackSection helpers

**Files:**
- Create: `src/analytics/types.ts`
- Create: `src/analytics/track.ts`
- Create: `src/analytics/track.test.ts`

**Interfaces:**
- Consumes: `getGoatCounterCode`, `getClarityId`, `isAnalyticsEnabled` from `./config`
- Produces: `trackEvent(name: string): void`, `trackSection(sectionId: string): void`

- [ ] **Step 1: Write failing tests**

Create `src/analytics/types.ts`:

```ts
export {};

declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: { path?: string; title?: string; event?: boolean }) => void;
    };
    clarity?: (action: string, ...args: unknown[]) => void;
  }
}
```

Create `src/analytics/track.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL (`track` module missing).

- [ ] **Step 3: Implement track.ts**

In Task 1’s `config.ts`, export the env type:

```ts
export type AnalyticsEnv = {
  PROD: boolean;
  VITE_GOATCOUNTER_CODE?: string;
  VITE_CLARITY_ID?: string;
};
```

Then implement `src/analytics/track.ts`:

```ts
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/types.ts src/analytics/track.ts src/analytics/track.test.ts src/analytics/config.ts
git commit -m "$(cat <<'EOF'
feat: add analytics trackEvent and trackSection helpers

EOF
)"
```

---

### Task 3: Script init (GoatCounter + Clarity)

**Files:**
- Create: `src/analytics/init.ts`
- Create: `src/analytics/init.test.ts`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `getGoatCounterCode`, `getClarityId`, `isAnalyticsEnabled`
- Produces: `initAnalytics(): void` (idempotent)

- [ ] **Step 1: Write failing init tests**

Use `happy-dom` or `jsdom` for DOM APIs. Install:

```bash
npm install -D happy-dom
```

Update `vitest.config.ts` `environment` to `'happy-dom'` (or set per-file).

Create `src/analytics/init.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL (`init` missing).

- [ ] **Step 3: Implement init.ts**

```ts
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
```

In `types.ts`, type Clarity as:

```ts
clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
```

- [ ] **Step 4: Call init from main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initAnalytics } from './analytics/init';
import './index.css';

initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/analytics/init.ts src/analytics/init.test.ts src/analytics/types.ts src/main.tsx package.json package-lock.json vitest.config.ts
git commit -m "$(cat <<'EOF'
feat: initialize GoatCounter and Clarity in production

EOF
)"
```

---

### Task 4: SectionTracker + wire sections

**Files:**
- Create: `src/analytics/SectionTracker.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `trackSection(sectionId: string): void`
- Produces: `<SectionTracker sectionIds={string[]} />`

Section IDs present in the app today:

- `about`, `experience`, `aws`, `projects`, `certifications`, `contact`

- [ ] **Step 1: Implement SectionTracker**

```tsx
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
```

- [ ] **Step 2: Mount in App.tsx**

```tsx
import { SectionTracker } from './analytics/SectionTracker';
// ...existing imports...

function App() {
  return (
    <>
      <SectionTracker
        sectionIds={[
          'about',
          'experience',
          'aws',
          'projects',
          'certifications',
          'contact',
        ]}
      />
      <Header />
      <main>
        {/* unchanged */}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Manual check**

```bash
npm run build
```

Expected: build succeeds with no TS errors.

- [ ] **Step 4: Commit**

```bash
git add src/analytics/SectionTracker.tsx src/App.tsx
git commit -m "$(cat <<'EOF'
feat: track section reach via IntersectionObserver

EOF
)"
```

---

### Task 5: Wire click events + resume download

**Files:**
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/Hero.tsx` (optional secondary CTAs — LinkedIn/GitHub already duplicated; track Contact + Hero primary outbound if desired)
- Create: `public/downloads/CameronWarrenResumeDownload.pdf` (copy from `downloads/CameronWarrenResumeDownload.pdf`)

**Event names (exact):**

| Name | Where |
|------|--------|
| `resume_download` | Contact resume link |
| `contact_email` | Contact mailto |
| `contact_linkedin` | Contact LinkedIn |
| `contact_github` | Contact GitHub |
| `project_open` | ProjectCard primary `project.url` |
| `project_live` | ProjectCard `liveUrl` |

- [ ] **Step 1: Copy resume into public/**

```bash
mkdir -p public/downloads
cp downloads/CameronWarrenResumeDownload.pdf public/downloads/CameronWarrenResumeDownload.pdf
```

- [ ] **Step 2: Update Contact.tsx**

Add imports and click handlers:

```tsx
import { trackEvent } from '../analytics/track';

const RESUME_HREF = `${import.meta.env.BASE_URL}downloads/CameronWarrenResumeDownload.pdf`;
```

On each link:

```tsx
<a
  href={`mailto:${EMAIL}`}
  className="contact__btn"
  onClick={() => trackEvent('contact_email')}
>
```

```tsx
<a
  href={LINKEDIN}
  ...
  onClick={() => trackEvent('contact_linkedin')}
>
```

```tsx
<a
  href={GITHUB}
  ...
  onClick={() => trackEvent('contact_github')}
>
```

Add resume button before the note:

```tsx
<a
  href={RESUME_HREF}
  className="contact__btn"
  download
  onClick={() => trackEvent('resume_download')}
>
  Download resume
</a>
```

Keep existing layout/styles; reuse `contact__btn`.

- [ ] **Step 3: Update ProjectCard.tsx**

```tsx
import { trackEvent } from '../analytics/track';
```

On primary project link:

```tsx
onClick={() => trackEvent('project_open')}
```

On live demo link:

```tsx
onClick={(e) => {
  e.stopPropagation();
  trackEvent('project_live');
}}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
ls dist/downloads/CameronWarrenResumeDownload.pdf
```

Expected: file exists under `dist/downloads/`.

- [ ] **Step 5: Commit**

```bash
git add public/downloads/CameronWarrenResumeDownload.pdf src/components/Contact.tsx src/components/ProjectCard.tsx
git commit -m "$(cat <<'EOF'
feat: track contact, resume, and project click events

EOF
)"
```

---

### Task 6: Env example + GitHub Actions secrets wiring

**Files:**
- Create: `.env.example`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

- [ ] **Step 1: Create `.env.example`**

```env
# GoatCounter site code (subdomain), e.g. mysite for https://mysite.goatcounter.com
VITE_GOATCOUNTER_CODE=

# Microsoft Clarity project ID
VITE_CLARITY_ID=
```

Confirm `.gitignore` already ignores `.env` (it does).

- [ ] **Step 2: Update deploy workflow Build step**

In `.github/workflows/deploy-pages.yml`, pass secrets into the build environment:

```yaml
      - name: Build
        env:
          VITE_GOATCOUNTER_CODE: ${{ secrets.VITE_GOATCOUNTER_CODE }}
          VITE_CLARITY_ID: ${{ secrets.VITE_CLARITY_ID }}
        run: npm run build
```

- [ ] **Step 3: Update README.md**

Add an **Analytics** section after Build:

```markdown
## Analytics

Production builds load [GoatCounter](https://www.goatcounter.com/) and [Microsoft Clarity](https://clarity.microsoft.com/) when env vars are set. There is no on-page banner.

1. Create a GoatCounter site; note the site code (subdomain).
2. Create a Clarity project; copy the project ID.
3. Locally, copy `.env.example` → `.env` and fill values (dev does not send events unless you force a production build).
4. In the GitHub repo → Settings → Secrets and variables → Actions, add:
   - `VITE_GOATCOUNTER_CODE`
   - `VITE_CLARITY_ID`
5. Push to `main` (or re-run **Deploy to GitHub Pages**) so the production bundle embeds the IDs.

Private Tailscale hub: see `private-dashboard/README.md`.
```

- [ ] **Step 4: Commit**

```bash
git add .env.example .github/workflows/deploy-pages.yml README.md
git commit -m "$(cat <<'EOF'
chore: wire analytics env vars into Pages deploy

EOF
)"
```

- [ ] **Step 5: Owner action (manual, not code)**

Create GoatCounter + Clarity accounts, add GitHub Actions secrets. Do not commit real IDs.

---

### Task 7: Private Tailscale hub on this Mac

**Files:**
- Create: `private-dashboard/index.html`
- Create: `private-dashboard/serve.mjs`
- Create: `private-dashboard/README.md`
- Modify: `package.json` (optional script `dashboard`)

**Interfaces:**
- Produces: HTTP server on `127.0.0.1:8787` serving the hub HTML
- Exposure: Tailscale Serve → only Tailscale network

- [ ] **Step 1: Create hub HTML**

`private-dashboard/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Portfolio analytics (private)</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0d1117;
        --text: #e6edf3;
        --muted: #8b949e;
        --accent: #58a6ff;
        --border: #30363d;
      }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
      }
      main {
        max-width: 36rem;
        width: 100%;
      }
      h1 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
      }
      p {
        color: var(--muted);
        line-height: 1.5;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 1.5rem 0 0;
        display: grid;
        gap: 0.75rem;
      }
      a {
        display: block;
        padding: 0.875rem 1rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--accent);
        text-decoration: none;
      }
      a:hover {
        border-color: var(--accent);
      }
      .status {
        font-size: 0.875rem;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Portfolio analytics</h1>
      <p class="status">Private hub · Tailscale only · custom metrics UI later</p>
      <p>Public site tracking (GoatCounter + Clarity) runs on the GitHub Pages portfolio. Use the dashboards below for now.</p>
      <ul>
        <li>
          <a href="https://cwarre33.github.io/portfolio/" target="_blank" rel="noopener noreferrer"
            >Live portfolio</a
          >
        </li>
        <li>
          <a href="https://www.goatcounter.com/" target="_blank" rel="noopener noreferrer"
            >GoatCounter dashboard</a
          >
        </li>
        <li>
          <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener noreferrer"
            >Microsoft Clarity</a
          >
        </li>
      </ul>
    </main>
  </body>
</html>
```

- [ ] **Step 2: Create serve.mjs**

```js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);
const indexPath = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  if (req.url !== '/' && req.url !== '/index.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const html = fs.readFileSync(indexPath);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`Private analytics hub at http://${HOST}:${PORT}`);
  console.log('Expose with: tailscale serve --bg http://127.0.0.1:' + PORT);
});
```

- [ ] **Step 3: README for Tailscale**

`private-dashboard/README.md`:

```markdown
# Private analytics hub

Tailscale-only entry point for portfolio analytics. Not deployed to GitHub Pages.

## Run on this Mac

```bash
node private-dashboard/serve.mjs
```

Or from repo root (if script added): `npm run dashboard`

## Expose on Tailscale only

With the server listening on `127.0.0.1:8787`:

```bash
tailscale serve --bg http://127.0.0.1:8787
```

Open the MagicsDNS / Serve URL from any device on your tailnet. Do **not** use `tailscale funnel` (that is public).

## Keep running (continuous server)

Keep `node private-dashboard/serve.mjs` under your existing process supervisor (launchd, tmux, etc.) alongside Tailscale Serve so the hub stays up with this Mac.
```

- [ ] **Step 4: Add npm script**

In root `package.json`:

```json
"dashboard": "node private-dashboard/serve.mjs"
```

- [ ] **Step 5: Smoke test locally**

```bash
node private-dashboard/serve.mjs &
sleep 1
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8787/
kill %1
```

Expected: `200`.

- [ ] **Step 6: Commit**

```bash
git add private-dashboard package.json
git commit -m "$(cat <<'EOF'
feat: add Tailscale-only private analytics hub

EOF
)"
```

---

### Task 8: Final verification

**Files:** none new (verification only)

- [ ] **Step 1: Run unit tests**

```bash
npm test
```

Expected: all PASS.

- [ ] **Step 2: Production build without env (no-op analytics)**

```bash
npm run build
```

Expected: success. Confirm built JS does not hard-require analytics IDs.

- [ ] **Step 3: Production build with dummy env**

```bash
VITE_GOATCOUNTER_CODE=testsite VITE_CLARITY_ID=testid npm run build
```

Expected: success. Grep `dist/assets/*.js` for `gc.zgo.at` and `clarity.ms` (strings should appear).

- [ ] **Step 4: Confirm workflow still valid YAML**

```bash
# optional if actionlint installed; otherwise visual check of deploy-pages.yml
```

- [ ] **Step 5: Commit design + plan docs if not already committed**

```bash
git add docs/superpowers/specs/2026-07-20-visitor-analytics-design.md docs/superpowers/plans/2026-07-20-visitor-analytics.md
git commit -m "$(cat <<'EOF'
docs: add visitor analytics design and implementation plan

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| GoatCounter pageviews | Task 3 |
| Clarity heatmaps/replay | Task 3 |
| Custom events (resume, contact, projects, sections) | Tasks 4–5 |
| Prod-only / silent no-op | Tasks 1–3 |
| Env + GH Actions secrets | Task 6 |
| README setup | Task 6 |
| Private Tailscale hub on this Mac (v1 gate) | Task 7 |
| Not on GH Pages | Task 7 (separate folder; workflow unchanged path `dist`) |
| No banner / no GA4 | Global constraints |

## Execution handoff

After this plan is approved for execution, choose:

1. **Subagent-Driven (recommended)** — fresh subagent per task + review between tasks  
2. **Inline Execution** — execute in this session with executing-plans checkpoints
