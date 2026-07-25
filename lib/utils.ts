export interface ParsedQuery {
  terms: string[]
  tags: string[]
  langs: string[]
}

export function parseQuery(query: string): ParsedQuery {
  const terms: string[] = []
  const tags: string[] = []
  const langs: string[] = []

  // Extract quoted strings as terms
  const quotedRegex = /"([^"]+)"/g
  let match
  while ((match = quotedRegex.exec(query)) !== null) {
    terms.push(match[1])
  }

  // Remove quoted strings from remaining
  const remaining = query.replace(quotedRegex, '').trim()

  if (remaining) {
    const parts = remaining.split(/\s+/)
    for (const part of parts) {
      if (part.startsWith('#')) {
        tags.push(part.slice(1))
      } else if (part.startsWith('@')) {
        langs.push(part.slice(1))
      } else {
        terms.push(part)
      }
    }
  }

  return { terms, tags, langs }
}

export function highlightText(text: string, terms: string[]): string {
  if (!terms.length) return text
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  return text.replace(regex, '<span class="fzf-highlight">$1</span>')
}

export interface CardData {
  title: string
  description: string
  tags: string[]
  langs: string[]
}

export function filterCards(cards: CardData[], query: ParsedQuery): CardData[] {
  return cards.filter((card) => {
    const textMatch =
      !query.terms.length ||
      query.terms.some(
        (t) =>
          card.title.toLowerCase().includes(t.toLowerCase()) ||
          card.description.toLowerCase().includes(t.toLowerCase()),
      )
    const tagMatch =
      !query.tags.length ||
      query.tags.some((t) => card.tags.map((ct) => ct.toLowerCase()).includes(t.toLowerCase()))
    const langMatch =
      !query.langs.length ||
      query.langs.some((l) => card.langs.map((cl) => cl.toLowerCase()).includes(l.toLowerCase()))
    return textMatch && tagMatch && langMatch
  })
}
