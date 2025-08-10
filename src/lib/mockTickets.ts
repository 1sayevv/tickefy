export interface TicketHistory {
  id: string
  action: string
  status: string
  timestamp: string
  user: string
  comment?: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  company: "Nike" | "Adidas"
  status: "open" | "in progress" | "done"
  image: string
  createdAt: string
  user_email: string
  history?: TicketHistory[]
  isDeactivated?: boolean // New field to track if ticket is deactivated
}

// Глобальный массив тикетов
let mockTickets: Ticket[] = [
  // Nike tickets (7 тикетов)
  {
    id: "1",
    title: "Update main page design",
    description: "Need to update the main page design of the Nike website taking into account new branding requirements and improve user experience",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=1",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
    user_email: "user1",
    history: [
      {
        id: "1-1",
        action: "created",
        status: "open",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        user: "user1",
        comment: "Initial ticket creation"
      },
      {
        id: "1-2",
        action: "status_changed",
        status: "in progress",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Started working on design updates"
      }
    ]
  },
  {
    id: "2",
    title: "Fix shopping cart bug",
    description: "Users cannot add items to cart on mobile devices. Urgent fix needed to improve conversion",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=2",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    user_email: "user1"
  },
  {
    id: "3",
    title: "Optimize image loading",
    description: "Need to optimize product image loading to improve site performance and speed up page loading",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    user_email: "user1",
    history: [
      {
        id: "3-1",
        action: "created",
        status: "open",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: "user1",
        comment: "Performance optimization needed"
      },
      {
        id: "3-2",
        action: "status_changed",
        status: "in progress",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Started image optimization implementation"
      },
      {
        id: "3-3",
        action: "status_changed",
        status: "done",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: "admin",
        comment: "Image optimization completed successfully"
      }
    ]
  },
  {
    id: "4",
    title: "Add new product categories",
    description: "Need to add new product categories to catalog and configure filtering to improve user navigation",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=4",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    user_email: "user1"
  },
  {
    id: "5",
    title: "Integrate loyalty system",
    description: "Development of bonus points and discount system for regular customers with integration into personal account",
    company: "Nike",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=5",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    user_email: "user1"
  },
  {
    id: "6",
    title: "Create review system",
    description: "Implementation of product review and rating system with moderation and spam filtering",
    company: "Nike",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=6",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user_email: "user1"
  },
  {
    id: "7",
    title: "Improve product search",
    description: "Adding smart search with autocomplete, filters by size, color and price for customer convenience",
    company: "Nike",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=7",
    createdAt: new Date().toISOString(), // Today
    user_email: "user1"
  },
  // Adidas tickets (7 тикетов)
  {
    id: "8",
    title: "Integrate payment system",
    description: "Need to integrate new payment system for order processing and improve transaction security",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=8",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    user_email: "user2"
  },
  {
    id: "9",
    title: "Create mobile application",
    description: "Development of mobile application for iOS and Android with full e-commerce functionality",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=9",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    user_email: "user2"
  },
  {
    id: "10",
    title: "Update notification system",
    description: "Improving email notification system for customers with personalized content and automation",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=10",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    user_email: "user2"
  },
  {
    id: "11",
    title: "Sales analytics",
    description: "Creating dashboard for sales analysis and reporting with CRM system integration",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=11",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    user_email: "user2"
  },
  {
    id: "12",
    title: "Warehouse management system",
    description: "Development of warehouse inventory system with automatic stock updates and low quantity notifications",
    company: "Adidas",
    status: "in progress",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=12",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    user_email: "user2"
  },
  {
    id: "13",
    title: "Social media integration",
    description: "Adding social media login capability and product sharing in social networks",
    company: "Adidas",
    status: "open",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=13",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user_email: "user2"
  },
  {
    id: "14",
    title: "Personal recommendation system",
    description: "Implementing machine learning algorithm for personal product recommendations based on purchase history",
    company: "Adidas",
    status: "done",
    image: "https://httpbin.org/image/png?width=400&height=300&seed=14",
    createdAt: new Date().toISOString(), // Today
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