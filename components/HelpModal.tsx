'use client'

import Popup from './Popup'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Popup isOpen={isOpen} onClose={onClose} size="max-w-md" accent="tertiary">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
        <h2 className="text-sm font-bold text-on-surface">HELP(1) — User Manual</h2>
        <button onClick={onClose} className="text-on-surface-muted hover:text-on-surface leading-none" aria-label="Close">×</button>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {/* NAME */}
        <section>
          <p className="text-tertiary font-bold mb-1">NAME</p>
          <p className="text-on-surface">
            <span className="text-primary">tanui-v2.0</span> — Tokyo Night terminal-themed portfolio
          </p>
        </section>

        {/* SYNOPSIS */}
        <section>
          <p className="text-tertiary font-bold mb-1">SYNOPSIS</p>
          <p className="text-on-surface-variant">
            <span className="text-on-surface">tanui-v2.0</span> [--theme dark|light] [--font-size 80-120] [--zoom 75|100|125|150]
          </p>
          <p className="text-on-surface-muted mt-1">
            A keyboard-driven portfolio with MDX blog, project showcase, and terminal aesthetics.
          </p>
        </section>

        {/* NAVIGATION */}
        <section>
          <p className="text-tertiary font-bold mb-1">NAVIGATION</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-on-surface-variant">
            <kbd className="text-primary font-bold">0</kbd><span>Home</span>
            <kbd className="text-primary font-bold">1</kbd><span>Blog index</span>
            <kbd className="text-primary font-bold">2</kbd><span>Projects index</span>
            <kbd className="text-primary font-bold">3</kbd><span>About</span>
            <kbd className="text-primary font-bold">g</kbd><span>Scroll to top</span>
            <kbd className="text-primary font-bold">G</kbd><span>Scroll to bottom</span>
          </div>
        </section>

        {/* SYSTEM */}
        <section>
          <p className="text-tertiary font-bold mb-1">SYSTEM</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-on-surface-variant">
            <kbd className="text-primary font-bold">/</kbd><span>Toggle search / go to /search</span>
            <kbd className="text-primary font-bold">?</kbd><span>Toggle this help modal</span>
            <kbd className="text-primary font-bold">Esc</kbd><span>Close popups + settings</span>
          </div>
        </section>

        {/* FILES */}
        <section>
          <p className="text-tertiary font-bold mb-1">FILES</p>
          <div className="text-on-surface-variant space-y-0.5">
            <p><span className="text-cyan">content/blog/</span> — Blog posts (MDX)</p>
            <p><span className="text-cyan">content/projects/</span> — Project pages (MDX)</p>
            <p><span className="text-cyan">content/about.mdx</span> — About page</p>
          </div>
        </section>

        {/* SEE ALSO */}
        <section>
          <p className="text-tertiary font-bold mb-1">SEE ALSO</p>
          <p className="text-on-surface-variant">
            The <kbd className="text-primary">⚙</kbd> settings menu for theme, font size, zoom, and contact.
          </p>
        </section>
      </div>
    </Popup>
  )
}
