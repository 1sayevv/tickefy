import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getRegularUsersFromStorage } from '@/lib/localStorage'

interface CustomerManagerRouteProps {
  children: ReactNode
}

export default function CustomerManagerRoute({ children }: CustomerManagerRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        navigate('/login')
        return
      }

      // Check if user is a customer manager
      const allUsers = getRegularUsersFromStorage()
      const isCustomerManager = allUsers.some(manager => 
        (manager.username === user.email || manager.email === user.email) && 
        manager.isCustomerManager === true
      )

      if (!isCustomerManager) {
        // User is not a customer manager, redirect to appropriate page
        if (user.user_metadata?.role === 'customer') {
          navigate('/dashboard')
        } else if (user.user_metadata?.role === 'admin' || user.email === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Check if user is a customer manager
  const allUsers = getRegularUsersFromStorage()
  const isCustomerManager = allUsers.some(manager => 
    (manager.username === user?.email || manager.email === user?.email) && 
    manager.isCustomerManager === true
  )

  if (!isCustomerManager) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
} 