import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { useTickets } from '@/contexts/TicketContext'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TestImage from '@/components/TestImage'
import TicketHistory from '@/components/TicketHistory'
import AdminLayout from '@/layouts/AdminLayout'
import CustomerManagerLayout from '@/layouts/CustomerManagerLayout'
import { getRegularUsersFromStorage } from '@/lib/localStorage'
import { ArrowLeft, Clock, User, Building, Calendar } from 'lucide-react'

export default function TicketHistoryPage() {
  const { t } = useTranslation()
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const { tickets } = useTickets()
  const { user } = useAuth()
  const [ticket, setTicket] = useState<any>(null)

  // Check if user is admin (root admin or customer)
  const isAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin' || user?.user_metadata?.role === 'customer'

  // Determine which layout to use based on user role
  const getLayout = () => {
    if (!user) return null
    
    const userRole = user.user_metadata?.role
    const isSuperAdmin = user?.email === 'admin' || userRole === 'super_admin'
    const isCustomer = userRole === 'customer'
    
    // Check if user is a customer manager by looking in localStorage
    const allUsers = getRegularUsersFromStorage()
    const isCustomerManager = allUsers.some(manager => 
      (manager.username === user.email || manager.email === user.email) && 
      manager.isCustomerManager === true
    )
    
    if (isSuperAdmin || isCustomer) {
      return AdminLayout
    } else if (isCustomerManager) {
      return CustomerManagerLayout
    } else {
      return null
    }
  }

  const Layout = getLayout()
  
  console.log('🔍 TicketHistoryPage - Layout selected:', Layout?.name)
  console.log('🔍 TicketHistoryPage - User email:', user?.email)
  console.log('🔍 TicketHistoryPage - User role:', user?.user_metadata?.role)
  
  // Debug customer manager detection
  if (user) {
    const allUsers = getRegularUsersFromStorage()
    const isCustomerManager = allUsers.some(manager => 
      manager.username === user.email || manager.email === user.email
    )
    console.log('🔍 TicketHistoryPage - Is customer manager:', isCustomerManager)
    console.log('🔍 TicketHistoryPage - All users:', allUsers.map(u => ({ username: u.username, email: u.email, isCustomerManager: u.isCustomerManager })))
  }

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      const foundTicket = tickets.find(t => t.id === ticketId)
      setTicket(foundTicket || null)
    }
  }, [ticketId, tickets])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return t('open')
      case 'in progress':
        return t('inProgress')
      case 'done':
        return t('done')
      default:
        return status
    }
  }

  const hasValidImage = (imageUrl: string) => {
    return imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined'
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('noAccess')}</h1>
          <p className="text-gray-600 mb-6">{t('noAccessMessage')}</p>
          <Button onClick={() => navigate('/')}>
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
          <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(user?.user_metadata?.role === 'customer_manager' ? '/customer-manager/dashboard' : '/admin')}>
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    )
  }

  if (!Layout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
          <Button onClick={() => navigate('/')}>
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(user?.user_metadata?.role === 'customer_manager' ? '/customer-manager/dashboard' : '/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToDashboard')}
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('ticketHistory')} - #{ticket.id}
                </h1>
                <p className="text-sm text-gray-500">
                  {ticket.title}
                </p>
              </div>
            </div>
            <Badge className={`text-sm ${getStatusColor(ticket.status)}`}>
              {getStatusText(ticket.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('ticketDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{ticket.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t('company')}</p>
                      <p className="text-sm text-gray-600">{ticket.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t('email')}</p>
                      <p className="text-sm text-gray-600">{ticket.user_email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t('created')}</p>
                      <p className="text-sm text-gray-600">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>
                  
                  {ticket.status === 'done' && ticket.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t('completed')}</p>
                        <p className="text-sm text-gray-600">{formatDate(ticket.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {hasValidImage(ticket.image) && (
                  <div>
                    <h4 className="font-medium mb-2">{t('photo')}</h4>
                    <TestImage 
                      src={ticket.image} 
                      alt="Ticket" 
                      className="w-full max-w-md object-cover rounded border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* History */}
          <div>
            <TicketHistory history={ticket.history || []} />
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
} 