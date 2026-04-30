import { NextResponse } from 'next/server'

// Admin authentication endpoint
export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Get password from environment variable (server-side only)
    const correctPassword = process.env.ADMIN_PASSWORD || 'room0191'
    
    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 })
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}
