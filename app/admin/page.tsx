import { getBlogPosts, getProjects } from '@/lib/content'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const posts = getBlogPosts()
  const projects = getProjects()

  return <AdminClient posts={posts} projects={projects} />
}
