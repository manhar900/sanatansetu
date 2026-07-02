import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(200, Math.max(1, parseInt(limitParam, 10) || 50)) : undefined

    const where: Record<string, unknown> = {}
    // Only show published content to regular users.
    // Admin can see pending/rejected by passing status=pending|rejected|all
    if (status && status !== 'all') {
      where.status = status
    } else if (!status) {
      where.status = 'published'
    }
    if (category && category !== 'All') where.category = category
    if (type && type !== 'All') where.type = type
    if (featured === 'true') where.featured = true
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { body: { contains: search } },
        { tags: { contains: search } },
        { author: { contains: search } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'oldest') orderBy = { createdAt: 'asc' }
    else if (sort === 'popular') orderBy = { views: 'desc' }
    else if (sort === 'liked') orderBy = { likes: 'desc' }

    const items = await db.content.findMany({
      where,
      orderBy,
      ...(limit ? { take: limit } : {}),
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('GET /api/content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data.title || !data.description || !data.category || !data.type) {
      return NextResponse.json(
        { error: 'Title, description, category, and type are required' },
        { status: 400 }
      )
    }

    // If admin is uploading, publish immediately. Otherwise mark as pending.
    const isAdmin = isAdminRequest(req)
    const uploadStatus = isAdmin ? 'published' : 'pending'

    // Serialize translations and mediaGallery to JSON strings for storage.
    const translationsJson =
      data.translations && typeof data.translations === 'object'
        ? JSON.stringify(data.translations)
        : data.translations && typeof data.translations === 'string'
          ? data.translations
          : null
    const mediaGalleryJson =
      data.mediaGallery && typeof data.mediaGallery === 'object'
        ? JSON.stringify(data.mediaGallery)
        : data.mediaGallery && typeof data.mediaGallery === 'string'
          ? data.mediaGallery
          : null

    const item = await db.content.create({
      data: {
        title: String(data.title).trim(),
        description: String(data.description).trim(),
        body: data.body ? String(data.body).trim() : null,
        category: String(data.category),
        type: String(data.type),
        mediaUrl: data.mediaUrl ? String(data.mediaUrl).trim() : null,
        imageUrl: data.imageUrl ? String(data.imageUrl).trim() : null,
        author: data.author ? String(data.author).trim() : null,
        language: data.language ? String(data.language) : 'Sanskrit',
        tags: data.tags ? String(data.tags).trim() : null,
        translations: translationsJson,
        mediaGallery: mediaGalleryJson,
        featured: Boolean(data.featured),
        status: uploadStatus,
        submittedBy: data.submittedBy ? String(data.submittedBy).trim() : null,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/content error:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
