import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

// GET /api/pending — returns pending content count + list (admin only)
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pendingItems = await db.content.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, description: true, category: true, submittedBy: true, createdAt: true },
    })

    return NextResponse.json({
      count: pendingItems.length,
      items: pendingItems,
    })
  } catch (error) {
    console.error('GET /api/pending error:', error)
    return NextResponse.json({ error: 'Failed to fetch pending items' }, { status: 500 })
  }
}
