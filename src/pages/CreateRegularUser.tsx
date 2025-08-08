import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { saveRegularUserToStorage, getRegularUsersByCompany } from '@/lib/localStorage'
import MainLayout from '@/layouts/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export default function CreateRegularUser() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    username: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)

  // Получаем компанию текущего customer
  const getCurrentCompany = () => {
    if (user?.user_metadata?.role === 'customer') {
      return user.user_metadata.company || ''
    }
    return ''
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.firstName.trim()) errors.push('Имя обязательно')
    if (!formData.lastName.trim()) errors.push('Фамилия обязательна')
    if (!formData.email.trim()) errors.push('Email обязателен')
    if (!formData.phoneNumber.trim()) errors.push('Номер телефона обязателен')
    if (!formData.position.trim()) errors.push('Должность обязательна')
    if (!formData.username.trim()) errors.push('Username обязателен')
    if (!formData.password.trim()) errors.push('Пароль обязателен')
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Неверный формат email')
    }
    
    // Проверка длины username и password
    if (formData.username.length < 3) {
      errors.push('Username должен содержать минимум 3 символа')
    }
    if (formData.password.length < 6) {
      errors.push('Пароль должен содержать минимум 6 символов')
    }
    
    // Проверка на уникальность email
    const existingUsers = getRegularUsersByCompany(getCurrentCompany())
    const isEmailExists = existingUsers.some(user => user.email === formData.email)
    if (isEmailExists) {
      errors.push('Пользователь с таким email уже существует')
    }
    
    // Проверка на уникальность username
    const isUsernameExists = existingUsers.some(user => user.username === formData.username)
    if (isUsernameExists) {
      errors.push('Пользователь с таким username уже существует')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔍 Creating regular user with data:', formData)
      
      // Валидация формы
      const errors = validateForm()
      if (errors.length > 0) {
        errors.forEach(error => alert(error))
        setLoading(false)
        return
      }

      // Получаем данные текущего customer
      const currentCompany = getCurrentCompany()
      const currentCustomerId = user?.id || localStorage.getItem('currentCustomerId')
      
      if (!currentCompany || !currentCustomerId) {
        alert('Ошибка: не удалось определить компанию')
        setLoading(false)
        return
      }

      // Создаем объект пользователя
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        position: formData.position.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        companyName: currentCompany,
        createdBy: currentCustomerId,
        status: 'active' as const
      }

      console.log('🔍 Saving regular user:', userData)
      
      // Сохраняем в localStorage
      const savedUser = saveRegularUserToStorage(userData)
      
      console.log('✅ Regular user created successfully:', savedUser)
      
      alert('Пользователь успешно создан!')
      
      // Очищаем форму
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        position: '',
        username: '',
        password: ''
      })
      
      // Перенаправляем на список пользователей
      navigate('/users')
      
    } catch (error) {
      console.error('❌ Error creating regular user:', error)
      alert('Ошибка при создании пользователя')
    } finally {
      setLoading(false)
    }
  }

  const positions = [
    'Менеджер',
    'Разработчик',
    'Дизайнер',
    'Аналитик',
    'Тестировщик',
    'Маркетолог',
    'Продавец',
    'Бухгалтер',
    'HR',
    'Другое'
  ]

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Создать пользователя
          </h1>
          <p className="text-muted-foreground mt-2">
            Создайте нового пользователя для вашей компании
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">Имя *</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    placeholder="Введите имя"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">Фамилия *</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    placeholder="Введите фамилию"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  placeholder="user@company.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium">Номер телефона *</label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="block text-sm font-medium">Должность *</label>
                <select
                  id="position"
                  value={formData.position}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('position', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите должность</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium">Username *</label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                    placeholder="ivan_petrov"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Минимум 3 символа</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">Пароль *</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                    placeholder="Введите пароль"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Минимум 6 символов</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о компании</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Компания</label>
                <input
                  type="text"
                  value={getCurrentCompany()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-sm text-gray-600">
                  Пользователь будет создан для компании: {getCurrentCompany()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Создан</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-sm text-gray-600">
                  Дата создания: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Создание...' : 'Создать пользователя'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </MainLayout>
  )
} 