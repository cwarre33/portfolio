import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CAREER_ROOT,
  OPS_REPO,
  OpsAuthError,
  OpsNotFoundError,
  clearToken,
  listDir,
  loadToken,
  readFile,
  saveToken,
  verifyAccess,
} from './github';
import {
  FUNNEL,
  daysSince,
  parseReport,
  parseTracker,
  reachedStage,
  type Application,
  type ReportSummary,
} from './parse';

const MAX_REPORTS = 60;
const FOLLOW_UP_DAYS = 7;

type Load =
  | { state: 'idle' | 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message: string }
  | { state: 'ready'; apps: Application[]; reports: ReportSummary[]; loadedAt: Date };

/** Keep private screens out of session recordings and analytics. */
function silenceAnalytics() {
  try {
    window.clarity?.('stop');
  } catch {
    // ignore
  }
}

function exitOps() {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  return (
    <form
      className="ops-login"
      onSubmit={async (e) => {
        e.preventDefault();
        const token = value.trim();
        if (!token) return;
        setBusy(true);
        setError(null);
        try {
          await verifyAccess(token);
          saveToken(token);
          setValue('');
          onToken(token);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Sign-in failed.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <span className="ops-login__mark mono" aria-hidden="true">
        ops
      </span>
      <h1>Restricted</h1>
      <p>
        Sign in with a GitHub token that can read <code>{OPS_REPO}</code>. It stays in this tab and is sent only to
        api.github.com.
      </p>
      <label className="ops-field">
        <span className="mono">github token</span>
        <input
          ref={inputRef}
          type="password"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github_pat_…"
          aria-describedby={error ? 'ops-login-error' : undefined}
        />
      </label>
      {error && (
        <p className="ops-error" id="ops-login-error" role="alert">
          {error}
        </p>
      )}
      <div className="ops-row">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Checking…' : 'Unlock'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={exitOps}>
          Back to site
        </button>
      </div>
    </form>
  );
}

function useCareerData(token: string | null, onAuthLost: () => void) {
  const [load, setLoad] = useState<Load>({ state: 'idle' });

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoad({ state: 'loading' });
    try {
      let trackerMd: string;
      try {
        trackerMd = await readFile(token, `${CAREER_ROOT}/data/applications.md`);
      } catch (e) {
        if (e instanceof OpsNotFoundError) {
          setLoad({ state: 'empty' });
          return;
        }
        throw e;
      }
      const apps = parseTracker(trackerMd);

      let reportFiles: string[] = [];
      try {
        reportFiles = (await listDir(token, `${CAREER_ROOT}/reports`))
          .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
          .map((f) => f.path)
          .sort()
          .reverse()
          .slice(0, MAX_REPORTS);
      } catch (e) {
        if (!(e instanceof OpsNotFoundError)) throw e;
      }
      const reports = (
        await Promise.all(
          reportFiles.map(async (p) => {
            try {
              return parseReport(p, await readFile(token, p));
            } catch {
              return null;
            }
          })
        )
      ).filter((r): r is ReportSummary => r !== null);

      setLoad({ state: 'ready', apps, reports, loadedAt: new Date() });
    } catch (e) {
      if (e instanceof OpsAuthError) {
        onAuthLost();
        return;
      }
      setLoad({ state: 'error', message: e instanceof Error ? e.message : 'Failed to load.' });
    }
  }, [token, onAuthLost]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { load, refresh };
}

function Cockpit({ apps, reports, loadedAt, onRefresh }: { apps: Application[]; reports: ReportSummary[]; loadedAt: Date; onRefresh: () => void }) {
  const [sort, setSort] = useState<'date' | 'score'>('date');

  const funnel = FUNNEL.map((f) => ({ ...f, n: apps.filter((a) => reachedStage(a, f.id)).length }));
  const scored = apps.filter((a) => a.score !== null);
  const avg = scored.length ? scored.reduce((s, a) => s + (a.score ?? 0), 0) / scored.length : null;

  const applyNext = apps
    .filter((a) => a.status === 'evaluated' && (a.score ?? 0) >= 4)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 8);

  const followUps = apps
    .map((a) => ({ a, days: daysSince(a.date) }))
    .filter(({ a, days }) => a.status === 'applied' && days !== null && days >= FOLLOW_UP_DAYS)
    .sort((x, y) => (y.days ?? 0) - (x.days ?? 0));

  const gaps = useMemo(() => {
    const m = new Map<string, { gap: string; n: number; high: number }>();
    for (const r of reports) {
      for (const g of r.gaps) {
        const key = g.gap.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        if (!key) continue;
        const e = m.get(key) ?? { gap: g.gap, n: 0, high: 0 };
        e.n++;
        if (/high|alta/i.test(g.severity)) e.high++;
        m.set(key, e);
      }
    }
    return [...m.values()].sort((a, b) => b.n - a.n || b.high - a.high).slice(0, 8);
  }, [reports]);

  const rows = [...apps].sort((a, b) =>
    sort === 'score' ? (b.score ?? -1) - (a.score ?? -1) : b.date.localeCompare(a.date)
  );
  const max = Math.max(1, funnel[0].n);

  return (
    <div className="ops-grid">
      <dl className="ops-kpis">
        {funnel.map((f) => (
          <div key={f.id}>
            <dt>{f.n}</dt>
            <dd>{f.label}</dd>
          </div>
        ))}
        <div>
          <dt>{avg === null ? '–' : avg.toFixed(1)}</dt>
          <dd>avg score / 5</dd>
        </div>
      </dl>

      <section className="ops-card ops-card--funnel" aria-labelledby="ops-funnel">
        <h2 id="ops-funnel">Funnel</h2>
        <ol className="ops-funnel">
          {funnel.map((f, i) => (
            <li key={f.id}>
              <span className="ops-funnel__label">{f.label}</span>
              <span className="ops-funnel__track">
                <span className="ops-funnel__bar" style={{ width: `${(f.n / max) * 100}%` }} />
              </span>
              <span className="mono">
                {f.n}
                {i > 0 && funnel[i - 1].n > 0 && <em> · {Math.round((f.n / funnel[i - 1].n) * 100)}%</em>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="ops-card" aria-labelledby="ops-next">
        <h2 id="ops-next">Apply next</h2>
        {applyNext.length === 0 ? (
          <p className="ops-muted">No evaluated roles scoring 4.0+ waiting on you.</p>
        ) : (
          <ul className="ops-list">
            {applyNext.map((a) => (
              <li key={a.num + a.company}>
                <span>
                  <strong>{a.company}</strong> {a.role}
                </span>
                <span className="ops-score mono">{a.score?.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ops-card" aria-labelledby="ops-follow">
        <h2 id="ops-follow">Follow-ups due</h2>
        {followUps.length === 0 ? (
          <p className="ops-muted">Nothing applied {FOLLOW_UP_DAYS}+ days ago without a response.</p>
        ) : (
          <ul className="ops-list">
            {followUps.map(({ a, days }) => (
              <li key={a.num + a.company}>
                <span>
                  <strong>{a.company}</strong> {a.role}
                </span>
                <span className="mono ops-muted">{days}d</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ops-card" aria-labelledby="ops-gaps">
        <h2 id="ops-gaps">Recurring gaps</h2>
        {gaps.length === 0 ? (
          <p className="ops-muted">No gap tables found in reports yet.</p>
        ) : (
          <ul className="ops-list">
            {gaps.map((g) => (
              <li key={g.gap}>
                <span>{g.gap}</span>
                <span className="mono ops-muted">
                  ×{g.n}
                  {g.high > 0 && <b className="ops-tag"> {g.high} high</b>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ops-card ops-card--table" aria-labelledby="ops-tracker">
        <div className="ops-card__head">
          <h2 id="ops-tracker">Tracker ({apps.length})</h2>
          <div className="ops-row">
            <button type="button" className={`ops-chip${sort === 'date' ? ' is-on' : ''}`} onClick={() => setSort('date')} aria-pressed={sort === 'date'}>
              newest
            </button>
            <button type="button" className={`ops-chip${sort === 'score' ? ' is-on' : ''}`} onClick={() => setSort('score')} aria-pressed={sort === 'score'}>
              score
            </button>
            <button type="button" className="ops-chip" onClick={onRefresh}>
              refresh
            </button>
          </div>
        </div>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Company</th>
                <th>Role</th>
                <th>Score</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.num + a.company + a.role}>
                  <td className="mono">{a.num}</td>
                  <td className="mono">{a.date}</td>
                  <td>{a.company}</td>
                  <td>{a.role}</td>
                  <td className="mono">{a.score?.toFixed(1) ?? '–'}</td>
                  <td>
                    <span className={`ops-status ops-status--${a.status}`}>{a.statusRaw || a.status}</span>
                  </td>
                  <td className="ops-notes">{a.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ops-muted mono">
          {reports.length} reports read · loaded {loadedAt.toLocaleTimeString()}
        </p>
      </section>
    </div>
  );
}

export default function OpsApp() {
  const [token, setToken] = useState<string | null>(() => loadToken());
  const lock = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);
  const { load, refresh } = useCareerData(token, lock);

  useEffect(() => {
    silenceAnalytics();
    const prevTitle = document.title;
    document.title = 'ops';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !(e.target instanceof HTMLInputElement)) exitOps();
    };
    window.addEventListener('keydown', onKey);
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      meta.remove();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="ops" data-clarity-mask="true">
      <header className="ops-bar">
        <span className="mono">
          <span className="live-dot" /> ops · {OPS_REPO}/{CAREER_ROOT}
        </span>
        <div className="ops-row">
          {token && (
            <button type="button" className="ops-chip" onClick={lock}>
              lock
            </button>
          )}
          <button type="button" className="ops-chip" onClick={exitOps}>
            exit
          </button>
        </div>
      </header>

      <main className="ops-main">
        {!token ? (
          <Login onToken={setToken} />
        ) : load.state === 'ready' ? (
          <Cockpit apps={load.apps} reports={load.reports} loadedAt={load.loadedAt} onRefresh={refresh} />
        ) : load.state === 'empty' ? (
          <div className="ops-empty">
            <h1>No tracker yet</h1>
            <p>
              Couldn't find <code>
                {CAREER_ROOT}/data/applications.md
              </code>{' '}
              in {OPS_REPO}. Run career-ops with <code>CAREER_OPS_ROOT={CAREER_ROOT}</code> and evaluate a posting, then refresh.
            </p>
            <button type="button" className="btn btn--ghost" onClick={refresh}>
              Refresh
            </button>
          </div>
        ) : load.state === 'error' ? (
          <div className="ops-empty">
            <h1>Couldn't load</h1>
            <p className="ops-error">{load.message}</p>
            <button type="button" className="btn btn--ghost" onClick={refresh}>
              Retry
            </button>
          </div>
        ) : (
          <p className="ops-muted mono ops-loading">loading {CAREER_ROOT}/…</p>
        )}
      </main>
    </div>
  );
}
