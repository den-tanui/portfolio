/**
 * GitHub API client — writes content to the portfolio-content repo.
 *
 * In cookie mode: uses GITHUB_TOKEN from env var (server-side).
 * In oauth mode: uses the token from sessionStorage (client-side).
 */

const API = 'https://api.github.com'

export interface GitHubFile {
  path: string
  content: string
  sha?: string
  message: string
}

function getRepo(): string {
  return process.env.CONTENT_REPO || 'dennis-tanui/portfolio-content'
}

function getToken(): string | null {
  const authMode = process.env.AUTH_MODE || 'cookie'
  if (authMode === 'cookie') {
    return process.env.GITHUB_TOKEN || null
  }
  return null
}

export async function getGitHubToken(): Promise<string | null> {
  // Server-side: return env var
  if (typeof window === 'undefined') {
    return process.env.GITHUB_TOKEN || null
  }
  // Client-side (oauth mode): return from sessionStorage
  return sessionStorage.getItem('github_token')
}

/**
 * Get file metadata (SHA needed for updates/deletes).
 */
export async function getFileMeta(path: string): Promise<{ sha: string } | null> {
  const token = await getGitHubToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API}/repos/${getRepo()}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  const data = await res.json()
  return { sha: data.sha }
}

/**
 * Create or update a file in the content repo.
 */
export async function upsertFile(file: GitHubFile): Promise<boolean> {
  const token = await getGitHubToken()
  if (!token) throw new Error('Not authenticated')

  const existing = await getFileMeta(file.path)
  const body: Record<string, unknown> = {
    message: file.message,
    content: Buffer.from(file.content).toString('base64'),
    branch: 'main',
  }
  if (existing) body.sha = existing.sha

  const res = await fetch(`${API}/repos/${getRepo()}/contents/${file.path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  return true
}

/**
 * Delete a file from the content repo.
 */
export async function deleteFile(path: string, message: string): Promise<boolean> {
  const token = await getGitHubToken()
  if (!token) throw new Error('Not authenticated')

  const meta = await getFileMeta(path)
  if (!meta) return true // already gone

  const res = await fetch(`${API}/repos/${getRepo()}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sha: meta.sha,
      branch: 'main',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  return true
}

/**
 * Read a file from the content repo (for README fallback).
 */
export async function readFile(path: string): Promise<string | null> {
  const token = await getGitHubToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API}/repos/${getRepo()}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

  if (res.status === 404) return null
  if (!res.ok) return null

  const data = await res.json()
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

/**
 * Trigger a deploy hook (Vercel / custom webhook).
 */
export async function triggerDeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) return // no hook configured — deploy manually
  await fetch(hook, { method: 'POST' }).catch(() => {
    // fire and forget — deploy hooks are best-effort
  })
}
