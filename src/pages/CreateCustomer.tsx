import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createCustomer } from '@/lib/mockAuth'
import AdminLayout from '@/layouts/AdminLayout'

export default function CreateCustomer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Состояние для информации о клиенте
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    status: 'active' as 'active' | 'inactive'
  })

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createCustomer(customerData)
      
      // Показываем уведомление об успехе
      showNotification('success', t('customerCreated'))
      
      // Перенаправляем обратно на список клиентов
      setTimeout(() => {
        navigate('/super-admin')
      }, 1500)

    } catch (error) {
      console.error('Error creating customer:', error)
      setError(t('errorCreatingCustomer'))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/super-admin')
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    // Создаем временное уведомление
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('createCustomer')}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">{t('createCustomerDescription')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{t('customerInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t('fullName')} *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={customerData.name}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={t('fullName')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    {t('company')} *
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={customerData.company}
                    onChange={(e) => handleCustomerChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={t('company')}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('email')} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="customer@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t('phone')} *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+994 (50) 123-45-67"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  {t('password')} *
                </label>
                <input
                  id="password"
                  type="password"
                  value={customerData.password}
                  onChange={(e) => handleCustomerChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={t('password')}
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                  {t('status')}
                </label>
                <select
                  id="status"
                  value={customerData.status}
                  onChange={(e) => handleCustomerChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? t('creating') : t('create')}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 