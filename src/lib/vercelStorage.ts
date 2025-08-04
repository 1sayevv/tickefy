// Сервис для работы с Vercel Storage

// Загрузка изображения в Vercel Blob Storage
export const uploadImageToVercel = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка загрузки изображения')
    }

    const result = await response.json()
    return result.url

  } catch (error) {
    console.error('Error uploading image to Vercel:', error)
    throw error
  }
}

// Получить все тикеты из Vercel KV
export const getTicketsFromVercel = async (company?: string, status?: string): Promise<any[]> => {
  try {
    const params = new URLSearchParams()
    if (company) params.append('company', company)
    if (status) params.append('status', status)

    const response = await fetch(`/api/tickets?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Ошибка получения тикетов')
    }

    return await response.json()

  } catch (error) {
    console.error('Error fetching tickets from Vercel:', error)
    return []
  }
}

// Создать новый тикет в Vercel KV
export const createTicketInVercel = async (ticketData: {
  title: string
  description: string
  image_url?: string
  user_id: string
  company: string
}): Promise<any> => {
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка создания тикета')
    }

    return await response.json()

  } catch (error) {
    console.error('Error creating ticket in Vercel:', error)
    throw error
  }
}

// Обновить статус тикета в Vercel KV
export const updateTicketStatusInVercel = async (id: string, status: string): Promise<any> => {
  try {
    const response = await fetch('/api/tickets', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, status })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка обновления тикета')
    }

    return await response.json()

  } catch (error) {
    console.error('Error updating ticket status in Vercel:', error)
    throw error
  }
} 