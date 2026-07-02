import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

// GET /api/pending — returns pending content count + list (admin only)
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Return the full ContentItem shape (same as /api/content) so the client-side
    // DetailDialog has all the fields it expects (language, type, status, likes,
    // views, etc.). The previous `select` clause returned only a subset, which
    // caused a client-side crash when opening a pending item from the admin queue.
    const pendingItems = await db.content.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
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
