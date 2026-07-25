import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <p className="text-on-surface-muted text-xs mb-1">
          <span className="text-tertiary">$</span> bash: page not found
        </p>
        <h1 className="text-2xl font-extrabold text-error mb-2">404</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded hover:opacity-90 transition-opacity"
          >
            $ cd ~
          </Link>
          <Link
            href="/blog"
            className="px-4 py-2 border border-outline text-on-surface-variant text-xs font-bold rounded hover:bg-surface-container-high transition-colors"
          >
            $ ls blogs/
          </Link>
        </div>
      </div>
    </div>
  )
}
