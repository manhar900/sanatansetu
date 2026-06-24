import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
