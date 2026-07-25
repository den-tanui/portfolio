'use client'

import FilterableCard from '@/components/FilterableCard'
import TerminalPrompt from '@/components/TerminalPrompt'
import SearchBar from '@/components/SearchBar'
import { useState } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'

interface SearchResultItem {
  title: string
  description: string
  tags: string[]
  langs: string[]
  slug: string
  image: string
  type: 'post' | 'project'
  date?: string
  stars?: number
}

export default function SearchResults({
  query: initialQuery,
  posts,
  projects,
}: {
  query: string
  posts: SearchResultItem[]
  projects: SearchResultItem[]
}) {
  const [query, setQuery] = useState(initialQuery)
  const [searchVisible, setSearchVisible] = useState(true)

  useKeyboard([
    { key: '/', preventDefault: true, handler: () => setSearchVisible((v) => !v) },
    { key: 'Escape', handler: () => { setSearchVisible(false); setQuery('') } },
  ])

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <TerminalPrompt path="~/search" />

        <SearchBar
          query={query}
          onChange={setQuery}
          resultCount={{ visible: posts.length + projects.length, total: posts.length + projects.length }}
          isVisible={searchVisible}
          onClose={() => { setSearchVisible(false); setQuery('') }}
        />

        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-3">
              Projects ({projects.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p, i) => (
                <FilterableCard
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  langs={p.langs}
                  image={p.image}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-3">
              Posts ({posts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((p, i) => (
                <FilterableCard
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  langs={[]}
                  image={p.image}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        {query && posts.length === 0 && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-muted text-sm">
              $ No results for &ldquo;{query}&rdquo;. Try a different query.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
