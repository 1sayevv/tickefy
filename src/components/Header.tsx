import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'

export default function Header() {
  const { user, signOut, getUserDisplayName, loading } = useAuth()
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  // Проверяем роли пользователя
  const isSuperAdmin = user?.user_metadata?.role === 'super_admin' || 
                       user?.email === 'admin'
  const isCustomer = user?.user_metadata?.role === 'customer'

  if (loading) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">Tickefy</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-muted h-4 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold">Tickefy</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {t('hello')}, {getUserDisplayName()}
                </span>
                
                {!isSuperAdmin && !isCustomer && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      {t('dashboard')}
                    </Button>
                  </Link>
                )}

                {isCustomer && (
                  <Link to="/users">
                    <Button variant="outline" size="sm">
                      {t('manageUsers')}
                    </Button>
                  </Link>
                )}
                
                {isSuperAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                      {t('adminPanel')}
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  {t('logout')}
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
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
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              
              {user ? (
                <>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {t('hello')}, {getUserDisplayName()}
                    </span>
                  </div>
                  
                  {!isSuperAdmin && !isCustomer && (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('dashboard')}
                      </Button>
                    </Link>
                  )}

                  {isCustomer && (
                    <Link to="/users" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('manageUsers')}
                      </Button>
                    </Link>
                  )}
                  
                  {isSuperAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                        {t('adminPanel')}
                      </Button>
                    </Link>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}