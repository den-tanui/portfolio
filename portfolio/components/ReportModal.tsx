'use client'

import { useState } from 'react'
import Popup from './Popup'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — wire to POST /api/report later
    setSent(true)
    setTimeout(onClose, 1500)
  }

  if (sent) {
    return (
      <Popup isOpen={isOpen} onClose={onClose} size="max-w-sm" accent="tertiary">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
          <h2 className="text-sm font-bold text-tertiary">REPORT PROBLEM</h2>
          <button onClick={onClose} className="text-on-surface-muted hover:text-on-surface leading-none" aria-label="Close">×</button>
        </div>
        <p className="text-success text-center py-6">$ Report submitted. Thank you.</p>
      </Popup>
    )
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose} accent="tertiary">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
        <h2 className="text-sm font-bold text-tertiary">REPORT PROBLEM</h2>
        <button onClick={onClose} className="text-on-surface-muted hover:text-on-surface leading-none" aria-label="Close">×</button>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="text-on-surface-muted block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface-dim border border-outline rounded px-2 py-1.5 text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-tertiary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-on-surface-muted block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface-dim border border-outline rounded px-2 py-1.5 text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-tertiary"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-on-surface-muted block mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full bg-surface-dim border border-outline rounded px-2 py-1.5 text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-tertiary resize-none"
            placeholder="Describe the problem..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-tertiary text-on-tertiary font-bold py-1.5 rounded hover:opacity-90 transition-opacity"
        >
          $ Submit
        </button>
      </form>
    </Popup>
  )
}
