import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '@/layouts/AdminLayout'
import AdminCharts from '@/components/AdminCharts'
import RecentTickets from '@/components/RecentTickets'
import CompanyFilter from '@/components/CompanyFilter'

export default function Admin() {
  const { t } = useTranslation()
  const [selectedCompany, setSelectedCompany] = useState('all')

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h2>
              <p className="text-gray-600 mt-2">
                {t('systemOverview')}
              </p>
            </div>
            
            {/* Фильтр компаний */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{t('filterByCompany')}:</span>
              <CompanyFilter 
                selectedCompany={selectedCompany}
                onCompanyChange={setSelectedCompany}
              />
            </div>
          </div>
        </div>

        {/* Приветственный блок */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('welcomeAdmin')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('adminPanelDescription')}
            </p>
          </div>
        </div>

        {/* Графики и последние тикеты */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Графики */}
          <div className="lg:col-span-2">
            <AdminCharts selectedCompany={selectedCompany} />
          </div>
          
          {/* Последние тикеты */}
          <div className="lg:col-span-1">
            <RecentTickets selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 