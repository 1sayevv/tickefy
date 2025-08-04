import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAllTickets, getTicketsByCompany, type Ticket } from '@/lib/mockTickets'
import { useAuth } from './AuthContext'

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
      let allTickets: Ticket[]
      
      // Если пользователь админ, загружаем все тикеты
      const isAdmin = user?.email === 'admin@example.com' || 
                      user?.user_metadata?.role === 'admin'
      
      if (isAdmin) {
        allTickets = await getAllTickets()
      } else {
        // Если обычный пользователь, загружаем только тикеты его компании
        const company = getUserCompany()
        if (company) {
          allTickets = await getTicketsByCompany(company)
        } else {
          allTickets = []
        }
      }
      
      console.log('TicketContext - Loaded tickets:', allTickets.length)
      console.log('TicketContext - Sample ticket images:', allTickets.slice(0, 3).map(t => ({ id: t.id, image: t.image })))
      setTickets(allTickets)
    } catch (error) {
      console.error('Ошибка загрузки тикетов:', error)
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
    console.log('Refreshing tickets...')
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