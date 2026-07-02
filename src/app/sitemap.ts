import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { CATEGORIES } from '@/lib/categories'

export const revalidate = 3600

const BASE_URL = 'https://sanatansetu.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
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
      url: `${BASE_URL}/content/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('sitemap error:', error)
  }

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/?category=${encodeURIComponent(c.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...contentEntries, ...categoryEntries]
}
