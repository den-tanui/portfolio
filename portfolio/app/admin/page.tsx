import { getBlogPosts, getProjects } from '@/lib/content'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await auth()
  const authMode = process.env.AUTH_MODE || 'cookie'

  // Cookie mode: protect on the server
  if (authMode === 'cookie' && !session) redirect('/admin/login')

  const posts = getBlogPosts()
  const projects = getProjects()

  return <AdminClient posts={posts} projects={projects} authMode={authMode} />
}
