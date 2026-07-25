import { getBlogPosts } from '@/lib/content'
import BlogGrid from './BlogGrid'

export default function BlogPage() {
  const posts = getBlogPosts()
  return <BlogGrid posts={posts} />
}
