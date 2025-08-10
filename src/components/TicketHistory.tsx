import { useTranslation } from 'react-i18next'
import { TicketHistory as TicketHistoryType } from '@/lib/mockTickets'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, User, MessageSquare } from 'lucide-react'

interface TicketHistoryProps {
  history: TicketHistoryType[]
}

export default function TicketHistory({ history }: TicketHistoryProps) {
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800'
      case 'status_changed':
        return 'bg-blue-100 text-blue-800'
      case 'commented':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'created':
        return t('ticketCreated')
      case 'status_changed':
        return t('statusChanged')
      case 'commented':
        return t('commentAdded')
      default:
        return action
    }
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

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Clock className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-center">{t('noHistoryAvailable')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t('ticketHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {index < history.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getActionColor(item.action)}`}>
                      {getActionText(item.action)}
                    </Badge>
                    {item.action === 'status_changed' && (
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {t(item.status)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.user}
                  </span>
                </div>
                
                {item.comment && (
                  <div className="flex gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {item.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 