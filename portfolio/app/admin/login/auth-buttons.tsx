'use client'

import { useFormStatus } from 'react-dom'

export function AuthButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-3 py-1.5 text-xs font-bold rounded bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'signing in…' : 'sign in'}
    </button>
  )
}

export function OAuthButton({ provider }: { provider: 'github' | 'google' }) {
  const { pending } = useFormStatus()
  const labels = { github: 'GitHub', google: 'Google' }

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-3 py-1.5 text-xs font-bold rounded border border-outline text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors disabled:opacity-50"
    >
      {pending ? 'redirecting…' : `sign in with ${labels[provider]}`}
    </button>
  )
}
