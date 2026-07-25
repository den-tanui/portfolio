'use client'

import { useEffect, useRef } from 'react'

interface SearchBarProps {
  query: string
  onChange: (query: string) => void
  resultCount: { visible: number; total: number }
  isVisible: boolean
  onClose: () => void
}

export default function SearchBar({ query, onChange, resultCount, isVisible, onClose }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 bg-surface-dim border border-outline rounded px-3 py-2">
        <span className="text-tertiary font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder='search "term" #tag @language — try "fzf scripts" #cli @bash'
          className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-muted focus:outline-none text-sm"
        />
        <span className="text-on-surface-muted text-xs whitespace-nowrap">
          {resultCount.visible} of {resultCount.total} results
        </span>
      </div>
    </div>
  )
}
