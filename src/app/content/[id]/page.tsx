import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ContentClient } from './content-client'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const item = await db.content.findUnique({ where: { id } })
  if (!item || item.status !== 'published') {
    return { title: 'Content Not Found' }
  }
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      images: item.imageUrl ? [{ url: item.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  }
}

export default async function ContentDetailPage({ params }: Params) {
  const { id } = await params
  const item = await db.content.findUnique({ where: { id } })

  if (!item || item.status !== 'published') {
    notFound()
  }

  // Serialize dates to ISO strings for the client component.
  const serialized = {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.description,
    articleBody: item.body ?? undefined,
    author: item.author ? { '@type': 'Person', name: item.author } : undefined,
    image: item.imageUrl ?? undefined,
    datePublished: item.createdAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    inLanguage: item.language,
    keywords: item.tags ?? undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentClient item={serialized} />
    </>
  )
}
