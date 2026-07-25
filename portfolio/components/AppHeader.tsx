'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SettingsDropdown from './SettingsDropdown'

interface AppHeaderProps {
  theme: string
  onToggleTheme: () => void
  onOpenHelp: () => void
  onOpenContact: () => void
  onOpenCv: () => void
  onOpenReport: () => void
  settingsOpen: boolean
  onToggleSettings: () => void
  onCloseSettings: () => void
}

const NAV_ITEMS = [
  { href: '/', label: 'HOME', key: '0' },
  { href: '/blog', label: 'POSTS', key: '1' },
  { href: '/projects', label: 'PROJECTS', key: '2' },
  { href: '/about', label: 'ABOUT', key: '3' },
]

export default function AppHeader({
  theme,
  onToggleTheme,
  onOpenHelp,
  onOpenContact,
  onOpenCv,
  onOpenReport,
  settingsOpen,
  onToggleSettings,
  onCloseSettings,
}: AppHeaderProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-10 z-50 flex items-center justify-between px-3 bg-surface-dim border-b border-outline-variant">
      <div className="flex items-center gap-0">
        <span className="flex items-center gap-1.5 h-full px-2 py-1 bg-surface-container-highest text-on-surface text-xs font-extrabold tracking-wide rounded mr-2 shrink-0">
          <span className="text-tertiary">λ</span>
          Dennis-Tanui-V0.0.8
        </span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-2 py-1 text-xs rounded-none transition-colors ${
              isActive(item.href)
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }
              max-md:text-[0px] max-md:px-1`}
            aria-label={item.label}
          >
            <span className="md:hidden">{item.key}</span>
            <span className="max-md:hidden">
              <span className="text-on-surface-muted">[</span>
              <span>{item.key}</span>
              <span className="text-on-surface-muted">:</span>
              {item.label}
              <span className="text-on-surface-muted">]</span>
            </span>
          </Link>
        ))}
      </div>
      <button
        onClick={onToggleSettings}
        className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
        aria-label="Settings"
      >
        <span className="material-symbols-outlined text-sm">settings</span>
      </button>

      <SettingsDropdown
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenHelp={onOpenHelp}
        onOpenContact={onOpenContact}
        onOpenCv={onOpenCv}
        onOpenReport={onOpenReport}
        isOpen={settingsOpen}
        onClose={onCloseSettings}
      />
    </header>
  )
}
