import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured')

    const where: any = {}
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

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'oldest') orderBy = { createdAt: 'asc' }
    else if (sort === 'popular') orderBy = { views: 'desc' }
    else if (sort === 'liked') orderBy = { likes: 'desc' }

    const items = await db.content.findMany({
      where,
      orderBy,
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

    const item = await db.content.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        body: data.body?.trim() || null,
        category: data.category,
        type: data.type,
        mediaUrl: data.mediaUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        author: data.author?.trim() || null,
        language: data.language || 'Sanskrit',
        tags: data.tags?.trim() || null,
        featured: Boolean(data.featured),
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/content error:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
