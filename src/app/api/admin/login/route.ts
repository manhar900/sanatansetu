import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/admin-auth'

// POST /api/admin/login — validates password, returns a token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const password: string = typeof body?.password === 'string' ? body.password : ''
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
    const token = createAdminToken(password)
    if (!token) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    return NextResponse.json({ token, message: 'Login successful' })
  } catch (error) {
    console.error('POST /api/admin/login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
