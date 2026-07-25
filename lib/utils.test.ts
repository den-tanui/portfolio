// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parseQuery, highlightText, filterCards } from './utils'

describe('parseQuery', () => {
  it('parses quoted terms', () => {
    const result = parseQuery('search "hello world" test')
    expect(result.terms).toContain('hello world')
    expect(result.terms).toContain('test')
  })

  it('parses tags', () => {
    const result = parseQuery('#cli #automation')
    expect(result.tags).toEqual(['cli', 'automation'])
    expect(result.terms).toEqual([])
  })

  it('parses languages', () => {
    const result = parseQuery('@typescript @python')
    expect(result.langs).toEqual(['typescript', 'python'])
  })

  it('parses mixed query', () => {
    const result = parseQuery('search "fzf scripts" #cli @bash')
    expect(result.terms).toContain('fzf scripts')
    expect(result.tags).toEqual(['cli'])
    expect(result.langs).toEqual(['bash'])
  })

  it('returns empty arrays for empty query', () => {
    const result = parseQuery('')
    expect(result.terms).toEqual([])
    expect(result.tags).toEqual([])
    expect(result.langs).toEqual([])
  })
})

describe('highlightText', () => {
  it('wraps matching terms in highlight span', () => {
    const result = highlightText('hello world', ['world'])
    expect(result).toBe('hello <span class="fzf-highlight">world</span>')
  })

  it('is case insensitive', () => {
    const result = highlightText('Hello World', ['world'])
    expect(result).toBe('Hello <span class="fzf-highlight">World</span>')
  })

  it('returns original text when no terms match', () => {
    const result = highlightText('hello world', ['foo'])
    expect(result).toBe('hello world')
  })

  it('returns original text when terms array is empty', () => {
    const result = highlightText('hello world', [])
    expect(result).toBe('hello world')
  })
})

describe('filterCards', () => {
  const cards = [
    {
      title: 'fzf scripts',
      description: 'Collection of fzf scripts',
      tags: ['cli', 'fzf'],
      langs: ['shell'],
    },
    { title: 'dotfiles', description: 'My dotfiles', tags: ['dotfiles'], langs: ['shell'] },
    {
      title: 'web app',
      description: 'A React web app',
      tags: ['react', 'web'],
      langs: ['typescript'],
    },
  ]

  it('filters by term', () => {
    const result = filterCards(cards, { terms: ['fzf'], tags: [], langs: [] })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('fzf scripts')
  })

  it('filters by tag', () => {
    const result = filterCards(cards, { terms: [], tags: ['cli'], langs: [] })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('fzf scripts')
  })

  it('filters by language', () => {
    const result = filterCards(cards, { terms: [], tags: [], langs: ['typescript'] })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('web app')
  })

  it('requires all categories to match (AND logic)', () => {
    const result = filterCards(cards, { terms: ['fzf'], tags: ['cli'], langs: ['typescript'] })
    expect(result).toHaveLength(0)
  })

  it('returns all cards when query is empty', () => {
    const result = filterCards(cards, { terms: [], tags: [], langs: [] })
    expect(result).toHaveLength(3)
  })
})
