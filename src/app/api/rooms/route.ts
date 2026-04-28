import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to safely stringify JSON
function safeStringify(value: unknown): string {
  if (typeof value === 'string') {
    // Already a string - check if it's valid JSON
    try {
      JSON.parse(value)
      return value // Already valid JSON string
    } catch {
      return JSON.stringify([value]) // Single value, wrap in array
    }
  }
  return JSON.stringify(value || [])
}

// GET - получить все домики
export async function GET() {
  try {
    const rooms = await db.room.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Ошибка при получении домиков' }, { status: 500 })
  }
}

// POST - создать новый домик
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, conditions, advantages, price, capacity, amenities, images } = body

    const room = await db.room.create({
      data: {
        name: name || '',
        description: description || '',
        conditions: conditions || '',
        advantages: safeStringify(advantages),
        price: parseFloat(price) || 0,
        capacity: parseInt(capacity) || 2,
        amenities: safeStringify(amenities),
        images: safeStringify(images),
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json({ error: 'Ошибка при создании домика' }, { status: 500 })
  }
}

// PUT - обновить домик
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, conditions, advantages, price, capacity, amenities, images, isAvailable } = body

    if (!id) {
      return NextResponse.json({ error: 'ID домика не указан' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (conditions !== undefined) updateData.conditions = conditions
    if (advantages !== undefined) updateData.advantages = safeStringify(advantages)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (capacity !== undefined) updateData.capacity = parseInt(capacity)
    if (amenities !== undefined) updateData.amenities = safeStringify(amenities)
    if (images !== undefined) updateData.images = safeStringify(images)
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable

    const room = await db.room.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json({ error: 'Ошибка при обновлении домика' }, { status: 500 })
  }
}

// DELETE - удалить домик
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID домика не указан' }, { status: 400 })
    }

    const room = await db.room.update({
      where: { id },
      data: { isAvailable: false }
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json({ error: 'Ошибка при удалении домика' }, { status: 500 })
  }
}
