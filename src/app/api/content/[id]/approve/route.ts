import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

// POST /api/content/[id]/approve — admin approves pending content
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
      data: { status: 'published' },
    })
    return NextResponse.json({ item, message: 'Content approved and published' })
  } catch (error) {
    console.error('POST /api/content/[id]/approve error:', error)
    return NextResponse.json({ error: 'Failed to approve content' }, { status: 500 })
  }
}
