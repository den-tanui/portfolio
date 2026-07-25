'use client'

import { useState, useMemo } from 'react'
import { parseQuery, filterCards, type CardData } from '@/lib/utils'
import FilterableCard from '@/components/FilterableCard'
import TerminalPrompt from '@/components/TerminalPrompt'
import SearchBar from '@/components/SearchBar'
import { useKeyboard } from '@/hooks/useKeyboard'
import type { BlogPost } from '@/lib/content'

function toCardData(post: BlogPost): CardData {
  return {
    title: post.title,
    description: post.description,
    tags: post.tags,
    langs: [],
  }
}

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [searchVisible, setSearchVisible] = useState(false)
  const [query, setQuery] = useState('')

  useKeyboard([
    { key: '/', preventDefault: true, handler: () => setSearchVisible((v) => !v) },
    { key: 'Escape', handler: () => { setSearchVisible(false); setQuery('') } },
  ])

  const cards = useMemo(() => posts.map(toCardData), [posts])
  const parsed = useMemo(() => parseQuery(query), [query])
  const filteredCards = useMemo(() => filterCards(cards, parsed), [cards, parsed])

  // Map filtered cards back to original posts
  const visiblePosts = useMemo(() => {
    return posts.filter((_, i) =>
      filteredCards.some((fc) => fc.title === cards[i].title && fc.description === cards[i].description)
    )
  }, [posts, filteredCards, cards])

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <TerminalPrompt path="~/blogs" />

        <SearchBar
          query={query}
          onChange={setQuery}
          resultCount={{ visible: visiblePosts.length, total: cards.length }}
          isVisible={searchVisible}
          onClose={() => { setSearchVisible(false); setQuery('') }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePosts.map((post, i) => (
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

        {visiblePosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-muted text-sm">
              $ No posts match your query. Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
