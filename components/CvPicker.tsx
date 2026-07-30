'use client'

import Popup from './Popup'

interface CvPickerProps {
  isOpen: boolean
  onClose: () => void
}

const FORMATS = [
  { label: 'cv.pdf', desc: 'Print-ready format', path: '/cv/cv.pdf' },
  { label: 'cv.md', desc: 'Plain text, readable', path: '/cv/cv.md' },
  { label: 'cv.json', desc: 'Machine-readable data', path: '/cv/cv.json' },
]

export default function CvPicker({ isOpen, onClose }: CvPickerProps) {
  return (
    <Popup isOpen={isOpen} onClose={onClose} size="max-w-sm" accent="secondary">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
        <h2 className="text-sm font-bold text-secondary">SELECT CV FORMAT</h2>
        <button onClick={onClose} className="text-on-surface-muted hover:text-on-surface leading-none" aria-label="Close">×</button>
      </div>
      <div className="space-y-2">
        {FORMATS.map((fmt) => (
          <a
            key={fmt.path}
            href={fmt.path}
            download
            onClick={onClose}
            className="block w-full text-left p-3 border border-outline rounded hover:border-secondary hover:bg-surface-container-high transition-colors"
          >
            <span className="text-secondary font-bold">[{fmt.label}]</span>
            <span className="text-on-surface-variant ml-2">{fmt.desc}</span>
          </a>
        ))}
      </div>
    </Popup>
  )
}
