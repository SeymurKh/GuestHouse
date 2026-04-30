import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAdminAuth, validateInput, sanitize } from '@/lib/middleware'

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
  } catch {
    return NextResponse.json({ error: 'Ошибка при получении домиков' }, { status: 500 })
  }
}

// POST - создать новый домик (requires admin auth)
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { name, description, conditions, advantages, price, capacity, amenities, images } = body

    // Validate input
    const validation = validateInput.room({ name, description, price, capacity })
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    const room = await db.room.create({
      data: {
        name: sanitize.text(name),
        description: sanitize.text(description),
        conditions: sanitize.text(conditions),
        advantages: safeStringify(advantages),
        price: parseFloat(String(price)) || 0,
        capacity: parseInt(String(capacity)) || 2,
        amenities: safeStringify(amenities),
        images: safeStringify(images),
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('[Room Create Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при создании домика' }, { status: 500 })
  }
})

// PUT - обновить домик (requires admin auth)
export const PUT = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { id, name, description, conditions, advantages, price, capacity, amenities, images, isAvailable } = body

    if (!id) {
      return NextResponse.json({ error: 'ID домика не указан' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    
    if (name !== undefined) updateData.name = sanitize.text(name)
    if (description !== undefined) updateData.description = sanitize.text(description)
    if (conditions !== undefined) updateData.conditions = sanitize.text(conditions)
    if (advantages !== undefined) updateData.advantages = safeStringify(advantages)
    if (price !== undefined) {
      const val = parseFloat(String(price)) || 0
      if (val < 0 || val > 100000) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
      }
      updateData.price = val
    }
    if (capacity !== undefined) {
      const val = parseInt(String(capacity)) || 2
      if (val < 1 || val > 50) {
        return NextResponse.json({ error: 'Invalid capacity' }, { status: 400 })
      }
      updateData.capacity = val
    }
    if (amenities !== undefined) updateData.amenities = safeStringify(amenities)
    if (images !== undefined) updateData.images = safeStringify(images)
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable

    const room = await db.room.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('[Room Update Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при обновлении домика' }, { status: 500 })
  }
})

// DELETE - удалить домик (requires admin auth)
export const DELETE = withAdminAuth(async (request: NextRequest) => {
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
  } catch {
    return NextResponse.json({ error: 'Ошибка при удалении домика' }, { status: 500 })
  }
})
