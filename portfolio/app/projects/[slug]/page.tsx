import { getProjects, getProject } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import CodeBlock from '@/components/CodeBlock'
import TagPill from '@/components/TagPill'
import LangPill from '@/components/LangPill'
import TerminalPrompt from '@/components/TerminalPrompt'
import Link from 'next/link'

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

const components = {
  pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const language = className?.replace('language-', '') ?? ''
    if (language) {
      return <CodeBlock language={language} code={String(children)} />
    }
    return (
      <code className="bg-surface-dim text-primary px-1 py-0.5 rounded text-xs">
        {children}
      </code>
    )
  },
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const related = getProjects()
    .filter((p) => p.slug !== slug && p.tags.some((t) => project.tags.includes(t)))
    .slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-8">
      <TerminalPrompt path={`~/projects/${project.slug}`} />

      <article>
        <header className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-on-surface leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-muted">
            <span className="text-yellow">★ {project.stars}</span>
          </div>
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="mt-4 w-full aspect-video object-cover rounded-lg border border-outline"
            />
          )}
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
            {project.languages.map((lang) => (
              <LangPill key={lang} lang={lang} />
            ))}
          </div>
        </header>

        <div className="prose prose-sm max-w-none text-on-surface [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-sm [&_li]:mb-1 [&_li]:leading-relaxed">
          <MDXRemote source={project.content} components={components} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-12 pt-6 border-t border-outline-variant">
          <h2 className="text-sm font-bold text-on-surface mb-4">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/projects/${rel.slug}`}
                className="block p-3 border border-outline rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="text-sm font-bold text-on-surface">{rel.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  {rel.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
