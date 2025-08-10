import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth()
  const [localUser, setLocalUser] = useState<any>(null)
  const [localLoading, setLocalLoading] = useState(true)

  // Check localStorage directly for session persistence
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Check for mockAuth user
        const mockAuthUser = localStorage.getItem('mockAuthUser')
        if (mockAuthUser) {
          const parsedUser = JSON.parse(mockAuthUser)
          setLocalUser(parsedUser)
          setLocalLoading(false)
          return
        }

        // Check for customer in sessionStorage
        const customerData = sessionStorage.getItem('currentCustomer')
        if (customerData) {
          const customer = JSON.parse(customerData)
          const customerUser = {
            id: customer.id,
            email: customer.username,
            created_at: customer.createdAt,
            user_metadata: {
              full_name: `${customer.firstName} ${customer.lastName}`,
              company: customer.companyName,
              role: 'customer',
              customerData: customer
            }
          }
          setLocalUser(customerUser)
          setLocalLoading(false)
          return
        }

        setLocalLoading(false)
      } catch (error) {
        console.error('Error checking localStorage:', error)
        setLocalLoading(false)
      }
    }

    checkLocalStorage()

    // Listen for storage changes (logout events)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockAuthUser' || e.key === 'currentCustomer' || e.key === 'currentRegularUser') {
        checkLocalStorage()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom logout event
    const handleLogout = () => {
      setLocalUser(null)
      setLocalLoading(false)
    }

    window.addEventListener('logout', handleLogout)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('logout', handleLogout)
    }
  }, [])

  // Use local user if AuthContext user is not available
  const effectiveUser = user || localUser
  const effectiveLoading = loading || localLoading

  // Показываем загрузку пока проверяем авторизацию
  if (effectiveLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Загрузка...</span>
      </div>
    )
  }

      // If user is not authenticated, redirect to login
  if (!effectiveUser) {
    return <Navigate to="/login" replace />
  }

      // Check user role (root admin or customer)
  const isSuperAdmin = effectiveUser.user_metadata?.role === 'super_admin' || 
                       effectiveUser.email === 'admin'
  const isCustomer = effectiveUser.user_metadata?.role === 'customer'

      // If user doesn't have required permissions, show access denied message
  if (!isSuperAdmin && !isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Нет доступа</h2>
          <p className="text-gray-600 mb-6">
            У вас нет прав для доступа к административной панели. 
            Обратитесь к администратору системы.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Для доступа к админ панели используйте:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p><strong>Email:</strong> admin</p>
                              <p><strong>Пароль:</strong> 1234</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Если все проверки пройдены, показываем админ панель
  return <>{children}</>
} 