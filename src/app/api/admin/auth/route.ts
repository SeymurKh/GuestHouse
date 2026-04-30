import { NextResponse } from 'next/server'

// Admin authentication endpoint
export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Get password from environment variable (server-side only)
    // ADMIN_PASSWORD must be set in .env for security
    const correctPassword = process.env.ADMIN_PASSWORD
    
    if (!correctPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}
