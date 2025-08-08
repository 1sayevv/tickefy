import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { authenticateCustomer, authenticateRegularUser, debugCustomers, debugRegularUsers } from '@/lib/localStorage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MainLayout from '@/layouts/MainLayout'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { signIn, signUp, setUser } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔐 Login attempt:', { email, password, isLogin })

    try {
      let result
      
      if (isLogin) {
        // Сначала проверяем, является ли это customer из localStorage
        console.log('🔐 Attempting customer authentication with:', { email, password })
        
        // Отладочная информация
        debugCustomers()
        
        const customer = authenticateCustomer(email, password)
        
        if (customer) {
          console.log('✅ Customer authenticated from localStorage:', customer)
          
          // Сохраняем ID customer в localStorage
          localStorage.setItem('currentCustomerId', customer.id)
          console.log('💾 Saved currentCustomerId:', customer.id)
          
          // Создаем объект пользователя для customer
          const customerUser = {
            id: customer.id,
            email: customer.username, // Используем username как email для совместимости
            created_at: customer.createdAt,
            user_metadata: {
              full_name: `${customer.firstName} ${customer.lastName}`,
              company: customer.companyName,
              role: 'customer',
              customerData: customer // Сохраняем полные данные customer
            }
          }
          
          // Сохраняем customer в sessionStorage для доступа в приложении
          sessionStorage.setItem('currentCustomer', JSON.stringify(customer))
          console.log('💾 Saved customer to sessionStorage')
          
          console.log('🚀 Redirecting customer to dashboard')
          console.log('🔍 Customer user object:', customerUser)
          
          // Устанавливаем пользователя в AuthContext
          console.log('🔍 Setting user in AuthContext')
          setUser(customerUser as any)
          
          // Перенаправляем на dashboard
          console.log('🚀 About to navigate to dashboard')
          navigate('/dashboard', { replace: true })
          
          return
        }
        
        console.log('🔐 Customer authentication failed, trying regular user auth...')
        
        // Проверяем, является ли это regular user из localStorage
        console.log('🔐 Attempting regular user authentication with:', { email, password })
        
        // Отладочная информация
        debugRegularUsers()
        
        const regularUser = authenticateRegularUser(email, password)
        
        if (regularUser) {
          console.log('✅ Regular user authenticated from localStorage:', regularUser)
          
          // Сохраняем ID regular user в localStorage
          localStorage.setItem('currentRegularUserId', regularUser.id)
          console.log('💾 Saved currentRegularUserId:', regularUser.id)
          
          // Создаем объект пользователя для regular user
          const regularUserObj = {
            id: regularUser.id,
            email: regularUser.email,
            created_at: regularUser.createdAt,
            user_metadata: {
              full_name: `${regularUser.firstName} ${regularUser.lastName}`,
              company: regularUser.companyName,
              role: 'user',
              regularUserData: regularUser
            }
          }
          
          // Сохраняем regular user в sessionStorage для доступа в приложении
          sessionStorage.setItem('currentRegularUser', JSON.stringify(regularUser))
          console.log('💾 Saved regular user to sessionStorage')
          
          console.log('🚀 Redirecting regular user to dashboard')
          console.log('🔍 Regular user object:', regularUserObj)
          
          // Устанавливаем пользователя в AuthContext
          console.log('🔍 Setting user in AuthContext')
          setUser(regularUserObj as any)
          
          // Перенаправляем на dashboard
          console.log('🚀 About to navigate to dashboard')
          navigate('/dashboard', { replace: true })
          
          return
        }
        
        console.log('🔐 Regular user authentication failed, checking for existing users...')
        
        // Проверяем, есть ли customers в localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]')
        const existingCustomer = customers.find((c: any) => c.username === email)
        
        if (existingCustomer) {
          // Customer найден, но пароль неверный
          setError('Неверный пароль для customer')
          setLoading(false)
          return
        }
        
        // Проверяем, есть ли regular users в localStorage
        const regularUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]')
        const existingRegularUser = regularUsers.find((u: any) => u.email === email)
        
        if (existingRegularUser) {
          // Regular user найден, но пароль неверный
          setError('Неверный пароль для пользователя')
          setLoading(false)
          return
        }
        
        // Если это не customer и не regular user, пробуем обычную авторизацию
        result = await signIn(email, password)
        console.log('📝 SignIn result:', result)
      } else {
        result = await signUp(email, password, fullName, company)
        console.log('📝 SignUp result:', result)
      }

      if (result.error) {
        console.error('❌ Auth error:', result.error)
        setError(typeof result.error === 'string' ? result.error : (result.error as any).message)
      } else if (result.user) {
        console.log('✅ Auth successful:', result.user)
        
        // Проверяем, является ли пользователь админом (включая корневого админа)
        const isAdmin = result.user.email === 'admin' || 
                       result.user.user_metadata?.role === 'admin' ||
                       result.user.user_metadata?.role === 'super_admin'
        
        console.log('👤 User role check:', {
          email: result.user.email,
          role: result.user.user_metadata?.role,
          isAdmin
        })
        
        // Перенаправляем админа на админ панель, обычных пользователей на dashboard
        if (isAdmin) {
          console.log('🚀 Redirecting to admin panel')
          navigate('/admin')
        } else {
          console.log('🚀 Redirecting to dashboard')
          navigate('/dashboard')
        }
      } else {
        console.error('❌ No user in result:', result)
        setError('Неизвестная ошибка авторизации')
      }
    } catch (error) {
      console.error('💥 Exception during auth:', error)
      setError(t('authError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isLogin ? t('loginToSystem') : t('registration')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin ? t('loginToAccount') : t('createNewAccount')}
            </p>
          </div>

          {/* Тестовые аккаунты */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              {t('testAccounts')}:
            </h3>
            <div className="space-y-1 text-xs text-blue-800">
                              <div><strong>user1</strong> / 1234 (Nike)</div>
                <div><strong>user2</strong> / 1234 (Adidas)</div>
                <div><strong>customer</strong> / 1234 (Nike Customer)</div>
                <div><strong>adidas</strong> / 1234 (Adidas Customer)</div>
                <div><strong>admin</strong> / 1234 (Root Admin)</div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {isLogin ? t('systemLogin') : t('registration')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                        {t('fullName')}
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground">
                        {t('companyName')}
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    {t('password')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? t('loading') : (isLogin ? t('login') : t('register'))}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {isLogin ? t('noAccountRegister') : t('haveAccountLogin')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 