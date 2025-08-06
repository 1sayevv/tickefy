import { useTranslation } from 'react-i18next'
import { useTickets } from '@/contexts/TicketContext'
import { Badge } from '@/components/ui/badge'

interface RecentTicketsProps {
  selectedCompany: string
}

export default function RecentTickets({ selectedCompany }: RecentTicketsProps) {
  const { t } = useTranslation()
  const { tickets } = useTickets()

  // Фильтруем тикеты по выбранной компании
  const filteredTickets = selectedCompany === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.company === selectedCompany)

  // Получаем последние 5 тикетов, отсортированных по дате создания
  const recentTickets = filteredTickets
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for ticket:', dateString)
      return 'Invalid date'
    }
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 break-words">
          {t('recentTickets')}
          {selectedCompany !== 'all' && (
            <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1 sm:ml-2">
              ({t(selectedCompany.toLowerCase())})
            </span>
          )}
        </h3>
        <span className="text-xs sm:text-sm text-gray-500">
          {t('showing')} {recentTickets.length} {t('of')} {filteredTickets.length}
        </span>
      </div>

      {recentTickets.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm sm:text-base text-gray-500">{t('noRecentTickets')}</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {recentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
            >
              <div className="space-y-3">
                {/* Заголовок и статус */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <h4 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 break-words flex-1 min-w-0 pr-2">
                    {ticket.title}
                  </h4>
                  <Badge className={`text-xs px-2 py-1 flex-shrink-0 ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </Badge>
                </div>
                
                {/* Информация о тикете */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Компания и пользователь */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{t('company')}:</span>
                      <span className="text-xs sm:text-sm text-gray-800 truncate">{ticket.company}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 min-w-0">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{t('email')}:</span>
                      <span className="text-xs sm:text-sm text-gray-800 truncate">{ticket.user_email || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Дата создания */}
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">{t('created')}:</span>
                    <span className="text-xs sm:text-sm text-gray-800">{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                
                {/* Описание */}
                {ticket.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 break-words">
                      {ticket.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 