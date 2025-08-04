import { useTranslation } from 'react-i18next'
import { Ticket } from '@/lib/mockTickets'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TestImage from './TestImage'

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
  
  // Проверяем, что это не placeholder и не пустая строка
  const invalidUrls = [
    'https://via.placeholder.com',
    'placeholder.com',
    'data:image/svg+xml',
    ''
  ]
  
  // Проверяем, что это не object URL (blob:)
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {ticket.title}
          </CardTitle>
          <div className="flex flex-col gap-2 ml-4">
            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
              {t(getStatusText(ticket.status))}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-start space-x-4">
          {hasValidImage(ticket.image) ? (
            <TestImage 
              src={ticket.image} 
              alt="Ticket" 
              className="w-16 h-16 object-cover rounded border"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {ticket.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>{t('created')}: {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  #{ticket.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 