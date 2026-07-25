'use client'

import { useSettings } from '@/context/SettingsContext'

interface SettingsDropdownProps {
  theme: string
  onToggleTheme: () => void
  onOpenHelp: () => void
  onOpenContact: () => void
  onOpenCv: () => void
  onOpenReport: () => void
  isOpen: boolean
  onClose: () => void
}

const ZOOM_LEVELS = [75, 100, 125, 150] as const

export default function SettingsDropdown({
  theme,
  onToggleTheme,
  onOpenHelp,
  onOpenContact,
  onOpenCv,
  onOpenReport,
  isOpen,
  onClose,
}: SettingsDropdownProps) {
  const { fontSize, setFontSize, zoom, setZoom } = useSettings()

  if (!isOpen) return null

  const openAndClose = (fn: () => void) => () => { fn(); onClose() }

  return (
    <>
      {/* Backdrop for click-outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-10 right-2 w-56 bg-surface-container border border-outline rounded shadow-lg z-50 p-2 text-xs">
        {/* Header */}
        <div className="text-on-surface-muted px-2 py-1 border-b border-outline-variant mb-1 flex items-center justify-between">
          <span>SETTINGS</span>
          <button onClick={onClose} className="text-on-surface-muted hover:text-on-surface leading-none" aria-label="Close settings">×</button>
        </div>

        {/* Theme */}
        <button
          onClick={onToggleTheme}
          className="w-full text-left px-2 py-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded transition-colors"
        >
          Theme: <span className="text-primary font-bold">{theme === 'dark' ? 'Night' : 'Moon'}</span>
        </button>

        {/* Font Size */}
        <div className="flex items-center justify-between px-2 py-1 text-on-surface-variant">
          <span>Font Size</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSize(Math.max(80, fontSize - 10))}
              className="px-1.5 py-0.5 rounded hover:bg-surface-container-high hover:text-on-surface transition-colors"
              aria-label="Decrease font size"
            >
              A−
            </button>
            <span className="w-8 text-center text-on-surface-muted text-xs">{fontSize}%</span>
            <button
              onClick={() => setFontSize(Math.min(120, fontSize + 10))}
              className="px-1.5 py-0.5 rounded hover:bg-surface-container-high hover:text-on-surface transition-colors"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center justify-between px-2 py-1 text-on-surface-variant">
          <span>Zoom</span>
          <div className="flex items-center gap-1">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setZoom(level)}
                className={`px-1.5 py-0.5 rounded hover:bg-surface-container-high hover:text-on-surface transition-colors ${
                  zoom === level ? 'text-on-surface font-bold' : 'text-on-surface-muted'
                }`}
                aria-label={`Zoom ${level}%`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-outline-variant mt-1 pt-1 space-y-0.5">
          <button
            onClick={openAndClose(onOpenContact)}
            className="w-full text-left px-2 py-1 text-primary hover:bg-surface-container-high rounded transition-colors"
          >
            Contact Me
          </button>
          <button
            onClick={openAndClose(onOpenCv)}
            className="w-full text-left px-2 py-1 text-secondary hover:bg-surface-container-high rounded transition-colors"
          >
            Download CV
          </button>
          <button
            onClick={openAndClose(onOpenHelp)}
            className="w-full text-left px-2 py-1 text-tertiary hover:bg-surface-container-high rounded transition-colors"
          >
            Help
          </button>
          <button
            onClick={openAndClose(onOpenReport)}
            className="w-full text-left px-2 py-1 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors"
          >
            Report Problem
          </button>
        </div>
      </div>
    </>
  )
}
