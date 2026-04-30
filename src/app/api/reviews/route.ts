import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получить одобренные отзывы (или все для админа)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    
    const reviews = await db.review.findMany({
      where: all ? {} : { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: all ? 10 : 20
    })
    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: 'Ошибка при получении отзывов' }, { status: 500 })
  }
}

// POST - создать новый отзыв
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestName, rating, comment, isApproved } = body

    const review = await db.review.create({
      data: {
        guestName,
        rating: parseInt(rating),
        comment,
        isApproved: isApproved ?? false
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Ошибка при создании отзыва' }, { status: 500 })
  }
}

// PUT - обновить отзыв (полное редактирование)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, guestName, rating, comment, isApproved } = body

    if (!id) {
      return NextResponse.json({ error: 'ID отзыва не указан' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (guestName !== undefined) updateData.guestName = guestName
    if (rating !== undefined) updateData.rating = parseInt(rating)
    if (comment !== undefined) updateData.comment = comment
    if (isApproved !== undefined) updateData.isApproved = isApproved

    const review = await db.review.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(review)
  } catch {
    return NextResponse.json({ error: 'Ошибка при обновлении отзыва' }, { status: 500 })
  }
}

// DELETE - удалить отзыв
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID отзыва не указан' }, { status: 400 })
    }

    await db.review.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Отзыв удален' })
  } catch {
    return NextResponse.json({ error: 'Ошибка при удалении отзыва' }, { status: 500 })
  }
}
