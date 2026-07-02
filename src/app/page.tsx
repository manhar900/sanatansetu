import { db } from '@/lib/db'
import { HomeApp } from '@/app/home-app'

export const dynamic = 'force-dynamic'

// ContentItem shape shared between server & client. Keep in sync with the
// client-side type in home-app.tsx.
type SerializedItem = {
  id: string
  title: string
  description: string
  body: string | null
  category: string
  type: string
  mediaUrl: string | null
  imageUrl: string | null
  author: string | null
  language: string
  tags: string | null
  translations: string | null
  mediaGallery: string | null
  views: number
  likes: number
  featured: boolean
  status: string
  submittedBy: string | null
  createdAt: string
  updatedAt: string
}

type Stats = {
  total: number
  categories: { name: string; count: number }[]
}

function serialize(item: any): SerializedItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    body: item.body,
    category: item.category,
    type: item.type,
    mediaUrl: item.mediaUrl,
    imageUrl: item.imageUrl,
    author: item.author,
    language: item.language,
    tags: item.tags,
    translations: item.translations,
    mediaGallery: item.mediaGallery,
    views: item.views,
    likes: item.likes,
    featured: item.featured,
    status: item.status,
    submittedBy: item.submittedBy,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
  }
}

export default async function Page() {
  let items: SerializedItem[] = []
  let stats: Stats = { total: 0, categories: [] }

  try {
    const [dbItems, total, byCategory] = await Promise.all([
      db.content.findMany({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.content.count({ where: { status: 'published' } }),
      db.content.groupBy({
        by: ['category'],
        where: { status: 'published' },
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),
    ])
    items = dbItems.map(serialize)
    stats = {
      total,
      categories: byCategory.map((c) => ({ name: c.category, count: c._count.category })),
    }
  } catch (error) {
    console.error('Page load error:', error)
  }

  // JSON-LD structured data for SEO.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sanatan Setu',
    alternateName: 'सनातन सेतु',
    description:
      'A sacred digital library to upload, preserve, and explore Hindu religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and more.',
    url: 'https://sanatansetu.example',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sanatansetu.example/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeApp initialItems={items} initialStats={stats} />
    </>
  )
}
