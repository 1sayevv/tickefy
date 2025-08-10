import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CustomerManagerLayoutProps {
  children: ReactNode
}

export default function CustomerManagerLayout({ children }: CustomerManagerLayoutProps) {
  const { t } = useTranslation()
  const { signOut, getUserDisplayName, user } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [localUser, setLocalUser] = useState<any>(null)

  // Check localStorage directly for session persistence
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Check for mockAuth user
        const mockAuthUser = localStorage.getItem('mockAuthUser')
        if (mockAuthUser) {
          const parsedUser = JSON.parse(mockAuthUser)
          setLocalUser(parsedUser)
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
          return
        }
      } catch (error) {
        console.error('Error checking localStorage:', error)
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
    }

    window.addEventListener('logout', handleLogout)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('logout', handleLogout)
    }
  }, [])

  // Use local user if AuthContext user is not available
  const effectiveUser = user || localUser

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/customer-manager/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      title: 'All Tickets',
      href: '/customer-manager/tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Customer Manager Panel
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage tickets for your assigned company
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
              Logout
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 px-4 py-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
} 