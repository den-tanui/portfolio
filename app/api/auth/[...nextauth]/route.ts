import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers

/* Static export: no auth paths to pre-render (auth needs a server).
   On Vercel (server mode), next-auth works normally. */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return [] // No auth routes to statically generate
}
