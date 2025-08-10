import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TicketCard from '@/components/TicketCard'
import MainLayout from '@/layouts/MainLayout'
import { Link } from 'react-router-dom'

export default function CustomerTickets() {
  const { t } = useTranslation()
  const { user, getUserDisplayName, getUserCompany } = useAuth()
  const { tickets, loading, getStatusCount, getTotalCount } = useTickets()

  // Функции для подсчета тикетов по статусам
  const getOpenCount = () => getStatusCount('open')
  const getInProgressCount = () => getStatusCount('in progress')
  const getDoneCount = () => getStatusCount('done')

  return (
    <MainLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {t('allTickets')}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                {t('manageTicketsForCompany')}: {getUserCompany()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {getUserCompany()}
              </Badge>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/create-ticket">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('createTicket')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t('totalTickets')}</CardTitle>
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getTotalCount()}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t('open')}</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {getOpenCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getOpenCount()}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t('inProgress')}</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                {getInProgressCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getInProgressCount()}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t('done')}</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {getDoneCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getDoneCount()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Список тикетов */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {t('allTickets')}
            </h2>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/create-ticket">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('createTicket')}
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">{t('loading')}</p>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-muted rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2 sm:mb-3 text-center">{t('noTickets')}</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                  {t('noTicketsDescription')}
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/create-ticket">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('createFirstTicket')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
} 