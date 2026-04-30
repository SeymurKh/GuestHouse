import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получить настройки сайта
export async function GET() {
  try {
    const settings = await db.siteSettings.findFirst()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Ошибка при получении настроек' }, { status: 500 })
  }
}

// PUT - обновить настройки
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email, address, description } = body

    let settings = await db.siteSettings.findFirst()
    
    if (settings) {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: { phone, email, address, description }
      })
    } else {
      settings = await db.siteSettings.create({
        data: { phone, email, address, description }
      })
    }

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Ошибка при обновлении настроек' }, { status: 500 })
  }
}
