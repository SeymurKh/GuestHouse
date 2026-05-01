import { NextResponse } from 'next/server'
import { verifyPassword, generateAdminToken } from '@/lib/middleware'

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
    
    const correctPassword = process.env.ADMIN_PASSWORD
    if (!correctPassword) {
      return NextResponse.json({ error: 'Server configuration error - ADMIN_PASSWORD is not configured' }, { status: 500 })
    }

    if (!verifyPassword(password, correctPassword)) {
      return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 })
    }

    const token = generateAdminToken()

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('[Auth Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}
