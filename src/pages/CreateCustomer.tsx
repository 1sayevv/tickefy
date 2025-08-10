import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveCustomerToStorage } from '@/lib/localStorage'
import AdminLayout from '@/layouts/AdminLayout'
import { useToast } from '@/contexts/ToastContext'

export default function CreateCustomer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)

  // Состояние для информации о компании
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    phone: '',
    clientSince: ''
  })

  // Состояние для информации о клиенте
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    login: '',
    position: '',
    username: '',
    password: ''
  })

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Валидация всех полей
    const requiredFields = {
      companyName: companyData.name,
      address: companyData.address,
      phoneNumber: companyData.phone,
      customerSince: companyData.clientSince,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      mobileNumber: customerData.mobileNumber,
      login: customerData.login,
      position: customerData.position,
      username: customerData.username,
      password: customerData.password
    }

    // Check that all fields are filled
    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value.trim())
      .map(([key]) => key)

    if (emptyFields.length > 0) {
      showError('Validation Error', `Please fill in all required fields: ${emptyFields.join(', ')}`)
      setLoading(false)
      return
    }

    // Additional validation
    if (customerData.password.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (customerData.username.length < 3) {
      showError('Validation Error', 'Username must be at least 3 characters')
      setLoading(false)
      return
    }

    // Check username uniqueness
    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
    const isUsernameTaken = existingCustomers.some((c: any) => c.username === customerData.username)
    if (isUsernameTaken) {
      showError('Validation Error', 'User with this username already exists')
      setLoading(false)
      return
    }

    // Check login (email) uniqueness
    const isLoginTaken = existingCustomers.some((c: any) => c.login === customerData.login)
    if (isLoginTaken) {
      showError('Validation Error', 'User with this email already exists')
      setLoading(false)
      return
    }

    try {
      // Создаем объект клиента согласно требованиям
      const customerDataToSubmit = {
        companyName: companyData.name,
        address: companyData.address,
        phoneNumber: companyData.phone,
        customerSince: companyData.clientSince,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        mobileNumber: customerData.mobileNumber,
        login: customerData.login, // Email для входа
        position: customerData.position,
        username: customerData.username, // Username для отображения и авторизации
        password: customerData.password
      }

      // Сохраняем в localStorage
      const savedCustomer = saveCustomerToStorage(customerDataToSubmit)
      
      console.log('✅ Customer created and saved:', savedCustomer)
      
      // Показываем уведомление об успехе
      showSuccess('Success!', t('customerCreated'))
      
      // Перенаправляем обратно на список клиентов
      setTimeout(() => {
        navigate('/super-admin')
      }, 1500)

    } catch (error) {
      console.error('Error creating customer:', error)
      showError('Error!', t('errorCreatingCustomer'))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/super-admin')
  }



  return (
    <AdminLayout>
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('createCustomer')}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">{t('createCustomerDescription')}</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Карточка 1 - Информация о компании */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{t('companyInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                    {t('companyName')} *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleCompanyChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={t('companyName')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-foreground mb-2">
                    {t('companyAddress')} *
                  </label>
                  <input
                    id="companyAddress"
                    type="text"
                    value={companyData.address}
                    onChange={(e) => handleCompanyChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={t('companyAddress')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-foreground mb-2">
                    {t('companyPhone')} *
                  </label>
                  <input
                    id="companyPhone"
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => handleCompanyChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="clientSince" className="block text-sm font-medium text-foreground mb-2">
                    {t('clientSince')} *
                  </label>
                  <input
                    id="clientSince"
                    type="date"
                    value={companyData.clientSince}
                    onChange={(e) => handleCompanyChange('clientSince', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Карточка 2 - Информация о клиенте */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{t('customerInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                      {t('firstName')} *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={customerData.firstName}
                      onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={t('firstName')}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                      {t('lastName')} *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={customerData.lastName}
                      onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={t('lastName')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-foreground mb-2">
                    {t('mobileNumber')} *
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    value={customerData.mobileNumber}
                    onChange={(e) => handleCustomerChange('mobileNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login" className="block text-sm font-medium text-foreground mb-2">
                    {t('login')} *
                  </label>
                  <input
                    id="login"
                    type="email"
                    value={customerData.login}
                    onChange={(e) => handleCustomerChange('login', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="admin@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-foreground mb-2">
                    {t('position')} *
                  </label>
                  <select
                    id="position"
                    value={customerData.position}
                    onChange={(e) => handleCustomerChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">{t('position')}</option>
                    <option value="manager">Manager</option>
                    <option value="director">Director</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    {t('username')} *
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={customerData.username}
                    onChange={(e) => handleCustomerChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="username"
                    required
                  />
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
              </CardContent>
            </Card>
          </div>

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