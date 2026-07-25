'use client'

import { useState, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import type { BlogPost, Project } from '@/lib/content'
import * as serverActions from '@/lib/admin-actions'
import {
  upsertFile,
  deleteFileFromRepo,
  triggerDeploy,
  getToken,
} from '@/lib/github-client'
import { buildFrontmatter, safeSlug, type PostForm, type ProjectForm } from '@/lib/admin-shared'
import TerminalPrompt from '@/components/TerminalPrompt'
import Popup from '@/components/Popup'

/* ───────── types ───────── */

type Tab = 'posts' | 'projects'

interface EditablePost {
  title: string
  slug: string
  tags: string
  description: string
  image: string
  featured: boolean
  content: string
}

interface EditableProject {
  title: string
  slug: string
  tags: string
  languages: string
  description: string
  image: string
  stars: number
  featured: boolean
  content: string
  repo_url?: string
}

const EMPTY_POST: EditablePost = {
  title: '',
  slug: '',
  tags: '',
  description: '',
  image: '',
  featured: false,
  content: '',
}

const EMPTY_PROJECT: EditableProject = {
  title: '',
  slug: '',
  tags: '',
  languages: '',
  description: '',
  image: '',
  stars: 0,
  featured: false,
  content: '',
}

/* ───────── form components ───────── */

function PostForm({
  data,
  onChange,
}: {
  data: EditablePost
  onChange: (d: EditablePost) => void
}) {
  const set = <K extends keyof EditablePost>(k: K, v: EditablePost[K]) =>
    onChange({ ...data, [k]: v })

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">title</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.title}
          onChange={(e) => {
            set('title', e.target.value)
            if (!data.slug || data.slug === slugify(data.title)) {
              set('slug', slugify(e.target.value))
            }
          }}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-on-surface-muted text-[11px]">slug</span>
          <input
            className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            value={data.slug}
            onChange={(e) => set('slug', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-on-surface-muted text-[11px]">tags (comma-separated)</span>
          <input
            className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            value={data.tags}
            onChange={(e) => set('tags', e.target.value)}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">description</span>
        <textarea
          rows={2}
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">image path</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.image}
          onChange={(e) => set('image', e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="accent-primary"
          checked={data.featured}
          onChange={(e) => set('featured', e.target.checked)}
        />
        <span className="text-xs text-on-surface-variant">featured</span>
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">content (MDX body)</span>
        <textarea
          rows={10}
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary font-mono resize-y leading-relaxed"
          value={data.content}
          onChange={(e) => set('content', e.target.value)}
        />
      </label>
    </div>
  )
}

function ProjectForm({
  data,
  onChange,
}: {
  data: EditableProject
  onChange: (d: EditableProject) => void
}) {
  const set = <K extends keyof EditableProject>(k: K, v: EditableProject[K]) =>
    onChange({ ...data, [k]: v })

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">title</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.title}
          onChange={(e) => {
            set('title', e.target.value)
            if (!data.slug || data.slug === slugify(data.title)) {
              set('slug', slugify(e.target.value))
            }
          }}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-on-surface-muted text-[11px]">slug</span>
          <input
            className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            value={data.slug}
            onChange={(e) => set('slug', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-on-surface-muted text-[11px]">stars</span>
          <input
            type="number"
            className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            value={data.stars}
            onChange={(e) => set('stars', Number(e.target.value))}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">tags (comma-separated)</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.tags}
          onChange={(e) => set('tags', e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">languages (comma-separated)</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.languages}
          onChange={(e) => set('languages', e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">description</span>
        <textarea
          rows={2}
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">image path</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.image}
          onChange={(e) => set('image', e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">repo_url</span>
        <input
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          value={data.repo_url || ''}
          onChange={(e) => set('repo_url', e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="accent-primary"
          checked={data.featured}
          onChange={(e) => set('featured', e.target.checked)}
        />
        <span className="text-xs text-on-surface-variant">featured</span>
      </label>
      <label className="block">
        <span className="text-on-surface-muted text-[11px]">content (MDX body)</span>
        <textarea
          rows={10}
          className="w-full mt-0.5 px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary font-mono resize-y leading-relaxed"
          value={data.content}
          onChange={(e) => set('content', e.target.value)}
        />
      </label>
    </div>
  )
}

/* ───────── slug helper ───────── */

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ───────── status banner ───────── */

function StatusBanner({ msg, type }: { msg: string | null; type: 'ok' | 'error' }) {
  if (!msg) return null
  return (
    <div
      className={`px-3 py-2 rounded text-xs font-bold mb-4 ${
        type === 'ok'
          ? 'bg-success/10 text-success border border-success/30'
          : 'bg-error/10 text-error border border-error/30'
      }`}
    >
      {type === 'ok' ? '✓' : '✗'} {msg}
    </div>
  )
}

/* ───────── Confirm Dialog ───────── */

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Popup isOpen onClose={onCancel} size="max-w-xs">
      <p className="text-on-surface text-xs mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded border border-outline text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 text-xs rounded bg-error text-on-primary font-bold hover:opacity-90 transition-opacity"
        >
          delete
        </button>
      </div>
    </Popup>
  )
}

/* ───────── Main Admin Client ───────── */

export default function AdminClient({
  posts: initialPosts,
  projects: initialProjects,
  authMode,
}: {
  posts: BlogPost[]
  projects: Project[]
  authMode: string
}) {
  const [tab, setTab] = useState<Tab>('posts')
  const [posts, setPosts] = useState(initialPosts)
  const [projects, setProjects] = useState(initialProjects)
  const [status, setStatus] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null)

  // Form popup state
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  // Post form state
  const [postForm, setPostForm] = useState<EditablePost>(EMPTY_POST)

  // Project form state
  const [projectForm, setProjectForm] = useState<EditableProject & { repo_url?: string }>({
    ...EMPTY_PROJECT,
    repo_url: '',
  })

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'post' | 'project'
    slug: string
    title: string
  } | null>(null)

  /* ───── helpers ───── */

  const showStatus = useCallback((msg: string, type: 'ok' | 'error') => {
    setStatus({ msg, type })
    setTimeout(() => setStatus(null), 4000)
  }, [])

  const isOauth = authMode === 'oauth'

  const refresh = useCallback(() => {
    window.location.reload()
  }, [])

  /* ───── GitHub client helper (oauth mode) ───── */

  const oauthPost = async (data: PostForm, oldSlug?: string) => {
    const token = getToken()
    if (!token) throw new Error('Not authenticated. Please re-login.')

    const slug = safeSlug(data.slug || data.title)
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)

    const frontmatter = buildFrontmatter({
      title: data.title,
      slug,
      tags,
      description: data.description,
      image: data.image || '/images/blog/placeholder.jpg',
      featured: data.featured,
      author: 'den-tanui',
    })

    const mdx = `${frontmatter}\n\n${data.content || ''}`

    if (oldSlug && oldSlug !== slug) {
      await deleteFileFromRepo(`content/blog/${oldSlug}.md`, `Remove: ${oldSlug}`, token)
    }

    await upsertFile(
      { path: `content/blog/${slug}.md`, content: mdx, message: `Update post: ${data.title}` },
      token,
    )
    await triggerDeploy()
  }

  const oauthProject = async (data: ProjectForm & { repo_url?: string }, oldSlug?: string) => {
    const token = getToken()
    if (!token) throw new Error('Not authenticated. Please re-login.')

    const slug = safeSlug(data.slug || data.title)
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const languages = data.languages.split(',').map((l) => l.trim()).filter(Boolean)

    const frontmatterData: Record<string, unknown> = {
      title: data.title,
      slug,
      tags,
      languages,
      description: data.description,
      image: data.image || '/images/projects/placeholder.jpg',
      stars: data.stars || 0,
      featured: data.featured,
      author: 'den-tanui',
    }
    if (data.repo_url) frontmatterData.repo_url = data.repo_url

    const frontmatter = buildFrontmatter(frontmatterData)
    const mdx = `${frontmatter}\n\n${data.content || ''}`

    if (oldSlug && oldSlug !== slug) {
      await deleteFileFromRepo(`content/projects/${oldSlug}.md`, `Remove: ${oldSlug}`, token)
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
  }

  /* ───── post handlers ───── */

  const openNewPost = () => {
    setPostForm(EMPTY_POST)
    setFormMode('create')
    setEditingSlug(null)
    setFormOpen(true)
  }

  const openEditPost = (p: BlogPost) => {
    setPostForm({
      title: p.title,
      slug: p.slug,
      tags: p.tags.join(', '),
      description: p.description,
      image: p.image,
      featured: p.featured,
      content: p.content,
    })
    setFormMode('edit')
    setEditingSlug(p.slug)
    setFormOpen(true)
  }

  const savePost = async () => {
    if (!postForm.title.trim()) {
      showStatus('Title is required', 'error')
      return
    }
    try {
      if (isOauth) {
        await oauthPost(postForm, formMode === 'edit' ? editingSlug! : undefined)
      } else {
        if (formMode === 'create') {
          await serverActions.createPost(postForm)
        } else {
          await serverActions.updatePost(editingSlug!, postForm)
        }
      }
      showStatus(`Post "${postForm.title}" ${formMode === 'create' ? 'created' : 'updated'}`, 'ok')
      setFormOpen(false)
      refresh()
    } catch (e) {
      showStatus(`Failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error')
    }
  }

  const confirmDeletePost = async () => {
    if (!deleteTarget) return
    try {
      if (isOauth) {
        const token = getToken()
        if (!token) throw new Error('Not authenticated')
        await deleteFileFromRepo(
          `content/blog/${deleteTarget.slug}.md`,
          `Delete post: ${deleteTarget.slug}`,
          token,
        )
        await triggerDeploy()
      } else {
        await serverActions.deletePost(deleteTarget.slug)
      }
      setDeleteTarget(null)
      showStatus('Post deleted', 'ok')
      refresh()
    } catch (e) {
      showStatus(`Failed to delete: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error')
    }
  }

  /* ───── project handlers ───── */

  const openNewProject = () => {
    setProjectForm({ ...EMPTY_PROJECT, repo_url: '' })
    setFormMode('create')
    setEditingSlug(null)
    setFormOpen(true)
  }

  const openEditProject = (p: Project) => {
    setProjectForm({
      title: p.title,
      slug: p.slug,
      tags: p.tags.join(', '),
      languages: p.languages.join(', '),
      description: p.description,
      image: p.image,
      stars: p.stars,
      featured: p.featured,
      content: p.content,
      repo_url: (p as Project & { repo_url?: string }).repo_url || '',
    })
    setFormMode('edit')
    setEditingSlug(p.slug)
    setFormOpen(true)
  }

  const saveProject = async () => {
    if (!projectForm.title.trim()) {
      showStatus('Title is required', 'error')
      return
    }
    try {
      if (isOauth) {
        await oauthProject(projectForm, formMode === 'edit' ? editingSlug! : undefined)
      } else {
        if (formMode === 'create') {
          await serverActions.createProject(projectForm)
        } else {
          await serverActions.updateProject(editingSlug!, projectForm)
        }
      }
      showStatus(
        `Project "${projectForm.title}" ${formMode === 'create' ? 'created' : 'updated'}`,
        'ok',
      )
      setFormOpen(false)
      refresh()
    } catch (e) {
      showStatus(`Failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error')
    }
  }

  const confirmDeleteProject = async () => {
    if (!deleteTarget) return
    try {
      if (isOauth) {
        const token = getToken()
        if (!token) throw new Error('Not authenticated')
        await deleteFileFromRepo(
          `content/projects/${deleteTarget.slug}.md`,
          `Delete project: ${deleteTarget.slug}`,
          token,
        )
        await triggerDeploy()
      } else {
        await serverActions.deleteProject(deleteTarget.slug)
      }
      setDeleteTarget(null)
      showStatus('Project deleted', 'ok')
      refresh()
    } catch (e) {
      showStatus(`Failed to delete: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error')
    }
  }

  /* ───── tab count ───── */

  const tabCount: Record<Tab, number> = {
    posts: posts.length,
    projects: projects.length,
  }

  /* ───── render ───── */

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <TerminalPrompt path="~/admin" />

        <StatusBanner msg={status?.msg ?? null} type={status?.type ?? 'ok'} />

        {/* ── Tabs ── */}
        <div className="flex items-center border-b border-outline-variant mb-6">
          {(['posts', 'projects'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-muted hover:text-on-surface hover:border-outline'
              }`}
            >
              <span className="text-on-surface-muted mr-1">$</span>
              {t.toUpperCase()}
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px]">
                {tabCount[t]}
              </span>
            </button>
          ))}
          <div className="flex-1" />
          {/* Logout — cookie mode only */}
          {!isOauth && (
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-2 py-1 text-[10px] text-on-surface-muted hover:text-error transition-colors"
            >
              logout
            </button>
          )}
          {isOauth && (
            <button
              onClick={() => {
                sessionStorage.removeItem('github_token')
                sessionStorage.removeItem('github_token_expires')
                window.location.href = '/admin/login'
              }}
              className="px-2 py-1 text-[10px] text-on-surface-muted hover:text-error transition-colors"
            >
              logout
            </button>
          )}
        </div>

        {/* ── Posts Listing ── */}
        {tab === 'posts' && (
          <div>
            <div className="space-y-1">
              {posts.map((p) => (
                <div
                  key={p.slug}
                  className="flex items-center justify-between px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">{p.title}</span>
                      {p.featured && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-tertiary/10 text-tertiary font-bold shrink-0">
                          featured
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-muted">{p.date}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEditPost(p)}
                      className="px-2 py-1 text-[11px] rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'post', slug: p.slug, title: p.title })}
                      className="px-2 py-1 text-[11px] rounded text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-on-surface-muted text-xs py-8 text-center">no posts yet</p>
              )}
            </div>
            <button
              onClick={openNewPost}
              className="mt-4 px-3 py-1.5 text-xs rounded bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
            >
              + new post
            </button>
          </div>
        )}

        {/* ── Projects Listing ── */}
        {tab === 'projects' && (
          <div>
            <div className="space-y-1">
              {projects.map((p) => (
                <div
                  key={p.slug}
                  className="flex items-center justify-between px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">{p.title}</span>
                      {p.featured && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-tertiary/10 text-tertiary font-bold shrink-0">
                          featured
                        </span>
                      )}
                      <span className="text-[11px] text-tertiary shrink-0">★ {p.stars}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-muted">
                      {p.tags.slice(0, 3).join(', ')}
                      {p.tags.length > 3 ? '…' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEditProject(p)}
                      className="px-2 py-1 text-[11px] rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
                    >
                      edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({ type: 'project', slug: p.slug, title: p.title })
                      }
                      className="px-2 py-1 text-[11px] rounded text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-on-surface-muted text-xs py-8 text-center">no projects yet</p>
              )}
            </div>
            <button
              onClick={openNewProject}
              className="mt-4 px-3 py-1.5 text-xs rounded bg-primary text-on-primary font-bold hover:opacity-90 transition-colors"
            >
              + new project
            </button>
          </div>
        )}
      </div>

      {/* ── Create/Edit Popup ── */}
      <Popup isOpen={formOpen} onClose={() => setFormOpen(false)} size="max-w-lg" accent="primary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-on-surface">
            {formMode === 'create' ? 'CREATE' : 'EDIT'} {tab === 'posts' ? 'POST' : 'PROJECT'}
          </h2>
          <button
            onClick={() => setFormOpen(false)}
            className="text-on-surface-muted hover:text-on-surface transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {tab === 'posts' ? (
          <PostForm data={postForm} onChange={setPostForm} />
        ) : (
          <ProjectForm
            data={projectForm as EditableProject}
            onChange={(d) => setProjectForm({ ...d, repo_url: (d as EditableProject & { repo_url?: string }).repo_url || '' })}
          />
        )}

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-outline-variant">
          <button
            onClick={() => setFormOpen(false)}
            className="px-3 py-1.5 text-xs rounded border border-outline text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            cancel
          </button>
          <button
            onClick={tab === 'posts' ? savePost : saveProject}
            className="px-3 py-1.5 text-xs rounded bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
          >
            {formMode === 'create' ? 'create' : 'save'}
          </button>
        </div>
      </Popup>

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={deleteTarget.type === 'post' ? confirmDeletePost : confirmDeleteProject}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
