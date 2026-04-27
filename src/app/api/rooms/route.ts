import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получить все номера
export async function GET() {
  try {
    const rooms = await db.room.findMany({
      where: { isAvailable: true },
      include: {
        bookings: {
          where: {
            status: { in: ['pending', 'confirmed'] }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Ошибка при получении номеров' }, { status: 500 })
  }
}

// POST - создать новый номер
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, capacity, amenities, images } = body

    const room = await db.room.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images),
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json({ error: 'Ошибка при создании номера' }, { status: 500 })
  }
}
