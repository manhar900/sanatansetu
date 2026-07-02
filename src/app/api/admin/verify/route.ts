import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'

// POST /api/admin/verify — checks whether the provided bearer token is valid
export async function POST(req: NextRequest) {
  if (isAdminRequest(req)) {
    return NextResponse.json({ valid: true })
  }
  return NextResponse.json({ valid: false }, { status: 401 })
}
