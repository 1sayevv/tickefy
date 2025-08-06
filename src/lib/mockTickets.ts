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
  // Nike tickets (7 тикетов)
  {
    id: "1",
    title: "Обновление дизайна главной страницы",
    description: "Необходимо обновить дизайн главной страницы сайта Nike с учетом новых брендинговых требований и улучшить пользовательский опыт",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=1",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 дней назад
    user_email: "user1"
  },
  {
    id: "2",
    title: "Исправление бага в корзине",
    description: "Пользователи не могут добавить товары в корзину на мобильных устройствах. Требуется срочное исправление для улучшения конверсии",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=2",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 дней назад
    user_email: "user1"
  },
  {
    id: "3",
    title: "Оптимизация загрузки изображений",
    description: "Необходимо оптимизировать загрузку изображений товаров для улучшения производительности сайта и ускорения загрузки страниц",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 дней назад
    user_email: "user1"
  },
  {
    id: "4",
    title: "Добавление новых категорий товаров",
    description: "Требуется добавить новые категории товаров в каталог и настроить фильтрацию для улучшения навигации пользователей",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=4",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 дней назад
    user_email: "user1"
  },
  {
    id: "5",
    title: "Интеграция с системой лояльности",
    description: "Разработка системы бонусных баллов и скидок для постоянных клиентов с интеграцией в личный кабинет",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=5",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 дня назад
    user_email: "user1"
  },
  {
    id: "6",
    title: "Создание системы отзывов",
    description: "Реализация системы отзывов и рейтингов для товаров с модерацией и фильтрацией спама",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=6",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
    user_email: "user1"
  },
  {
    id: "7",
    title: "Улучшение поиска товаров",
    description: "Добавление умного поиска с автодополнением, фильтрами по размеру, цвету и цене для удобства покупателей",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=7",
    createdAt: new Date().toISOString(), // Сегодня
    user_email: "user1"
  },
  // Adidas tickets (7 тикетов)
  {
    id: "8",
    title: "Интеграция с платежной системой",
    description: "Необходимо интегрировать новую платежную систему для обработки заказов и улучшения безопасности транзакций",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=8",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 дней назад
    user_email: "user2"
  },
  {
    id: "9",
    title: "Создание мобильного приложения",
    description: "Разработка мобильного приложения для iOS и Android с полным функционалом интернет-магазина",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=9",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 дней назад
    user_email: "user2"
  },
  {
    id: "10",
    title: "Обновление системы уведомлений",
    description: "Улучшение системы email-уведомлений для клиентов с персонализированным контентом и автоматизацией",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=10",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 дней назад
    user_email: "user2"
  },
  {
    id: "11",
    title: "Аналитика продаж",
    description: "Создание дашборда для анализа продаж и отчетности с интеграцией с CRM системой",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=11",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 дня назад
    user_email: "user2"
  },
  {
    id: "12",
    title: "Система управления складом",
    description: "Разработка системы учета товаров на складе с автоматическим обновлением остатков и уведомлениями о низком количестве",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=12",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
    user_email: "user2"
  },
  {
    id: "13",
    title: "Интеграция с социальными сетями",
    description: "Добавление возможности авторизации через социальные сети и шаринга товаров в социальных сетях",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=13",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
    user_email: "user2"
  },
  {
    id: "14",
    title: "Система персональных рекомендаций",
    description: "Внедрение алгоритма машинного обучения для персональных рекомендаций товаров на основе истории покупок",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=14",
    createdAt: new Date().toISOString(), // Сегодня
    user_email: "user2"
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