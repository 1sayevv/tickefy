import { useTranslation } from 'react-i18next'
import { Ticket } from '@/lib/mockTickets'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TestImage from './TestImage'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { useNavigate } from 'react-router-dom'
import { getRegularUsersFromStorage } from '@/lib/localStorage'

interface TicketCardProps {
  ticket: Ticket
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
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
      return 'open'
    case 'in progress':
      return 'inProgress'
    case 'done':
      return 'done'
    default:
      return status
  }
}

// Улучшенная функция проверки валидного изображения
const hasValidImage = (imageUrl: string) => {
  if (!imageUrl || imageUrl.trim() === '') {
    console.log('Empty image URL')
    return false
  }
  
      // Check that it's not a placeholder and not empty string
  const invalidUrls = [
    'https://via.placeholder.com',
    'placeholder.com',
    'data:image/svg+xml',
    ''
  ]
  
      // Check that it's not an object URL (blob:)
  if (imageUrl.startsWith('blob:')) {
    console.log('Valid object URL:', imageUrl)
    return true
  }
  
  const isValid = !invalidUrls.some(invalid => imageUrl.includes(invalid))
  console.log('Checking image URL:', imageUrl, 'isValid:', isValid)
  return isValid
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { deactivateTicket, activateTicket } = useTickets()
  const navigate = useNavigate()
  
  // Check if user is admin (root admin or customer)
  const isAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin' || user?.user_metadata?.role === 'customer'
  
  // Check if user is a customer manager
  const allUsers = getRegularUsersFromStorage()
  const isCustomerManager = allUsers.some(manager => 
    (manager.username === user?.email || manager.email === user?.email) && 
    manager.isCustomerManager === true
  )
  
  // Check if user is a customer (not customer manager)
  const isCustomer = user?.user_metadata?.role === 'customer' && !isCustomerManager

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm sm:text-lg font-semibold line-clamp-2 flex-1 mr-2">
            {ticket.title}
          </CardTitle>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
              {t(getStatusText(ticket.status))}
            </Badge>
            {ticket.isDeactivated && (
              <Badge className="text-xs bg-red-100 text-red-800">
                Deactivated
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          {hasValidImage(ticket.image) ? (
            <TestImage 
              src={ticket.image} 
              alt="Ticket" 
              className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded border"
            />
          ) : (
            <div className="w-full sm:w-16 h-32 sm:h-16 bg-gray-100 rounded border flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
              {ticket.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-xs">{t('created')}: {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  #{ticket.id}
                </span>
                {isAdmin && ticket.history && ticket.history.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/ticket/${ticket.id}/history`)
                    }}
                    className="text-xs"
                  >
                    {t('viewHistory')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
                {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {/* Customer Manager Actions - Can change status */}
          {isCustomerManager && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/ticket/${ticket.id}/history`)
                }}
                className="text-xs"
              >
                {t('viewHistory')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  // Navigate to status change page or open modal
                  navigate(`/ticket/${ticket.id}/edit`)
                }}
                className="text-xs"
              >
                Change Status
              </Button>
            </div>
          )}
          
          {/* Customer Actions - Can only deactivate/activate open tickets */}
          {isCustomer && (
            <div className="flex gap-2">
              {ticket.status === 'open' && !ticket.isDeactivated && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    deactivateTicket(ticket.id)
                  }}
                  className="text-xs"
                >
                  Deactivate
                </Button>
              )}
              {ticket.status === 'open' && ticket.isDeactivated && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    activateTicket(ticket.id)
                  }}
                  className="text-xs"
                >
                  Activate
                </Button>
              )}
              {ticket.status !== 'open' && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  Cannot deactivate non-open tickets
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  )
} 