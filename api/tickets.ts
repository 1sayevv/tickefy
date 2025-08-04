import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

// Типы данных
interface Ticket {
  id: string
  title: string
  description: string
  image_url?: string
  user_id: string
  company: string
  status: 'open' | 'in_progress' | 'completed'
  created_at: string
}

// Получить все тикеты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const company = searchParams.get('company')
    const status = searchParams.get('status')

    // Получаем все тикеты из KV
    const tickets = await kv.get('tickets') as Ticket[] || []

    // Фильтруем по компании и статусу
    let filteredTickets = tickets

    if (company) {
      filteredTickets = filteredTickets.filter(ticket => ticket.company === company)
    }

    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status)
    }

    return NextResponse.json(filteredTickets)

  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Ошибка получения тикетов' },
      { status: 500 }
    )
  }
}

// Создать новый тикет
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url, user_id, company } = body

    // Валидация
    if (!title || !description || !user_id || !company) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      )
    }

    // Создаем новый тикет
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title,
      description,
      image_url,
      user_id,
      company,
      status: 'open',
      created_at: new Date().toISOString()
    }

    // Получаем существующие тикеты
    const tickets = await kv.get('tickets') as Ticket[] || []

    // Добавляем новый тикет
    tickets.push(newTicket)

    // Сохраняем в KV
    await kv.set('tickets', tickets)

    return NextResponse.json(newTicket, { status: 201 })

  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Ошибка создания тикета' },
      { status: 500 }
    )
  }
}

// Обновить статус тикета
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID и статус обязательны' },
        { status: 400 }
      )
    }

    // Получаем все тикеты
    const tickets = await kv.get('tickets') as Ticket[] || []

    // Находим и обновляем тикет
    const ticketIndex = tickets.findIndex(ticket => ticket.id === id)
    
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Тикет не найден' },
        { status: 404 }
      )
    }

    tickets[ticketIndex].status = status

    // Сохраняем обновленные тикеты
    await kv.set('tickets', tickets)

    return NextResponse.json(tickets[ticketIndex])

  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления тикета' },
      { status: 500 }
    )
  }
} 