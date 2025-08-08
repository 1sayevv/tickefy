import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation()
  const { signOut, getUserDisplayName, user } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Проверяем, является ли пользователь корневым админом
  const isSuperAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin'
  const isCustomer = user?.user_metadata?.role === 'customer'

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  // Базовые пункты меню для всех ролей
  const baseMenuItems = [
    {
      title: t('dashboard'),
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      title: t('allTickets'),
      href: '/admin/tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    }
  ]

  // Создаем финальный массив меню в зависимости от роли
  let menuItems = [...baseMenuItems]

  // Добавляем пункт меню для корневого админа
  if (isSuperAdmin) {
    menuItems.push({
      title: t('manageCustomers'),
      href: '/super-admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    })
  }

  // Меню для Customer
  if (isCustomer) {
    menuItems.push({
      title: t('manageUsers'),
      href: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 11a4 4 0 10-6 0" />
        </svg>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {isCustomer ? t('customerPanelTitle') : t('adminPanelTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {isCustomer ? t('customerPanelDescription') : t('systemManagement')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              {t('hello')}, {getUserDisplayName()}!
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
              {t('logout')}
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
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {t('hello')}, {getUserDisplayName()}!
                </span>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
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
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 