# Visitor analytics design

**Date:** 2026-07-20  
**Status:** Draft — pending user review  
**Site:** https://cwarre33.github.io/portfolio/ (static React + Vite on GitHub Pages)

## Goal

Track portfolio visitors with as much practical signal as possible (traffic + engagement), without any on-page consent banner, badge, or analytics UI. Visitors should not see tracking chrome; scripts may still appear in DevTools/network.

Separately, expose a **private** analytics entry point reachable only on the owner’s Tailscale network, hosted on this Mac (continuous server).

## Constraints

- Public site is static GitHub Pages — no server-side analytics on that host.
- No cookie/consent banner or visible analytics UI on the portfolio.
- Prefer free, low-maintenance tools that work with a static SPA.
- Private dashboard must not be served from GitHub Pages (public).
- Private surface v1 is a **gate only** — not a full custom metrics UI yet.

## Approach (chosen)

**Microsoft Clarity + GoatCounter** on the public portfolio, plus a **Tailscale-only shell** on this Mac.

| Piece | Role |
|--------|------|
| GoatCounter | Page views, uniques, referrers, paths, browser/OS, country (cookieless) |
| Microsoft Clarity | Heatmaps, session replay, clicks, scroll depth, rage clicks |
| `src/analytics/` | Load scripts in production; fire custom events |
| Private Mac app | Tailscale-gated hub page (links + status); expand later |

### Alternatives considered

1. **Clarity only** — simpler, weaker classic traffic reporting.
2. **GA4 + Clarity** — richest acquisition data, but cookie-heavy and normally implies a consent banner; rejected given no-UI preference.

## Public site architecture

```
Browser (visitor)
  → portfolio (GH Pages)
      → GoatCounter script (pageviews + goals)
      → Clarity script (behavior + recordings)
      → src/analytics/track.ts (custom events → both tools)
```

### Modules

- `src/analytics/config.ts` — site IDs from `import.meta.env`:
  - `VITE_GOATCOUNTER_CODE`
  - `VITE_CLARITY_ID`
- `src/analytics/init.ts` — inject both scripts once on app mount; **production only** (skip `localhost` / non-prod).
- `src/analytics/track.ts` — `trackEvent(name)`, `trackSection(id)`; no-op if IDs missing or scripts unavailable.

### Custom events

| Event | Trigger |
|--------|---------|
| Resume download | Resume/PDF download control |
| Contact clicks | Email / LinkedIn / GitHub (and any other Contact CTAs) |
| Project link clicks | Project card / external project links |
| Section reached | About, Experience, Projects, Contact (and other main sections) via Intersection Observer — once per section per page load |

Forward to GoatCounter goals (`count()`) and Clarity custom events/tags where supported.

### Failure behavior

Missing env IDs or failed script load must not break the site. Tracking silently no-ops.

### Deploy / secrets

- Local: `.env` (gitignored), with `.env.example` documenting keys.
- GitHub Actions deploy workflow: inject `VITE_*` from repository secrets at build time so production `dist/` embeds the IDs.
- README: short “Analytics setup” (create GoatCounter + Clarity accounts, add secrets, redeploy).

## Private Tailscale surface (v1)

### Purpose

A page that exists only for the owner, reachable on the Tailscale network, as a future home for a richer dashboard. v1 does **not** pull APIs or render charts.

### Hosting

- Run on **this Mac** (already used as a continuous server).
- Bind to Tailscale only (listen on Tailscale IP / localhost + **Tailscale Serve**), not the public internet.
- Not deployed with the GitHub Pages workflow.

### v1 content

- Title / short status (“Portfolio tracking live”).
- Links to GoatCounter and Clarity dashboards (owner login).
- Placeholder note that a custom metrics view can land here later.

### Layout in repo

- Sibling folder e.g. `private-dashboard/` (minimal static page + tiny local server or `tailscale serve` of static files).
- Document start command and MagicDNS / Serve URL in README (or `private-dashboard/README.md`).

### Out of scope for v1

- Custom charts, GoatCounter/Clarity API aggregation.
- Auth beyond Tailscale network access.
- Public visitor counter or any UI on the portfolio itself.
- GA4, self-hosted Umami/Plausible, cookie banners.

## Success criteria

1. Production portfolio loads GoatCounter + Clarity with no visible banner/badge.
2. Pageviews and listed custom events appear in GoatCounter; behavior/recordings appear in Clarity.
3. Local `npm run dev` does not send analytics.
4. Private hub is reachable from Tailscale devices on this Mac and not from the public web.
5. Site remains fully usable if analytics IDs are unset.

## Implementation order (high level)

1. Account setup (GoatCounter site, Clarity project) — owner action.
2. Public `src/analytics/` + wire events + env/secrets + deploy workflow.
3. `private-dashboard/` Tailscale-served shell on this Mac.
4. README / setup docs.
