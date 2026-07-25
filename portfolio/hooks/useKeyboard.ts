'use client'

import { useEffect, useRef } from 'react'

export type Shortcut = {
  key: string
  /** If true, prevents default browser behavior */
  preventDefault?: boolean
  /** If true, ignores the event when focus is in an input/textarea */
  ignoreWhenEditing?: boolean
  handler: () => void
}

/**
 * Central keyboard shortcut manager.
 * Uses a ref to avoid re-registering on every render.
 */
export function useKeyboard(shortcuts: Shortcut[]) {
  const ref = useRef(shortcuts)
  ref.current = shortcuts

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const s of ref.current) {
        if (e.key !== s.key) continue
        if (s.ignoreWhenEditing !== false && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) continue
        if (s.preventDefault) e.preventDefault()
        s.handler()
        return
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
