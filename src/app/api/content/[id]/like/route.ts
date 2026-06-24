import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await db.content.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })
    return NextResponse.json({ likes: item.likes })
  } catch (error) {
    console.error('POST /api/content/[id]/like error:', error)
    return NextResponse.json({ error: 'Failed to like content' }, { status: 500 })
  }
}
