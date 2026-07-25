/**
 * Shared helpers for admin operations — used by both server actions
 * and client-side GitHub API calls.
 */

export function safeSlug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'untitled'
  )
}

export function buildFrontmatter(data: Record<string, unknown>): string {
  const lines = ['---']
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string') {
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`)
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`)
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`)
    } else if (Array.isArray(value)) {
      lines.push(
        `${key}: [${value.map((v) => (typeof v === 'string' ? `"${v}"` : v)).join(', ')}]`,
      )
    }
  }
  lines.push('---')
  return lines.join('\n')
}

/* ───────── Types ───────── */

export interface PostForm {
  title: string
  slug: string
  tags: string
  description: string
  image: string
  featured: boolean
  content: string
}

export interface ProjectForm {
  title: string
  slug: string
  tags: string
  languages: string
  description: string
  image: string
  stars: number
  featured: boolean
  content: string
}
