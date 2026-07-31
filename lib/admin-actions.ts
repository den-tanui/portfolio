'use server'

import { auth } from './auth'
import { upsertFile, deleteFileFromRepo, triggerDeploy } from './github-client'
import { revalidatePath } from 'next/cache'

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

/* ───────── Helpers ───────── */

function safeSlug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'untitled'
  )
}

function buildFrontmatter(data: Record<string, unknown>): string {
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

/* ───────── Auth Guard ───────── */

async function requireAuth(): Promise<string> {
  const session = await auth()
  if (!session?.accessToken) {
    throw new Error('Unauthorized — you must be signed in to perform this action')
  }
  return session.accessToken
}

/* ───────── Blog Posts ───────── */

export async function createPost(data: PostForm) {
  const token = await requireAuth()
  const slug = safeSlug(data.slug || data.title)
  const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)

  const frontmatter = buildFrontmatter({
    title: data.title,
    slug,
    date: new Date().toISOString().split('T')[0],
    tags,
    description: data.description,
    image: data.image || '/images/blog/placeholder.jpg',
    featured: data.featured,
    author: 'den-tanui',
  })

  const mdx = `${frontmatter}\n\n${data.content || ''}`

  await upsertFile(
    {
      path: `content/blog/${slug}.md`,
      content: mdx,
      message: `Add post: ${data.title}`,
    },
    token,
  )

  await triggerDeploy()
  revalidatePath('/blog')
  revalidatePath('/admin')
  return { ok: true, slug }
}

export async function updatePost(oldSlug: string, data: PostForm) {
  const token = await requireAuth()
  const slug = safeSlug(data.slug || data.title)
  const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)

  const frontmatter = buildFrontmatter({
    title: data.title,
    slug,
    date: new Date().toISOString().split('T')[0],
    tags,
    description: data.description,
    image: data.image || '/images/blog/placeholder.jpg',
    featured: data.featured,
    author: 'den-tanui',
  })

  const mdx = `${frontmatter}\n\n${data.content || ''}`

  if (oldSlug !== slug) {
    await deleteFileFromRepo(
      `content/blog/${oldSlug}.md`,
      `Remove: ${oldSlug} (renamed to ${slug})`,
      token,
    )
  }

  await upsertFile(
    {
      path: `content/blog/${slug}.md`,
      content: mdx,
      message: `Update post: ${data.title}`,
    },
    token,
  )

  await triggerDeploy()
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin')
  return { ok: true, slug }
}

export async function deletePost(slug: string) {
  const token = await requireAuth()
  await deleteFileFromRepo(
    `content/blog/${slug}.md`,
    `Delete post: ${slug}`,
    token,
  )
  await triggerDeploy()
  revalidatePath('/blog')
  revalidatePath('/admin')
  return { ok: true }
}

/* ───────── Projects ───────── */

export async function createProject(data: ProjectForm) {
  const token = await requireAuth()
  const slug = safeSlug(data.slug || data.title)
  const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)
  const languages = data.languages.split(',').map((l) => l.trim()).filter(Boolean)

  const frontmatter = buildFrontmatter({
    title: data.title,
    slug,
    tags,
    languages,
    description: data.description,
    image: data.image || '/images/projects/placeholder.jpg',
    stars: data.stars || 0,
    featured: data.featured,
    author: 'den-tanui',
  })

  const mdx = `${frontmatter}\n\n${data.content || ''}`

  await upsertFile(
    {
      path: `content/projects/${slug}.md`,
      content: mdx,
      message: `Add project: ${data.title}`,
    },
    token,
  )

  await triggerDeploy()
  revalidatePath('/projects')
  revalidatePath('/admin')
  return { ok: true, slug }
}

export async function updateProject(oldSlug: string, data: ProjectForm) {
  const token = await requireAuth()
  const slug = safeSlug(data.slug || data.title)
  const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)
  const languages = data.languages.split(',').map((l) => l.trim()).filter(Boolean)

  const frontmatter = buildFrontmatter({
    title: data.title,
    slug,
    tags,
    languages,
    description: data.description,
    image: data.image || '/images/projects/placeholder.jpg',
    stars: data.stars || 0,
    featured: data.featured,
    author: 'den-tanui',
  })

  const mdx = `${frontmatter}\n\n${data.content || ''}`

  if (oldSlug !== slug) {
    await deleteFileFromRepo(
      `content/projects/${oldSlug}.md`,
      `Remove: ${oldSlug} (renamed to ${slug})`,
      token,
    )
  }

  await upsertFile(
    {
      path: `content/projects/${slug}.md`,
      content: mdx,
      message: `Update project: ${data.title}`,
    },
    token,
  )

  await triggerDeploy()
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)
  revalidatePath('/admin')
  return { ok: true, slug }
}

export async function deleteProject(slug: string) {
  const token = await requireAuth()
  await deleteFileFromRepo(
    `content/projects/${slug}.md`,
    `Delete project: ${slug}`,
    token,
  )
  await triggerDeploy()
  revalidatePath('/projects')
  revalidatePath('/admin')
  return { ok: true }
}
