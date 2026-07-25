import { getProjects } from '@/lib/content'
import ProjectGrid from './ProjectGrid'

export default function ProjectsPage() {
  const projects = getProjects()
  return <ProjectGrid projects={projects} />
}
