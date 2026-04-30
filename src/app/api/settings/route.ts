import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAdminAuth, validateInput, sanitize } from '@/lib/middleware'

// GET - получить настройки сайта
export async function GET() {
  try {
    const settings = await db.siteSettings.findFirst()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Ошибка при получении настроек' }, { status: 500 })
  }
}

// PUT - обновить настройки (requires admin auth)
export const PUT = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { phone, email, address, description } = body

    // Validate input
    const validation = validateInput.settings({ phone, email, address, description })
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    let settings = await db.siteSettings.findFirst()
    
    if (settings) {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: {
          phone: sanitize.phone(phone),
          email: sanitize.email(email || ''),
          address: sanitize.text(address || ''),
          description: sanitize.text(description || '')
        }
      })
    } else {
      settings = await db.siteSettings.create({
        data: {
          phone: sanitize.phone(phone),
          email: sanitize.email(email || ''),
          address: sanitize.text(address || ''),
          description: sanitize.text(description || '')
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[Settings Update Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при обновлении настроек' }, { status: 500 })
  }
})
