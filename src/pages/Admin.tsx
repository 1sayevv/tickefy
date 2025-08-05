import { useTranslation } from 'react-i18next'
import AdminLayout from '@/layouts/AdminLayout'
import AdminCharts from '@/components/AdminCharts'
import RecentTickets from '@/components/RecentTickets'

export default function Admin() {
  const { t } = useTranslation()

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h2>
          <p className="text-gray-600 mt-2">
            {t('systemOverview')}
          </p>
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
            <AdminCharts />
          </div>
          
          {/* Последние тикеты */}
          <div className="lg:col-span-1">
            <RecentTickets />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 