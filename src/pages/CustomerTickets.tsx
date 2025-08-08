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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('allTickets')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('manageTicketsForCompany')}: {getUserCompany()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge variant="secondary" className="text-sm w-fit">
                {getUserCompany()}
              </Badge>
              <Button asChild>
                <Link to="/create-ticket">
                  {t('createTicket')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">
              {t('allTickets')}
            </h2>
            <Button asChild>
              <Link to="/create-ticket">
                {t('createTicket')}
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">{t('loading')}</p>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTickets')}</h3>
                <p className="text-gray-600 mb-4">{t('noTicketsDescription')}</p>
                <Button asChild>
                  <Link to="/create-ticket">
                    {t('createFirstTicket')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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