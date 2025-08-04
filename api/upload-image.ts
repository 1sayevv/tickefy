import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

// Проверяем, доступен ли Blob Storage
const isBlobStorageAvailable = () => {
  return process.env.BLOB_READ_WRITE_TOKEN
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 API upload-image called')
    console.log('🔧 Environment check:', {
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0
    })
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('📁 File received:', {
      name: file?.name,
      type: file?.type,
      size: file?.size,
      exists: !!file
    })
    
    if (!file) {
      console.log('❌ No file found in request')
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      )
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Поддерживаются только изображения' },
        { status: 400 }
      )
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed')

    // Проверяем доступность Blob Storage
    if (!isBlobStorageAvailable()) {
      console.log('❌ Blob Storage not available - missing BLOB_READ_WRITE_TOKEN')
      return NextResponse.json(
        { error: 'Blob Storage не настроен. Добавьте переменную BLOB_READ_WRITE_TOKEN' },
        { status: 500 }
      )
    }

    // Создаем уникальное имя файла
    const timestamp = Date.now()
    const fileName = `tickets/${timestamp}-${file.name}`
    console.log('📝 File name:', fileName)

    try {
      // Загружаем файл в Vercel Blob Storage
      console.log('🚀 Uploading to Vercel Blob Storage...')
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false
      })

      console.log('✅ Upload successful:', blob.url)

      return NextResponse.json({
        url: blob.url,
        success: true
      })
    } catch (error) {
      console.error('❌ Blob upload error:', error)
      return NextResponse.json(
        { error: 'Ошибка загрузки в Blob Storage: ' + (error as Error).message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Error uploading file:', error)
    console.error('❌ Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    })
    return NextResponse.json(
      { error: 'Ошибка загрузки файла: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 