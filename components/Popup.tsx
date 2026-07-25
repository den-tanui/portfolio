'use client'

import { useEffect, type ReactNode, type MouseEvent } from 'react'

interface PopupProps {
  /** Whether the popup is visible */
  isOpen: boolean
  /** Called when backdrop is clicked or Escape pressed */
  onClose: () => void
  /** Popup content */
  children: ReactNode
  /** Optional max-width class (default: max-w-md) */
  size?: string
  /** Optional accent color for the top border (default: none) */
  accent?: 'primary' | 'secondary' | 'tertiary' | 'none'
}

const ACCENT_BORDER: Record<string, string> = {
  primary: 'border-t-primary',
  secondary: 'border-t-secondary',
  tertiary: 'border-t-tertiary',
  none: '',
}

/**
 * Shared popup/modal wrapper.
 * Renders a fixed overlay with backdrop blur, handles Escape and backdrop-click to close,
 * and provides consistent animation classes.
 */
export default function Popup({ isOpen, onClose, children, size = 'max-w-md', accent = 'none' }: PopupProps) {
  // Register Escape key handler only when open
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const borderAccent = accent !== 'none' ? ACCENT_BORDER[accent] : ''

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm popup-fade-in"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-surface-container border border-outline rounded-lg shadow-xl ${size} mx-4 p-5 text-xs popup-scale-in ${borderAccent}`}
      >
        {children}
      </div>
    </div>
  )
}
