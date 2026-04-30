import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/middleware'

// Admin authentication endpoint
// Uses timing-safe password comparison to prevent timing attacks
export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Неверный пароль' },
        { status: 401 }
      )
    }
    
    // Get password from environment variable (server-side only)
    // ADMIN_PASSWORD must be set in .env for security
    const correctPassword = process.env.ADMIN_PASSWORD
    
    if (!correctPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Use timing-safe comparison to prevent timing attacks
    if (verifyPassword(password, correctPassword)) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 })
    }
  } catch (error) {
    console.error('[Auth Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}
