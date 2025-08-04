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
export const getTicketsFromStorage = async (company?: string, status?: string): Promise<any[]> => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY)
    const tickets = stored ? JSON.parse(stored) : []
    
    let filteredTickets = tickets

    if (company) {
      filteredTickets = filteredTickets.filter((ticket: any) => ticket.company === company)
    }

    if (status) {
      filteredTickets = filteredTickets.filter((ticket: any) => ticket.status === status)
    }

    return filteredTickets

  } catch (error) {
    console.error('Error fetching tickets from storage:', error)
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
  localStorage.removeItem(TICKETS_STORAGE_KEY)
  console.log('Tickets storage cleared')
} 