import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST - upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат файла' }, { status: 400 })
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomStr}.${ext}`
    
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const filepath = path.join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    
    const publicUrl = `/uploads/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    })
  } catch (error) {
    console.error('[Upload Error]', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Ошибка при загрузке файла' }, { status: 500 })
  }
}

// DELETE - delete file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const url = searchParams.get('url')
    
    // Get filename from url if filename not provided
    let targetFilename = filename
    if (!targetFilename && url) {
      targetFilename = url.split('/').pop() || ''
    }
    
    if (!targetFilename) {
      return NextResponse.json({ error: 'Имя файла не указано' }, { status: 400 })
    }

    // Security check - only allow deleting from uploads folder
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
}
