import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 API upload-image called')
    
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

    // Создаем уникальное имя файла
    const timestamp = Date.now()
    const fileName = `tickets/${timestamp}-${file.name}`
    console.log('📝 File name:', fileName)

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
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    )
  }
} 