import { useTranslation } from 'react-i18next'
import AdminLayout from '@/layouts/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminTicketTable from '@/components/AdminTicketTable'
import { useTickets } from '@/contexts/TicketContext'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminTickets() {
  const { t } = useTranslation()
  const { getStatusCount, getTotalCount } = useTickets()
  const { user } = useAuth()
  
  const isCustomer = user?.user_metadata?.role === 'customer'

  // Функции для подсчета тикетов по статусам
  const getOpenCount = () => getStatusCount('open')
  const getInProgressCount = () => getStatusCount('in progress')
  const getDoneCount = () => getStatusCount('done')

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('allTickets')}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isCustomer ? `${t('manageAllTickets')} - ${user?.user_metadata?.company}` : t('manageAllTickets')}
          </p>
        </div>

        {/* Статистика */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalTickets')}</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('open')}</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getOpenCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getOpenCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inProgress')}</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {getInProgressCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getInProgressCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('done')}</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {getDoneCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getDoneCount()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица тикетов */}
        <AdminTicketTable />
      </div>
    </AdminLayout>
  )
} 