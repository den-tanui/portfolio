'use client'

import { useState, useMemo } from 'react'
import { parseQuery, filterCards, type CardData } from '@/lib/utils'
import FilterableCard from '@/components/FilterableCard'
import TerminalPrompt from '@/components/TerminalPrompt'
import SearchBar from '@/components/SearchBar'
import { useKeyboard } from '@/hooks/useKeyboard'
import type { Project } from '@/lib/content'

function toCardData(project: Project): CardData {
  return {
    title: project.title,
    description: project.description,
    tags: project.tags,
    langs: project.languages,
  }
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [searchVisible, setSearchVisible] = useState(false)
  const [query, setQuery] = useState('')

  useKeyboard([
    { key: '/', preventDefault: true, handler: () => setSearchVisible((v) => !v) },
    { key: 'Escape', handler: () => { setSearchVisible(false); setQuery('') } },
  ])

  const cards = useMemo(() => projects.map(toCardData), [projects])
  const parsed = useMemo(() => parseQuery(query), [query])
  const filteredCards = useMemo(() => filterCards(cards, parsed), [cards, parsed])

  const visibleProjects = useMemo(() => {
    return projects.filter((_, i) =>
      filteredCards.some((fc) => fc.title === cards[i].title && fc.description === cards[i].description)
    )
  }, [projects, filteredCards, cards])

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        <TerminalPrompt path="~/projects" />

        <SearchBar
          query={query}
          onChange={setQuery}
          resultCount={{ visible: visibleProjects.length, total: cards.length }}
          isVisible={searchVisible}
          onClose={() => { setSearchVisible(false); setQuery('') }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleProjects.map((project, i) => (
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

        {visibleProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-muted text-sm">
              $ No projects match your query. Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
