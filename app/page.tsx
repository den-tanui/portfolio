import { getBlogPosts } from '@/lib/content'
import { getProjects } from '@/lib/content'
import FilterableCard from '@/components/FilterableCard'
import TerminalPrompt from '@/components/TerminalPrompt'

export default function Home() {
  const featuredProjects = getProjects().filter((p) => p.featured).slice(0, 3)
  const recentPosts = getBlogPosts().filter((p) => p.featured).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center">
        <TerminalPrompt path="~" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
          Dennis-Tanui-V0.0.8
        </h1>
        <p className="text-sm sm:text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
          Tokyo Night terminal-themed portfolio — interactive search, keyboard-driven navigation,
          and dark/light theme toggling.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <a
            href="/projects"
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded hover:opacity-90 transition-opacity"
          >
            View Projects
          </a>
          <a
            href="/about"
            className="px-4 py-2 border border-outline text-on-surface-variant text-xs font-bold rounded hover:bg-surface-container-high transition-colors"
          >
            About Me
          </a>
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <h2 className="text-sm font-bold text-on-surface mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project, i) => (
            <FilterableCard
              key={project.slug}
              href={`/projects/${project.slug}`}
              title={project.title}
              description={project.description}
              tags={project.tags}
              langs={project.languages}
              image={project.image}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section>
        <h2 className="text-sm font-bold text-on-surface mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentPosts.map((post, i) => (
            <FilterableCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.description}
              tags={post.tags}
              langs={[]}
              image={post.image}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
