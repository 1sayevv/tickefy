import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAllTickets, getTicketsByCompany, type Ticket } from '@/lib/mockTickets'
import { useAuth } from './AuthContext'
import { getTicketsFromStorage } from '@/lib/vercelStorage'

interface TicketContextType {
  tickets: Ticket[]
  loading: boolean
  updateTicketStatus: (ticketId: string, newStatus: Ticket['status']) => void
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
      
      // Проверяем роль пользователя
      const isSuperAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin'
      const isCustomer = user?.user_metadata?.role === 'customer' || !!sessionStorage.getItem('currentCustomer')
      const isRegularUser = user?.user_metadata?.role === 'user'
      
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
          // Используем mock данные напрямую для customers и regular users
          allTickets = await getTicketsByCompany(company)
          console.log(`✅ Loaded ${allTickets.length} tickets for company "${company}"`)
        } else {
          console.log('⚠️ No company found for user, showing empty tickets')
          allTickets = []
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
          ? { ...ticket, status: newStatus }
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