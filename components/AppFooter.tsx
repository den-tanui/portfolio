'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AppFooterProps {
  onOpenHelp?: () => void
}

function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      )
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null
  return <span className="text-[11px] text-on-surface font-bold">{time}</span>
}

const PAGE_NAMES: Record<string, string> = {
  '/': 'HOME',
  '/blog': 'POSTS',
  '/projects': 'PROJECTS',
  '/about': 'ABOUT',
  '/search': 'SEARCH',
}

export default function AppFooter({ onOpenHelp }: AppFooterProps) {
  const pathname = usePathname()

  const currentPage = () => {
    const base = '/' + pathname.split('/').filter(Boolean)[0]
    return PAGE_NAMES[base] || PAGE_NAMES['/']
  }

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return '~'
    return '~/' + segments.join('/')
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-0 bg-surface-dim border-t border-outline-variant text-xs text-on-surface-muted overflow-hidden">
      {/* Left: directory path — tmux window-list style */}
      <div className="flex items-center h-full min-w-0">
        <span className="flex items-center gap-1.5 h-full px-2 bg-surface-container-highest text-on-surface text-[11px] font-extrabold tracking-wide shrink-0">
          <span className="text-tertiary">λ</span>
          {currentPage()}
        </span>
        <span className="truncate mx-2 text-[11px] text-on-surface-variant">
          {getBreadcrumb()}
        </span>
      </div>

      {/* Right: keyboard hints — tmux status-right style */}
      <div className="flex items-center h-full gap-0 shrink-0">
        <button
          onClick={onOpenHelp}
          className="flex items-center h-full px-2 hover:bg-surface-container-high hover:text-on-surface transition-colors text-[11px]"
          aria-label="Help (keyboard: ?)"
        >
          <span className="text-tertiary font-bold">?</span>
          <span className="ml-1 hidden sm:inline">help</span>
        </button>

        <div className="hidden md:flex items-center gap-0">
          <span className="w-px h-3 bg-outline-variant mx-1" />
          <kbd className="px-1.5 text-[11px] text-primary font-bold">0-3</kbd>
          <kbd className="px-1.5 text-[11px] text-cyan font-bold">/</kbd>
          <kbd className="px-1.5 text-[11px] text-secondary font-bold">Esc</kbd>
          <kbd className="px-1.5 text-[11px] text-teal font-bold">g G</kbd>
        </div>

        <span className="w-px h-3 bg-outline-variant mx-1" />
        <span className="h-full px-2 bg-surface-container-highest flex items-center min-w-[48px] justify-center">
          <Clock />
        </span>
      </div>
    </footer>
  )
}
