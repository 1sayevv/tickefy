import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { createTicket } from '@/lib/mockTickets'
import { uploadImageToVercel, createTicketInStorage, debugTicketsStorage } from '@/lib/vercelStorage'

interface CreateTicketFormProps {
  onTicketCreated?: () => void
  onCancel?: () => void
}

export default function CreateTicketForm({ onTicketCreated, onCancel }: CreateTicketFormProps) {
  const { t } = useTranslation()
  const { user, getUserCompany } = useAuth()
  const { refreshTickets } = useTickets()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      
      // Проверяем, что это изображение
      if (!file.type.startsWith('image/')) {
        setError(t('pleaseSelectImage'))
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('fileSizeLimit'))
        return
      }

      setSelectedFile(file)
      setError('')

      // Создаем превью изображения
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
      console.log('Created object URL:', objectUrl)
    }
  }

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error } = await supabase.storage
        .from('ticket-images')
        .upload(fileName, file)

      if (error) {
        console.error('Error uploading image:', error)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ticket-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const saveTicketToDatabase = async (ticketData: {
    title: string
    description: string
    image: string
    company: string
    status: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          image_url: ticketData.image,
          company: ticketData.company,
          status: ticketData.status,
          user_id: user?.id
        }])

      if (error) {
        console.error('Error saving ticket:', error)
        throw new Error(t('errorSavingTicket'))
      }

      return data
    } catch (error) {
      console.error('Error saving ticket:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) {
        throw new Error(t('userNotAuthorized'))
      }

      const company = getUserCompany()
      if (!company) {
        throw new Error(t('companyNotFound'))
      }

      let imageUrl: string

      if (selectedFile) {
        console.log('Processing selected file:', selectedFile.name, selectedFile.type, selectedFile.size)
        
        try {
          // Пробуем загрузить в Vercel Blob Storage
          console.log('Attempting to upload to Vercel Blob Storage...')
          imageUrl = await uploadImageToVercel(selectedFile)
          console.log('✅ Image uploaded to Vercel:', imageUrl)
        } catch (error) {
          console.log('❌ Vercel upload failed:', error)
          console.log('Falling back to local storage...')
          
          // Проверяем, настроен ли Supabase
          const isSupabaseConfigured = () => {
            return (import.meta.env.VITE_SUPABASE_URL as string) && (import.meta.env.VITE_SUPABASE_ANON_KEY as string)
          }

          if (isSupabaseConfigured()) {
            // Если Supabase настроен, загружаем в Storage
            console.log('Trying Supabase upload...')
            const uploadedUrl = await uploadImageToStorage(selectedFile)
            if (!uploadedUrl) {
              throw new Error(t('errorUploadingImage'))
            }
            imageUrl = uploadedUrl
            console.log('✅ Image uploaded to Supabase:', imageUrl)
          } else {
            // Если Supabase не настроен, используем object URL
            console.log('Using object URL as fallback...')
            imageUrl = imagePreview || `https://httpbin.org/image/png?width=400&height=300&seed=${Math.floor(Math.random() * 1000)}`
            console.log('✅ Using fallback image URL:', imageUrl)
          }
        }
      } else {
        // Если изображение не выбрано, используем заглушку
        console.log('No file selected, using placeholder')
        imageUrl = `https://httpbin.org/image/png?width=400&height=300&seed=${Math.floor(Math.random() * 1000)}`
      }

      console.log('Final image URL:', imageUrl)

      // Определяем email пользователя в зависимости от типа
      let userEmail = ''
      if (user.user_metadata?.role === 'customer') {
        // Для customer получаем email из sessionStorage
        const customerData = sessionStorage.getItem('currentCustomer')
        if (customerData) {
          const customer = JSON.parse(customerData)
          userEmail = customer.login || user.email
        } else {
          userEmail = user.email
        }
      } else if (user.user_metadata?.role === 'user') {
        // Для regular user получаем email из sessionStorage
        const regularUserData = sessionStorage.getItem('currentRegularUser')
        if (regularUserData) {
          const regularUser = JSON.parse(regularUserData)
          userEmail = regularUser.email || user.email
        } else {
          userEmail = user.email
        }
      } else {
        userEmail = user.email
      }

      const ticketData = {
        title,
        description,
        image_url: imageUrl,
        user_id: user.id,
        company: company as "Nike" | "Adidas",
        user_email: userEmail
      }

      console.log('Creating ticket with data:', ticketData)

      try {
        // Пробуем создать тикет в localStorage
        console.log('Attempting to create ticket in localStorage...')
        const createdTicket = await createTicketInStorage(ticketData)
        console.log('✅ Ticket created in localStorage:', createdTicket)
        
        // Отладочная информация
        console.log('🔍 Debugging tickets after creation...')
        debugTicketsStorage()
      } catch (error) {
        console.log('❌ localStorage failed:', error)
        console.log('Falling back to mock storage...')
        
        // Проверяем, настроен ли Supabase
        const isSupabaseConfigured = () => {
          return (import.meta.env.VITE_SUPABASE_URL as string) && (import.meta.env.VITE_SUPABASE_ANON_KEY as string)
        }

        if (isSupabaseConfigured()) {
          await saveTicketToDatabase({
            title: ticketData.title,
            description: ticketData.description,
            image: ticketData.image_url,
            company: ticketData.company,
            status: 'open'
          })
          console.log('✅ Ticket saved to Supabase database')
        } else {
          await createTicket({
            title: ticketData.title,
            description: ticketData.description,
            image: ticketData.image_url,
            company: ticketData.company,
            status: 'open',
            user_email: ticketData.user_email
          })
          console.log('✅ Ticket created in mock storage')
        }
      }

      // Обновляем список тикетов в контексте
      await refreshTickets()

      // Очищаем форму
      setTitle('')
      setDescription('')
      setSelectedFile(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }

      onTicketCreated?.()
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error)
      setError(error instanceof Error ? error.message : t('errorCreatingTicket'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{t('createTicket')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              {t('title')} *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder={t('title')}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              {t('description')} *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder={t('description')}
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
              {t('attachImage')} ({t('optional')})
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt={t('preview')}
                  className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('selectedImagePreview')}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                {t('cancel')}
              </Button>
            )}
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? t('creating') : t('create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 