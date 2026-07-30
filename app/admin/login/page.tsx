import TerminalPrompt from '@/components/TerminalPrompt'

/* On static export (GitHub Pages), server-side auth is unavailable.
   On Vercel, the middleware handles auth and redirects here if needed. */
export const dynamic = 'force-static'

export default function LoginPage() {
  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 flex items-center justify-center">
      <div className="max-w-sm mx-4 w-full">
        <TerminalPrompt path="~/admin/login" />
        <div className="border border-outline rounded-lg bg-surface-container p-6 text-center">
          <h1 className="text-xs font-bold text-on-surface mb-2">authentication unavailable</h1>
          <p className="text-[11px] text-on-surface-muted">
            The admin panel requires a server-side runtime (Vercel).
            This static export (GitHub Pages) only serves public content.
          </p>
        </div>
      </div>
    </div>
  )
}
