'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TagPill from './TagPill'
import LangPill from './LangPill'
import TrafficLightDots from './TrafficLightDots'

interface FilterableCardProps {
  href: string
  title: string
  description: string
  tags: string[]
  langs: string[]
  image?: string
  index?: number
}

export default function FilterableCard({ href, title, description, tags, langs, image, index = 0 }: FilterableCardProps) {
  const router = useRouter()

  const searchTag = (tag: string) => {
    router.push(`/search?q=%23${tag}`)
  }

  const searchLang = (lang: string) => {
    router.push(`/search?q=%40${lang}`)
  }

  return (
    <Link
      href={href}
      className="block border border-outline rounded-lg overflow-hidden card-glow-static card-enter"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <TrafficLightDots />
      {/* Image */}
      {image && (
        <div className="aspect-[16/10] bg-surface-container overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-bold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => <TagPill key={tag} tag={tag} onClick={() => searchTag(tag)} />)}
          {langs.map((lang) => <LangPill key={lang} lang={lang} onClick={() => searchLang(lang)} />)}
        </div>
      </div>
    </Link>
  )
}
