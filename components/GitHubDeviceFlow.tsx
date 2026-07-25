'use client'

import { useState } from 'react'

type Step = 'idle' | 'code' | 'done' | 'error'

export default function GitHubDeviceFlow() {
  const [step, setStep] = useState<Step>('idle')
  const [userCode, setUserCode] = useState('')
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(false)

  const startAuth = async () => {
    setStep('idle')
    setError('')
    setPolling(true)

    try {
      const res = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          scope: 'repo',
        }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error_description || 'Failed to get device code')
        setStep('error')
        setPolling(false)
        return
      }

      setUserCode(data.user_code)
      setStep('code')
      pollForToken(data.device_code, data.interval || 5)
    } catch {
      setError('Network error. Check your connection.')
      setStep('error')
      setPolling(false)
    }
  }

  const pollForToken = (deviceCode: string, interval: number) => {
    const poll = async () => {
      try {
        const res = await fetch(
          'https://github.com/login/oauth/access_token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
              device_code: deviceCode,
              grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            }),
          },
        )
        const data = await res.json()

        if (data.access_token) {
          sessionStorage.setItem('github_token', data.access_token)
          sessionStorage.setItem(
            'github_token_expires',
            String(Date.now() + data.expires_in * 1000),
          )
          setPolling(false)
          setStep('done')
          setTimeout(() => window.location.replace('/admin'), 1000)
          return
        }

        if (data.error === 'authorization_pending') {
          setTimeout(poll, interval * 1000)
        } else if (data.error === 'slow_down') {
          setTimeout(poll, (interval + 5) * 1000)
        } else if (data.error === 'expired_token') {
          setError('Session expired. Please try again.')
          setPolling(false)
          setStep('error')
        } else {
          setError(data.error_description || 'Authentication failed')
          setPolling(false)
          setStep('error')
        }
      } catch {
        setError('Network error during authentication.')
        setPolling(false)
        setStep('error')
      }
    }

    setTimeout(poll, interval * 1000)
  }

  if (step === 'done') {
    return (
      <div className="text-center py-4">
        <p className="text-success text-xs font-bold">✓ Authenticated</p>
        <p className="text-on-surface-muted text-[11px] mt-1">Redirecting to admin…</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {step === 'idle' && (
        <button
          onClick={startAuth}
          disabled={polling}
          className="w-full px-3 py-2 text-xs font-bold rounded bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          authenticate with GitHub
        </button>
      )}

      {step === 'code' && (
        <div className="text-center space-y-3">
          <p className="text-xs text-on-surface-variant">
            Visit the following URL and enter the code:
          </p>
          <a
            href="https://github.com/login/device"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-primary font-bold hover:underline"
          >
            github.com/login/device
          </a>
          <div className="inline-block px-4 py-2 bg-surface-container-highest rounded border border-outline">
            <span className="text-lg font-extrabold text-on-surface tracking-widest">
              {userCode}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-muted">Waiting for authorization…</p>
          <button
            onClick={() => {
              setStep('idle')
              setPolling(false)
            }}
            className="text-[11px] text-on-surface-variant hover:text-on-surface underline"
          >
            cancel
          </button>
        </div>
      )}

      {step === 'error' && (
        <div className="text-center space-y-3">
          <p className="text-error text-xs">{error}</p>
          <button
            onClick={startAuth}
            className="px-3 py-1.5 text-xs rounded bg-primary text-on-primary font-bold hover:opacity-90"
          >
            try again
          </button>
        </div>
      )}
    </div>
  )
}
