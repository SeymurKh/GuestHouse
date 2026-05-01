import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { withAdminAuth } from '@/lib/middleware'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
const extensionMap: Record<typeof allowedTypes[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp'
}

function detectImageType(buffer: Buffer): typeof allowedTypes[number] | null {
  if (buffer.length >= 4) {
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg'
    }
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'image/png'
    }
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    ) {
      return 'image/gif'
    }
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.slice(8, 12).toString() === 'WEBP'
    ) {
      return 'image/webp'
    }
  }
  return null
}

// POST - upload file
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const detectedType = detectImageType(buffer)
    if (!detectedType || !allowedTypes.includes(detectedType)) {
      return NextResponse.json({ error: 'Неподдерживаемый или поврежденный файл изображения' }, { status: 400 })
    }

    const extension = extensionMap[detectedType]
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}.${extension}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    const publicUrl = `/uploads/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename
    })
  } catch (error) {
    console.error('[Upload Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при загрузке файла' }, { status: 500 })
  }
})

// DELETE - delete file
export const DELETE = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const url = searchParams.get('url')
    
    let targetFilename = filename
    if (!targetFilename && url) {
      targetFilename = url.split('/').pop() || ''
    }
    
    if (!targetFilename) {
      return NextResponse.json({ error: 'Имя файла не указано' }, { status: 400 })
    }

    if (!targetFilename.match(/^[\d\-a-z]+\.(jpg|jpeg|png|gif|webp)$/i)) {
      return NextResponse.json({ error: 'Недопустимое имя файла' }, { status: 400 })
    }

    const filepath = path.join(process.cwd(), 'public/uploads', targetFilename)
    
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
    }
    
    await unlink(filepath)
    
    return NextResponse.json({ success: true, message: 'Файл удален' })
  } catch (error) {
    console.error('[Delete Upload Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при удалении файла' }, { status: 500 })
  }
})
