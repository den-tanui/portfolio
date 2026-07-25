'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { useToast, type ToastType } from '@/context/ToastContext'

const PREFIX: Record<ToastType, string> = {
  info: 'INFO',
  success: 'OK',
  error: 'ERR',
  warning: 'WARN',
}

const COLOR: Record<ToastType, string> = {
  info: 'text-primary',
  success: 'text-success',
  error: 'text-error',
  warning: 'text-tertiary',
}

function ToastItem({
  id,
  type,
  message,
  onRemove,
}: {
  id: string
  type: ToastType
  message: string
  onRemove: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)

  const handleRemove = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(id), 200)
  }, [id, onRemove])

  // Auto-dismiss with animation
  useEffect(() => {
    const timer = setTimeout(handleRemove, 3500)
    return () => clearTimeout(timer)
  }, [handleRemove])

  return (
    <div
      role="alert"
      className={`${exiting ? 'toast-exit' : 'toast-enter'} flex items-start gap-2 px-3 py-2 rounded border bg-surface-container text-xs font-mono shadow-lg max-w-sm pointer-events-auto`}
      style={{ borderColor: 'var(--color-outline)' }}
    >
      <button
        onClick={handleRemove}
        className="text-on-surface-muted hover:text-on-surface shrink-0 mt-0.5 leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
      <span className={COLOR[type]}>[{PREFIX[type]}]</span>
      <span className="text-on-surface">{message}</span>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}
