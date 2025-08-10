import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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

        // Check for regular user in sessionStorage
        const regularUserData = sessionStorage.getItem('currentRegularUser')
        if (regularUserData) {
          const regularUser = JSON.parse(regularUserData)
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
          setLocalUser(regularUserObj)
          setLocalLoading(false)
          return
        }

        setLocalUser(null)
        setLocalLoading(false)
      } catch (error) {
        console.error('Error checking localStorage:', error)
        setLocalUser(null)
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

  console.log('🔍 ProtectedRoute - AuthContext User:', user?.email)
  console.log('🔍 ProtectedRoute - Local User:', localUser?.email)
  console.log('🔍 ProtectedRoute - Effective User:', effectiveUser?.email)
  console.log('🔍 ProtectedRoute - Loading:', effectiveLoading)

  if (effectiveLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!effectiveUser) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
} 