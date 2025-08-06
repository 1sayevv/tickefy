import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function HomeRedirect() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Загрузка...</span>
      </div>
    )
  }

  if (user) {
    // Проверяем, является ли пользователь админом
    const isAdmin = user.email === 'admin' || 
                    user.user_metadata?.role === 'admin'
    
    // Перенаправляем админа на админ панель, обычных пользователей на dashboard
    if (isAdmin) {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  // Если пользователь не авторизован, перенаправляем на логин
  return <Navigate to="/login" replace />
} 