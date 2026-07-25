import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import matter from 'gray-matter'

export interface BlogPost {
  title: string
  slug: string
  date: string
  tags: string[]
  description: string
  image: string
  featured: boolean
  author?: string
  content: string
}

export interface Project {
  title: string
  slug: string
  tags: string[]
  languages: string[]
  description: string
  image: string
  stars: number
  featured: boolean
  author?: string
  repo_url?: string
  content: string
}

/* ───────── Helpers ───────── */

function readDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  } catch {
    return []
  }
}

/**
 * Get the earliest commit date for a file using git log.
 */
function getGitDate(filePath: string): string | null {
  try {
    const output = execSync(
      `git log --follow --diff-filter=A --format=%aI -- "${filePath}" 2>/dev/null | tail -1`,
      { encoding: 'utf-8', cwd: process.cwd() },
    ).trim()
    if (output) return output.split('T')[0]
    // Fallback: try latest commit
    const latest = execSync(
      `git log -1 --format=%aI -- "${filePath}" 2>/dev/null`,
      { encoding: 'utf-8', cwd: process.cwd() },
    ).trim()
    if (latest) return latest.split('T')[0]
    return null
  } catch {
    return null
  }
}

/**
 * Fetch README from a GitHub repo URL.
 */
async function fetchReadme(repoUrl: string): Promise<string | null> {
  try {
    // Convert https://github.com/user/repo to API URL
    const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\/|$)/)
    if (!match) return null
    const repo = match[1].replace(/\.git$/, '')

    const token = process.env.GITHUB_TOKEN
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.raw+json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    // Try README.md first, then README
    let res = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers,
    })
    if (res.ok) return await res.text()

    return null
  } catch {
    return null
  }
}

/* ───────── Content Fetchers ───────── */

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), 'content/blog')
  const files = readDir(dir)

  return files
    .map((file) => {
      const filePath = path.join(dir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      // Date: try frontmatter first, then git log
      let date: string
      if (data.date) {
        date = new Date(data.date).toISOString().split('T')[0]
      } else {
        date = getGitDate(filePath) || new Date().toISOString().split('T')[0]
      }

      return {
        title: data.title,
        slug: data.slug,
        date,
        tags: data.tags ?? [],
        description: data.description,
        image: data.image || '',
        featured: data.featured ?? false,
        author: data.author,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  return getBlogPosts().find((p) => p.slug === slug) ?? null
}

export function getProjects(): Project[] {
  const dir = path.join(process.cwd(), 'content/projects')
  const files = readDir(dir)

  return files
    .map((file) => {
      const filePath = path.join(dir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const repoUrl = data.repo_url

      return {
        title: data.title,
        slug: data.slug,
        tags: data.tags ?? [],
        languages: data.languages ?? [],
        description: data.description,
        image: data.image || '',
        stars: data.stars ?? 0,
        featured: data.featured ?? false,
        author: data.author,
        repo_url: repoUrl,
        content:
          content.trim() || data.body || '',  // empty body trigger
      }
    })
    .sort((a, b) => b.stars - a.stars)
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = getProjects()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  // If body is empty and repo_url exists, fetch README
  if (!project.content.trim() && project.repo_url) {
    const readme = await fetchReadme(project.repo_url)
    if (readme) {
      project.content = readme
    }
  }

  return project
}

export interface AboutData {
  content: string
}

export function getAbout(): AboutData {
  const filePath = path.join(process.cwd(), 'content/about.mdx')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return { content }
}
