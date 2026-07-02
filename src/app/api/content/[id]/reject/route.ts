import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

// POST /api/content/[id]/reject — admin rejects pending content
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 })
  }

  try {
    const { id } = await params
    const item = await db.content.update({
      where: { id },
      data: { status: 'rejected' },
    })
    return NextResponse.json({ item, message: 'Content rejected' })
  } catch (error) {
    console.error('POST /api/content/[id]/reject error:', error)
    return NextResponse.json({ error: 'Failed to reject content' }, { status: 500 })
  }
}
