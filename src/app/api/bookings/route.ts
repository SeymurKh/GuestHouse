import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получить все бронирования (для админ-панели)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const bookings = await db.booking.findMany({
      where: status ? { status } : undefined,
      include: {
        room: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Ошибка при получении бронирований' }, { status: 500 })
  }
}

// POST - создать новое бронирование
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, guestName, guestPhone, guestEmail, checkIn, checkOut, guests, notes } = body

    // Проверяем доступность номера на указанные даты
    const existingBookings = await db.booking.findMany({
      where: {
        roomId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gt: new Date(checkIn) } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } }
            ]
          }
        ]
      }
    })

    if (existingBookings.length > 0) {
      return NextResponse.json({ 
        error: 'Номер уже забронирован на выбранные даты' 
      }, { status: 400 })
    }

    const booking = await db.booking.create({
      data: {
        roomId,
        guestName,
        guestPhone,
        guestEmail,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        notes,
        status: 'pending'
      },
      include: {
        room: true
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Ошибка при создании бронирования' }, { status: 500 })
  }
}

// PUT - обновить статус бронирования
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const booking = await db.booking.update({
      where: { id },
      data: { status },
      include: { room: true }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Ошибка при обновлении бронирования' }, { status: 500 })
  }
}
