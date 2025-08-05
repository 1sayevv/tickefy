export interface Ticket {
  id: string
  title: string
  description: string
  company: "Nike" | "Adidas"
  status: "open" | "in progress" | "done"
  image: string
  createdAt: string
  user_email: string
}

// Глобальный массив тикетов
let mockTickets: Ticket[] = [
  // Nike tickets
  {
    id: "1",
    title: "Обновление дизайна главной страницы",
    description: "Необходимо обновить дизайн главной страницы сайта Nike с учетом новых брендинговых требований и улучшить пользовательский опыт",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=1",
    createdAt: "2024-01-15T10:00:00Z",
    user_email: "user1@examplemail.com"
  },
  {
    id: "2",
    title: "Исправление бага в корзине",
    description: "Пользователи не могут добавить товары в корзину на мобильных устройствах. Требуется срочное исправление для улучшения конверсии",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=2",
    createdAt: "2024-01-18T09:15:00Z",
    user_email: "user1@examplemail.com"
  },
  {
    id: "3",
    title: "Оптимизация загрузки изображений",
    description: "Необходимо оптимизировать загрузку изображений товаров для улучшения производительности сайта и ускорения загрузки страниц",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=3",
    createdAt: "2024-01-10T11:00:00Z",
    user_email: "user1@examplemail.com"
  },
  {
    id: "4",
    title: "Добавление новых категорий товаров",
    description: "Требуется добавить новые категории товаров в каталог и настроить фильтрацию для улучшения навигации пользователей",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=4",
    createdAt: "2024-01-22T13:20:00Z",
    user_email: "user1@examplemail.com"
  },
  // Adidas tickets
  {
    id: "5",
    title: "Интеграция с платежной системой",
    description: "Необходимо интегрировать новую платежную систему для обработки заказов и улучшения безопасности транзакций",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=5",
    createdAt: "2024-01-16T08:30:00Z",
    user_email: "user2@examplemail.com"
  },
  {
    id: "6",
    title: "Создание мобильного приложения",
    description: "Разработка мобильного приложения для iOS и Android с полным функционалом интернет-магазина",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=6",
    createdAt: "2024-01-19T12:00:00Z",
    user_email: "user2@examplemail.com"
  },
  {
    id: "7",
    title: "Обновление системы уведомлений",
    description: "Улучшение системы email-уведомлений для клиентов с персонализированным контентом и автоматизацией",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=7",
    createdAt: "2024-01-08T14:15:00Z",
    user_email: "user2@examplemail.com"
  },
  {
    id: "8",
    title: "Аналитика продаж",
    description: "Создание дашборда для анализа продаж и отчетности с интеграцией с CRM системой",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=8",
    createdAt: "2024-01-23T09:45:00Z",
    user_email: "user2@examplemail.com"
  }
]

export const getTicketsByCompany = async (company: string): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Loading tickets for company: ${company}`)
  const filteredTickets = mockTickets.filter(ticket => ticket.company === company)
  console.log(`Found ${filteredTickets.length} tickets for ${company}`)
  return filteredTickets
}

export const getAllTickets = async (): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Loading all tickets: ${mockTickets.length} total`)
  return mockTickets
}

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('Creating ticket with data:', ticketData)
  
  const newTicket: Ticket = {
    id: String(mockTickets.length + 1),
    ...ticketData,
    createdAt: new Date().toISOString()
  }
  
  console.log('New ticket created:', newTicket)
  
  // Добавляем новый тикет в глобальный массив
  mockTickets.push(newTicket)
  
  console.log('New ticket created:', newTicket)
  console.log('Total tickets:', mockTickets.length)
  
  return newTicket
}

// Функция для получения текущего состояния тикетов (для отладки)
export const getCurrentTickets = () => {
  return mockTickets
} 