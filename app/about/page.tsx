import { getAbout } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import CodeBlock from '@/components/CodeBlock'
import TerminalPrompt from '@/components/TerminalPrompt'

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

export default function AboutPage() {
  const about = getAbout()

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <TerminalPrompt path="~/about" />

        <div className="prose prose-sm max-w-none text-on-surface [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-sm [&_li]:mb-1">
          <MDXRemote source={about.content} components={components} />
        </div>
      </div>
    </div>
  )
}
