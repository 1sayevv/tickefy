import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TicketCard from '@/components/TicketCard'
import MainLayout from '@/layouts/MainLayout'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, profile, signOut, getUserDisplayName, getUserCompany } = useAuth()
  const { tickets, loading, getStatusCount, getTotalCount } = useTickets()

  // Проверяем, является ли пользователь админом
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                  user?.email === 'admin@example.com'

  const handleSignOut = async () => {
    await signOut()
  }

  // Функции для подсчета тикетов по статусам
  const getOpenCount = () => getStatusCount('open')
  const getInProgressCount = () => getStatusCount('in progress')
  const getDoneCount = () => getStatusCount('done')

  // Если пользователь админ, не показываем dashboard
  if (isAdmin) {
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header с информацией о пользователе */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('dashboard')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('welcome')}, {getUserDisplayName()}!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge variant="secondary" className="text-sm w-fit">
                {getUserCompany()}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                {t('logout')}
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

        {/* Секция тикетов */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold">{t('myTickets')}</h2>
            <Link to="/create-ticket">
              <Button className="w-full sm:w-auto">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('createTicket')}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">{t('loadingTickets')}</span>
            </div>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">{t('noTickets')}</h3>
                <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                  {t('noTicketsDescription')}
                </p>
                <Link to="/create-ticket">
                  <Button className="w-full sm:w-auto">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('createFirstTicket')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Информация о профиле */}
        {profile && (
          <div className="mt-8 sm:mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{t('profileInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('email')}</label>
                    <p className="text-xs sm:text-sm">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('fullName')}</label>
                    <p className="text-xs sm:text-sm">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('companyName')}</label>
                    <p className="text-xs sm:text-sm">{profile.company}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">{t('registrationDate')}</label>
                    <p className="text-xs sm:text-sm">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
} 