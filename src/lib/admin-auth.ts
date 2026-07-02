import { createHash, timingSafeEqual } from 'crypto'

const ADMIN_SALT = 'sanatan-setu-admin-v1'

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export function createAdminToken(password: string): string | null {
  if (password !== ADMIN_PASSWORD) return null
  return createHash('sha256')
    .update(ADMIN_PASSWORD + ':' + ADMIN_SALT)
    .digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
  } catch {
    return false
  }
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false
  const expected = createHash('sha256')
    .update(ADMIN_PASSWORD + ':' + ADMIN_SALT)
    .digest('hex')
  return safeEqual(token, expected)
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.get('authorization')
  if (!header?.toLowerCase().startsWith('bearer ')) return null
  return header.slice(7).trim()
}

export function isAdminRequest(req: Request): boolean {
  return verifyAdminToken(extractBearerToken(req))
}
