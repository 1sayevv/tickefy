// Сервис для работы с Vercel Storage

// Загрузка изображения в Vercel Blob Storage
export const uploadImageToVercel = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('📤 Sending request to /api/upload-image')
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    console.log('📥 Response status:', response.status)

    if (!response.ok) {
      let errorMessage = 'Ошибка загрузки изображения'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (parseError) {
        console.log('Could not parse error response:', parseError)
        // Не пытаемся читать тело ответа дважды
        errorMessage = `HTTP ${response.status}: Server Error`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('✅ Upload successful, URL:', result.url)
    return result.url

  } catch (error) {
    console.error('❌ Error uploading image to Vercel:', error)
    throw error
  }
}

// localStorage для тикетов (альтернатива KV)
const TICKETS_STORAGE_KEY = 'tickefy_tickets'

// Получить все тикеты из localStorage
export const getTicketsFromStorage = async (): Promise<any[]> => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY)
    if (stored) {
      const tickets = JSON.parse(stored)
      console.log('📦 Retrieved tickets from localStorage:', tickets.length)
      return tickets
    }
    console.log('📦 No tickets found in localStorage')
    return []
  } catch (error) {
    console.error('❌ Error reading tickets from localStorage:', error)
    return []
  }
}

// Создать новый тикет в localStorage
export const createTicketInStorage = async (ticketData: {
  title: string
  description: string
  image_url?: string
  user_id: string
  company: string
  user_email?: string
}): Promise<any> => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY)
    const tickets = stored ? JSON.parse(stored) : []

    const newTicket = {
      id: Date.now().toString(),
      title: ticketData.title,
      description: ticketData.description,
      image_url: ticketData.image_url,
      user_id: ticketData.user_id,
      user_email: ticketData.user_email || 'unknown@example.com',
      company: ticketData.company,
      status: 'open',
      created_at: new Date().toISOString()
    }

    tickets.push(newTicket)
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))

    return newTicket

  } catch (error) {
    console.error('Error creating ticket in storage:', error)
    throw error
  }
}

// Обновить статус тикета в localStorage
export const updateTicketStatusInStorage = async (id: string, status: string): Promise<any> => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY)
    const tickets = stored ? JSON.parse(stored) : []

    const ticketIndex = tickets.findIndex((ticket: any) => ticket.id === id)
    
    if (ticketIndex === -1) {
      throw new Error('Тикет не найден')
    }

    tickets[ticketIndex].status = status
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))

    return tickets[ticketIndex]

  } catch (error) {
    console.error('Error updating ticket status in storage:', error)
    throw error
  }
}

// Очистить все тикеты (для отладки)
export const clearTicketsStorage = () => {
  try {
    localStorage.removeItem(TICKETS_STORAGE_KEY)
    console.log('🗑️ Cleared tickets from localStorage')
  } catch (error) {
    console.error('❌ Error clearing tickets from localStorage:', error)
  }
}

// Отладочная функция для проверки тикетов
export const debugTicketsStorage = () => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY)
    if (stored) {
      const tickets = JSON.parse(stored)
      console.log('🔍 Debug: All tickets in localStorage:', tickets)
      console.log('🔍 Debug: Tickets count:', tickets.length)
      tickets.forEach((ticket: any, index: number) => {
        console.log(`🔍 Debug: Ticket ${index + 1}:`, {
          id: ticket.id,
          title: ticket.title,
          company: ticket.company,
          user_email: ticket.user_email,
          status: ticket.status,
          created_at: ticket.created_at
        })
      })
      return tickets
    } else {
      console.log('🔍 Debug: No tickets found in localStorage')
      return []
    }
  } catch (error) {
    console.error('❌ Error debugging tickets from localStorage:', error)
    return []
  }
} 