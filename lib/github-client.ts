/**
 * GitHub API client — works in both browser and server.
 *
 * - Browser (oauth mode): reads token from sessionStorage
 * - Server (cookie mode): gets token from caller via param
 */
const API = 'https://api.github.com'

export interface GitHubFile {
  path: string
  content: string
  sha?: string
  message: string
}

function getRepo(): string {
  return (
    process.env.NEXT_PUBLIC_CONTENT_REPO ||
    process.env.CONTENT_REPO ||
    'den-tanui/portfolio-content'
  )
}

/**
 * Get the GitHub token — caller must supply it.
 * In oauth mode, the browser calls this function with sessionStorage's token.
 * In cookie mode, the server action passes process.env.GITHUB_TOKEN.
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('github_token')
  }
  return null
}

export async function getFileMeta(
  path: string,
  token: string,
): Promise<{ sha: string } | null> {
  const res = await fetch(`${API}/repos/${getRepo()}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  return { sha: data.sha }
}

export async function upsertFile(
  file: GitHubFile,
  token: string,
): Promise<boolean> {
  const existing = await getFileMeta(file.path, token)
  const body: Record<string, unknown> = {
    message: file.message,
    content: btoa(file.content),
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

export async function deleteFileFromRepo(
  path: string,
  message: string,
  token: string,
): Promise<boolean> {
  const meta = await getFileMeta(path, token)
  if (!meta) return true
  const res = await fetch(`${API}/repos/${getRepo()}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sha: meta.sha, branch: 'main' }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }
  return true
}

export async function triggerDeploy(): Promise<void> {
  const hook = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK
  if (!hook) return
  await fetch(hook, { method: 'POST' }).catch(() => {})
}
