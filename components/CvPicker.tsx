'use client'

import Popup from './Popup'

interface CvPickerProps {
  isOpen: boolean
  onClose: () => void
}

const FORMATS = [
  { id: 'pdf' as const, label: 'cv.pdf', desc: 'Print-ready format' },
  { id: 'md' as const, label: 'cv.md', desc: 'Plain text, readable' },
  { id: 'json' as const, label: 'cv.json', desc: 'Machine-readable data' },
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
          <button
            key={fmt.id}
            onClick={() => {
              window.open(`/api/cv?format=${fmt.id}`, '_blank')
              onClose()
            }}
            className="w-full text-left p-3 border border-outline rounded hover:border-secondary hover:bg-surface-container-high transition-colors"
          >
            <span className="text-secondary font-bold">[{fmt.label}]</span>
            <span className="text-on-surface-variant ml-2">{fmt.desc}</span>
          </button>
        ))}
      </div>
    </Popup>
  )
}
