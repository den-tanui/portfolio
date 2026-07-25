'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Zoom = 75 | 100 | 125 | 150

interface SettingsContextValue {
  fontSize: number
  setFontSize: (size: number) => void
  zoom: Zoom
  setZoom: (zoom: Zoom) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 100)
  const [zoom, setZoom] = useLocalStorage<Zoom>('zoom', 100)

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, zoom, setZoom }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
