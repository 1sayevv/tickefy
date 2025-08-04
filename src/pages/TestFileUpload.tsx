import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MainLayout from '@/layouts/MainLayout'

export default function TestFileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      
      // Проверяем, что это изображение
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения')
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB')
        return
      }

      setSelectedFile(file)
      
      // Создаем превью изображения
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
      
      setFileInfo(`
        Имя файла: ${file.name}
        Тип: ${file.type}
        Размер: ${(file.size / 1024 / 1024).toFixed(2)} MB
        Object URL: ${objectUrl}
      `)
      
      console.log('Created object URL:', objectUrl)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    setFileInfo('')
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Тест загрузки файлов</h1>
          <p className="text-muted-foreground mt-2">Проверка функциональности загрузки изображений</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Загрузка изображения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="test-image" className="block text-sm font-medium text-foreground mb-2">
                  Выберите изображение
                </label>
                <input
                  id="test-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {imagePreview && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Превью изображения:</h3>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-64 h-64 object-cover rounded border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Информация о файле:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {fileInfo}
                    </pre>
                  </div>

                  <Button onClick={handleClear} variant="outline">
                    Очистить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 