import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminRedirectProps {
  children: React.ReactNode
}

export default function AdminRedirect({ children }: AdminRedirectProps) {
  const { user, loading } = useAuth()

  console.log('🔍 AdminRedirect - User:', user)
  console.log('🔍 AdminRedirect - Loading:', loading)
  console.log('🔍 AdminRedirect - User metadata:', user?.user_metadata)
  console.log('🔍 AdminRedirect - User email:', user?.email)
  console.log('🔍 AdminRedirect - User role:', user?.user_metadata?.role)

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    console.log('🔍 AdminRedirect - Showing loading...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Загрузка...</span>
      </div>
    )
  }

  // Если пользователь не авторизован, перенаправляем на логин
  if (!user) {
    console.log('🔍 AdminRedirect - No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Проверяем, является ли пользователь админом
  const isAdmin = user.email === 'admin' || 
                  user.user_metadata?.role === 'admin' ||
                  user.user_metadata?.role === 'super_admin'

  console.log('🔍 AdminRedirect - Is admin:', isAdmin)

  // Если пользователь админ, перенаправляем на админ панель
  if (isAdmin) {
    console.log('🔍 AdminRedirect - Redirecting admin to admin panel')
    return <Navigate to="/admin" replace />
  }

  // Проверяем, является ли пользователь customer
  const isCustomer = user.user_metadata?.role === 'customer'

  console.log('🔍 AdminRedirect - Is customer:', isCustomer)

  // Если пользователь customer, показываем содержимое (dashboard)
  if (isCustomer) {
    console.log('🔍 AdminRedirect - Showing dashboard for customer')
    return <>{children}</>
  }

  // Если обычный пользователь, показываем содержимое
  console.log('🔍 AdminRedirect - Showing dashboard for regular user')
  return <>{children}</>
} 