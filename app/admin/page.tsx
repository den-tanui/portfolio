import { getBlogPosts, getProjects } from '@/lib/content'
import AdminClient from './AdminClient'

/* force-static allows this page to pre-render at build time for static export (GitHub Pages).
   On Vercel, auth is handled by the middleware — this just renders content directly. */
export const dynamic = 'force-static'

export default async function AdminPage() {
  const posts = getBlogPosts()
  const projects = getProjects()

  return <AdminClient posts={posts} projects={projects} />
}
