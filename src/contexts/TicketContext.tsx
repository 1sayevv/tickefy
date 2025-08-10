import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAllTickets, getTicketsByCompany, type Ticket } from '@/lib/mockTickets'
import { useAuth } from './AuthContext'
import { getTicketsFromStorage, debugTicketsStorage } from '@/lib/vercelStorage'

interface TicketContextType {
  tickets: Ticket[]
  loading: boolean
  updateTicketStatus: (ticketId: string, newStatus: Ticket['status']) => void
  deactivateTicket: (ticketId: string) => void
  activateTicket: (ticketId: string) => void
  refreshTickets: () => Promise<void>
  getStatusCount: (status: Ticket['status']) => number
  getTotalCount: () => number
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

interface TicketProviderProps {
  children: ReactNode
}

export function TicketProvider({ children }: TicketProviderProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const { user, getUserCompany } = useAuth()

  const loadTickets = async () => {
    setLoading(true)
    try {
      let allTickets: Ticket[] = []
      
      // Check user role
      const isSuperAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin'
      const isCustomer = user?.user_metadata?.role === 'customer' || !!sessionStorage.getItem('currentCustomer')
      const isRegularUser = user?.user_metadata?.role === 'user'
      
      console.log('🔍 TicketContext - User role check:', {
        userEmail: user?.email,
        userRole: user?.user_metadata?.role,
        isSuperAdmin,
        isCustomer,
        isRegularUser,
        hasSessionCustomer: !!sessionStorage.getItem('currentCustomer')
      })
      
      console.log('🔍 User info:', { 
        email: user?.email, 
        role: user?.user_metadata?.role, 
        isSuperAdmin,
        isCustomer,
        isRegularUser
      })
      
      if (isSuperAdmin) {
        // Root Admin видит все тикеты
        console.log('👑 Loading all tickets for root admin')
        allTickets = await getAllTickets()
      } else if (isCustomer || isRegularUser) {
        // Customer и Regular User видят только тикеты своей компании
        const company = getUserCompany()
        console.log(`🔍 Loading tickets for ${isCustomer ? 'customer' : 'regular user'} from company:`, company)
        
        if (company) {
          // Сначала пробуем загрузить из localStorage
          console.log('🔍 Attempting to load tickets from localStorage...')
          const localStorageTickets = await getTicketsFromStorage()
          console.log('🔍 Tickets from localStorage:', localStorageTickets)
          
          // Фильтруем тикеты по компании
          const companyTickets = localStorageTickets.filter((ticket: any) => ticket.company === company)
          console.log(`🔍 Filtered tickets for company "${company}":`, companyTickets)
          
          if (companyTickets.length > 0) {
            // Преобразуем в формат Ticket
            allTickets = companyTickets.map((ticket: any) => ({
              id: ticket.id,
              title: ticket.title,
              description: ticket.description,
              image: ticket.image_url, // Используем image_url как image
              image_url: ticket.image_url,
              status: ticket.status,
              company: ticket.company,
              user_email: ticket.user_email,
              created_at: ticket.created_at,
              createdAt: ticket.created_at
            }))
            console.log(`✅ Loaded ${allTickets.length} tickets from localStorage for company "${company}"`)
          } else {
            // Если в localStorage нет тикетов, используем mock данные
            console.log('🔍 No tickets in localStorage, falling back to mock data...')
            allTickets = await getTicketsByCompany(company)
            console.log(`✅ Loaded ${allTickets.length} tickets from mock data for company "${company}"`)
          }
        } else {
          console.log('⚠️ No company found for user, showing empty tickets')
          allTickets = []
        }
        
        // Дополнительная проверка для customers из localStorage
        if (isCustomer && allTickets.length === 0) {
          const currentCustomerId = localStorage.getItem('currentCustomerId')
          if (currentCustomerId) {
            const customers = JSON.parse(localStorage.getItem('customers') || '[]')
            const customer = customers.find((c: any) => c.id === currentCustomerId)
            if (customer && customer.companyName) {
              console.log(`🔍 Retrying with customer company: ${customer.companyName}`)
              allTickets = await getTicketsByCompany(customer.companyName)
              console.log(`✅ Loaded ${allTickets.length} tickets for customer company "${customer.companyName}"`)
            }
          }
        }
        
        // Дополнительная проверка для regular users из localStorage
        if (isRegularUser && allTickets.length === 0) {
          const currentRegularUserId = localStorage.getItem('currentRegularUserId')
          if (currentRegularUserId) {
            const regularUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]')
            const regularUser = regularUsers.find((u: any) => u.id === currentRegularUserId)
            if (regularUser && regularUser.companyName) {
              console.log(`🔍 Retrying with regular user company: ${regularUser.companyName}`)
              allTickets = await getTicketsByCompany(regularUser.companyName)
              console.log(`✅ Loaded ${allTickets.length} tickets for regular user company "${regularUser.companyName}"`)
            }
          }
        }
        
        // Если currentCustomerId пуст или customer не найден, логируем это
        if (isCustomer && !localStorage.getItem('currentCustomerId')) {
          console.log('❌ No currentCustomerId found for customer')
        }
        
        // Если currentRegularUserId пуст или regular user не найден, логируем это
        if (isRegularUser && !localStorage.getItem('currentRegularUserId')) {
          console.log('❌ No currentRegularUserId found for regular user')
        }
      } else {
        // Fallback для других ролей
        console.log('⚠️ Unknown role, showing empty tickets')
        allTickets = []
      }
      
      console.log('✅ TicketContext - Loaded tickets:', allTickets.length)
      console.log('📊 Sample tickets:', allTickets.slice(0, 3).map(t => ({ 
        id: t.id, 
        title: t.title,
        createdAt: t.createdAt,
        company: t.company 
      })))
      
      // Отладочная информация
      console.log('🔍 Debugging all tickets in localStorage...')
      debugTicketsStorage()
      
      setTickets(allTickets)
    } catch (error) {
      console.error('❌ Error loading tickets:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTickets()
    }
  }, [user, getUserCompany])

  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { 
              ...ticket, 
              status: newStatus,
              history: [
                ...(ticket.history || []),
                {
                  id: `${ticketId}-${Date.now()}`,
                  action: 'status_changed',
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  user: user?.email || 'admin',
                  comment: `Status changed to ${newStatus}`
                }
              ]
            }
          : ticket
      )
    )
  }

  const deactivateTicket = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { 
              ...ticket, 
              isDeactivated: true,
              history: [
                ...(ticket.history || []),
                {
                  id: `${ticketId}-${Date.now()}`,
                  action: 'deactivated',
                  status: ticket.status,
                  timestamp: new Date().toISOString(),
                  user: user?.email || 'customer',
                  comment: 'Ticket deactivated by customer'
                }
              ]
            }
          : ticket
      )
    )
  }

  const activateTicket = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { 
              ...ticket, 
              isDeactivated: false,
              history: [
                ...(ticket.history || []),
                {
                  id: `${ticketId}-${Date.now()}`,
                  action: 'activated',
                  status: ticket.status,
                  timestamp: new Date().toISOString(),
                  user: user?.email || 'customer',
                  comment: 'Ticket activated by customer'
                }
              ]
            }
          : ticket
      )
    )
  }

  const refreshTickets = async () => {
    console.log('🔄 Refreshing tickets...')
    await loadTickets()
  }

  const getStatusCount = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status).length
  }

  const getTotalCount = () => {
    return tickets.length
  }

  const value: TicketContextType = {
    tickets,
    loading,
    updateTicketStatus,
    deactivateTicket,
    activateTicket,
    refreshTickets,
    getStatusCount,
    getTotalCount
  }

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider')
  }
  return context
} 