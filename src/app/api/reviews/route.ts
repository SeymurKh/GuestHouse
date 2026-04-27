import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получить одобренные отзывы
export async function GET() {
  try {
    const reviews = await db.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Ошибка при получении отзывов' }, { status: 500 })
  }
}

// POST - создать новый отзыв
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestName, rating, comment } = body

    const review = await db.review.create({
      data: {
        guestName,
        rating: parseInt(rating),
        comment,
        isApproved: false // Отзыв требует модерации
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Ошибка при создании отзыва' }, { status: 500 })
  }
}

// PUT - одобрить отзыв (для админ-панели)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isApproved } = body

    const review = await db.review.update({
      where: { id },
      data: { isApproved }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Ошибка при обновлении отзыва' }, { status: 500 })
  }
}
