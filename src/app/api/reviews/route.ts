import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAdminAuth, validateInput, sanitize, getAuthTokenFromRequest, verifyAdminToken } from '@/lib/middleware'

// GET - получить одобренные отзывы (или все для админа)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const token = getAuthTokenFromRequest(request)

    if (all && !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized - Admin token required' }, { status: 401 })
    }

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
    const token = getAuthTokenFromRequest(request)

    // Validate input
    const validation = validateInput.review({ guestName, rating, comment })
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    if (isApproved === true && !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized - Admin token required' }, { status: 401 })
    }

    const review = await db.review.create({
      data: {
        guestName: sanitize.text(guestName),
        rating: Math.min(5, Math.max(1, parseInt(String(rating)))),
        comment: sanitize.text(comment),
        isApproved: isApproved ?? false
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('[Review Create Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при создании отзыва' }, { status: 500 })
  }
}

// PUT - обновить отзыв (полное редактирование, requires admin auth)
export const PUT = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { id, guestName, rating, comment, isApproved } = body

    if (!id) {
      return NextResponse.json({ error: 'ID отзыва не указан' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (guestName !== undefined) updateData.guestName = sanitize.text(guestName)
    if (rating !== undefined) updateData.rating = Math.min(5, Math.max(1, parseInt(String(rating))))
    if (comment !== undefined) updateData.comment = sanitize.text(comment)
    if (isApproved !== undefined) updateData.isApproved = isApproved

    const review = await db.review.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('[Review Update Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при обновлении отзыва' }, { status: 500 })
  }
})

// DELETE - удалить отзыв (requires admin auth)
export const DELETE = withAdminAuth(async (request: NextRequest) => {
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
  } catch (error) {
    console.error('[Review Delete Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при удалении отзыва' }, { status: 500 })
  }
})
