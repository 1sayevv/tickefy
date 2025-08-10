import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import AdminCharts from '@/components/AdminCharts'
import RecentTickets from '@/components/RecentTickets'
import CompanyFilter from '@/components/CompanyFilter'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'


export default function Admin() {
  const { t } = useTranslation()
  const { user, getUserCompany } = useAuth()

  const navigate = useNavigate()

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



  return (
    <AdminLayout>
      <div className="w-full">
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