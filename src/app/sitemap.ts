import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { CATEGORIES } from '@/lib/categories'

// Dynamic sitemap generated from the database.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://sanatansetu.example'

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ]

  let contentEntries: MetadataRoute.Sitemap = []
  try {
    const items = await db.content.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    })
    contentEntries = items.map((item) => ({
      url: `${base}/content/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('sitemap error:', error)
  }

  // Category landing entries — they all point to / for now but signal intent.
  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/?category=${encodeURIComponent(c.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...contentEntries, ...categoryEntries]
}
