import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { withAdminAuth, validateInput, sanitize, isValidId, sanitizeBoolean } from '@/lib/middleware'

// Helper to normalize JSON-compatible room fields
function normalizeJsonField(value: unknown): Prisma.InputJsonValue {
  if (value === undefined || value === null) {
    return []
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed
    } catch {
      return [value]
    }
  }

  return value
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
    console.error('[Rooms GET Error]', error)
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
        advantages: normalizeJsonField(advantages),
        price: parseFloat(String(price)) || 0,
        capacity: parseInt(String(capacity), 10) || 2,
        amenities: normalizeJsonField(amenities),
        images: normalizeJsonField(images),
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

    if (!isValidId(id)) {
      return NextResponse.json({ error: 'ID домика не указан или некорректен' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    
    if (name !== undefined) updateData.name = sanitize.text(name)
    if (description !== undefined) updateData.description = sanitize.text(description)
    if (conditions !== undefined) updateData.conditions = sanitize.text(conditions)
    if (advantages !== undefined) updateData.advantages = normalizeJsonField(advantages)
    if (price !== undefined) {
      const val = parseFloat(String(price))
      if (Number.isNaN(val) || val < 0 || val > 100000) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
      }
      updateData.price = val
    }
    if (capacity !== undefined) {
      const val = parseInt(String(capacity), 10)
      if (Number.isNaN(val) || val < 1 || val > 50) {
        return NextResponse.json({ error: 'Invalid capacity' }, { status: 400 })
      }
      updateData.capacity = val
    }
    if (amenities !== undefined) updateData.amenities = normalizeJsonField(amenities)
    if (images !== undefined) updateData.images = normalizeJsonField(images)
    if (isAvailable !== undefined) {
      if (typeof isAvailable !== 'boolean') {
        return NextResponse.json({ error: 'Поле isAvailable должно быть булевым' }, { status: 400 })
      }
      updateData.isAvailable = isAvailable
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Нет данных для обновления' }, { status: 400 })
    }

    const room = await db.room.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(room)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Домик не найден' }, { status: 404 })
    }
    console.error('[Room Update Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при обновлении домика' }, { status: 500 })
  }
})

// DELETE - удалить домик (requires admin auth)
export const DELETE = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!isValidId(id)) {
      return NextResponse.json({ error: 'ID домика не указан или некорректен' }, { status: 400 })
    }

    const room = await db.room.update({
      where: { id },
      data: { isAvailable: false }
    })

    return NextResponse.json(room)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Домик не найден' }, { status: 404 })
    }
    console.error('[Room Delete Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при удалении домика' }, { status: 500 })
  }
})
