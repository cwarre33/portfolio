/**
 * Minimal GitHub contents client for the private ops cockpit.
 * The token is supplied by the user at runtime, kept in sessionStorage only,
 * and sent only to api.github.com. Nothing private is bundled into the site.
 */

export const OPS_REPO = 'cwarre33/cameron-wiki';
export const CAREER_ROOT = 'career';

const API = 'https://api.github.com';
const TOKEN_KEY = 'ops.gh.token';

export class OpsAuthError extends Error {}
export class OpsNotFoundError extends Error {}

export function loadToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Private mode / blocked storage: the token lives only in memory for this view.
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

async function request(token: string, path: string, accept: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
  });
  if (res.status === 401) throw new OpsAuthError('Token rejected by GitHub (expired or revoked).');
  if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
    throw new Error('GitHub API rate limit reached. Try again later.');
  }
  if (res.status === 404 || res.status === 403) throw new OpsNotFoundError(`Not found or no access: ${path}`);
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res;
}

/** Confirms the token can read the private repo. */
export async function verifyAccess(token: string): Promise<void> {
  try {
    await request(token, `/repos/${OPS_REPO}`, 'application/vnd.github+json');
  } catch (e) {
    if (e instanceof OpsNotFoundError) {
      throw new OpsAuthError(`This token can't read ${OPS_REPO}. It needs Contents: read on that repository.`);
    }
    throw e;
  }
}

export async function readFile(token: string, path: string): Promise<string> {
  const res = await request(token, `/repos/${OPS_REPO}/contents/${encodePath(path)}`, 'application/vnd.github.raw+json');
  return res.text();
}

export interface DirEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

export async function listDir(token: string, path: string): Promise<DirEntry[]> {
  const res = await request(token, `/repos/${OPS_REPO}/contents/${encodePath(path)}`, 'application/vnd.github+json');
  const body = (await res.json()) as DirEntry[] | DirEntry;
  return Array.isArray(body) ? body : [];
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}
