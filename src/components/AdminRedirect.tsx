import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminRedirectProps {
  children: React.ReactNode
}

export default function AdminRedirect({ children }: AdminRedirectProps) {
  const { user, loading } = useAuth()

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Загрузка...</span>
      </div>
    )
  }

  // Если пользователь не авторизован, перенаправляем на логин
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Проверяем, является ли пользователь админом
  const isAdmin = user.email === 'admin' || 
                  user.user_metadata?.role === 'admin'

  // Если пользователь админ, перенаправляем на админ панель
  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  // Если обычный пользователь, показываем содержимое
  return <>{children}</>
} 