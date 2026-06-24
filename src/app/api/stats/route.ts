import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [total, byCategory] = await Promise.all([
      db.content.count(),
      db.content.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),
    ])

    return NextResponse.json({
      total,
      categories: byCategory.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
