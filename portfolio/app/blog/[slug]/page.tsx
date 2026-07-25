import { getBlogPosts, getBlogPost } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import CodeBlock from '@/components/CodeBlock'
import TerminalPrompt from '@/components/TerminalPrompt'
import Link from 'next/link'

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = getBlogPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-8">
      <TerminalPrompt path={`~/blogs/${post.slug}`} />

      <article>
        <header className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-on-surface leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-muted">
            <time>{post.date}</time>
            <span>·</span>
            <div className="flex gap-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-primary">#{tag}</span>
              ))}
            </div>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mt-4 w-full aspect-video object-cover rounded-lg border border-outline"
            />
          )}
        </header>

        <div className="prose prose-sm max-w-none text-on-surface [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-sm [&_li]:mb-1 [&_table]:text-sm [&_th]:text-left [&_th]:font-bold [&_th]:pr-4 [&_td]:pr-4 [&_td]:py-1">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-12 pt-6 border-t border-outline-variant">
          <h2 className="text-sm font-bold text-on-surface mb-4">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
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
