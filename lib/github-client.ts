/**
 * GitHub Contents API client — writes to the same portfolio repo.
 * Token is provided by the caller (extracted from session).
 */
const API = 'https://api.github.com'
const OWNER = 'den-tanui'
const REPO = 'portfolio-website'

export interface GitHubFile {
  path: string
  content: string
  sha?: string
  message: string
}

export async function getFileMeta(
  path: string,
  token: string,
): Promise<{ sha: string } | null> {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}`, {
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
    branch: 'master',
  }
  if (existing) body.sha = existing.sha

  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${file.path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )
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
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sha: meta.sha, branch: 'master' }),
    },
  )
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
