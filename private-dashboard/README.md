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

Open the MagicDNS / Serve URL from any device on your tailnet. Do **not** use `tailscale funnel` (that is public).

## Keep running (continuous server)

Keep `node private-dashboard/serve.mjs` under your existing process supervisor (launchd, tmux, etc.) alongside Tailscale Serve so the hub stays up with this Mac.
