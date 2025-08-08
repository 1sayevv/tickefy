import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import AdminCharts from '@/components/AdminCharts'
import RecentTickets from '@/components/RecentTickets'
import CompanyFilter from '@/components/CompanyFilter'
import { Button } from '@/components/ui/button'
import { Users, RefreshCw } from 'lucide-react'
import { clearTicketsStorage } from '@/lib/vercelStorage'
import { useTickets } from '@/contexts/TicketContext'

export default function Admin() {
  const { t } = useTranslation()
  const { user, getUserCompany } = useAuth()
  const { refreshTickets } = useTickets()
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check if user is root admin
  const isSuperAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin'
  const isCustomer = user?.user_metadata?.role === 'customer'
  
  // Для Customer автоматически устанавливаем его компанию, для Root Admin - все компании
  const [selectedCompany, setSelectedCompany] = useState(() => {
    if (isCustomer) {
      return getUserCompany() || 'all'
    }
    return 'all'
  })

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      // Очищаем localStorage
      clearTicketsStorage()
      // Обновляем данные
      await refreshTickets()
      console.log('✅ Data refreshed successfully')
    } catch (error) {
      console.error('❌ Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard')}</h2>
              <p className="text-gray-600 mt-2">
                {t('systemOverview')}
              </p>
            </div>
            
            {/* Фильтр компаний и кнопки управления */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Показываем фильтр компаний только для Root Admin */}
              {isSuperAdmin && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">{t('filterByCompany')}:</span>
                  <CompanyFilter 
                    selectedCompany={selectedCompany}
                    onCompanyChange={setSelectedCompany}
                  />
                </div>
              )}
              
              {/* Кнопка обновления данных */}
              <Button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('refreshData')}</span>
                <span className="sm:hidden">{t('refreshData')}</span>
              </Button>
              
              {/* Кнопка управления клиентами (только для корневого админа) */}
              {isSuperAdmin && (
                <Button
                  onClick={() => navigate('/super-admin')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('manageCustomers')}</span>
                  <span className="sm:hidden">{t('manageCustomers')}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Приветственный блок */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {user?.user_metadata?.role === 'customer' ? t('customerPanelTitle') : t('welcomeAdmin')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
              {isCustomer ? t('customerPanelDescription') : t('adminPanelDescription')}
            </p>
          </div>
        </div>

        {/* Графики и последние тикеты */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Графики */}
          <div className="xl:col-span-2">
            <AdminCharts selectedCompany={selectedCompany} />
          </div>
          
          {/* Последние тикеты */}
          <div className="xl:col-span-1">
            <RecentTickets selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 