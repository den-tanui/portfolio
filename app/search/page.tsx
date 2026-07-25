import { getBlogPosts, getProjects } from '@/lib/content'
import { parseQuery, filterCards } from '@/lib/utils'
import SearchResults from './SearchResults'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const posts = getBlogPosts()
  const projects = getProjects()

  const parsed = parseQuery(q)
  const postCards = posts.map((p) => ({
    title: p.title,
    description: p.description,
    tags: p.tags,
    langs: [] as string[],
    slug: p.slug,
    image: p.image,
    type: 'post' as const,
    date: p.date,
  }))
  const projectCards = projects.map((p) => ({
    title: p.title,
    description: p.description,
    tags: p.tags,
    langs: p.languages,
    slug: p.slug,
    image: p.image,
    type: 'project' as const,
    stars: p.stars,
  }))

  const filteredPosts = q ? filterCards(postCards, parsed) : postCards
  const filteredProjects = q ? filterCards(projectCards, parsed) : projectCards

  // Re-map to include slug/image/type
  const visiblePosts = postCards.filter((c) =>
    filteredPosts.some((fc) => fc.title === c.title && fc.description === c.description)
  )
  const visibleProjects = projectCards.filter((c) =>
    filteredProjects.some((fc) => fc.title === c.title && fc.description === c.description)
  )

  return (
    <SearchResults
      query={q}
      posts={visiblePosts}
      projects={visibleProjects}
    />
  )
}
