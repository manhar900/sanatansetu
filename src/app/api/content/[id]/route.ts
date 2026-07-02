import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await db.content.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    // Increment view count
    await db.content.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
    return NextResponse.json({ item: { ...item, views: item.views + 1 } })
  } catch (error) {
    console.error('GET /api/content/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Unauthorized — admin only' },
      { status: 401 }
    )
  }
  try {
    const { id } = await params
    const data = await req.json()
    const existing = await db.content.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const translationsJson =
      data.translations === undefined
        ? undefined
        : data.translations && typeof data.translations === 'object'
          ? JSON.stringify(data.translations)
          : typeof data.translations === 'string'
            ? data.translations
            : null
    const mediaGalleryJson =
      data.mediaGallery === undefined
        ? undefined
        : data.mediaGallery && typeof data.mediaGallery === 'object'
          ? JSON.stringify(data.mediaGallery)
          : typeof data.mediaGallery === 'string'
            ? data.mediaGallery
            : null

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = String(data.title).trim()
    if (data.description !== undefined)
      updateData.description = String(data.description).trim()
    if (data.body !== undefined)
      updateData.body = data.body ? String(data.body).trim() : null
    if (data.category !== undefined) updateData.category = String(data.category)
    if (data.type !== undefined) updateData.type = String(data.type)
    if (data.mediaUrl !== undefined)
      updateData.mediaUrl = data.mediaUrl ? String(data.mediaUrl).trim() : null
    if (data.imageUrl !== undefined)
      updateData.imageUrl = data.imageUrl ? String(data.imageUrl).trim() : null
    if (data.author !== undefined)
      updateData.author = data.author ? String(data.author).trim() : null
    if (data.language !== undefined)
      updateData.language = data.language ? String(data.language) : 'Sanskrit'
    if (data.tags !== undefined)
      updateData.tags = data.tags ? String(data.tags).trim() : null
    if (translationsJson !== undefined) updateData.translations = translationsJson
    if (mediaGalleryJson !== undefined) updateData.mediaGallery = mediaGalleryJson
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured)

    const item = await db.content.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ item })
  } catch (error) {
    console.error('PUT /api/content/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.content.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/content/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
