import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { user, signOut, getUserDisplayName, loading } = useAuth()
  const { t } = useTranslation()

  const handleSignOut = async () => {
    await signOut()
  }

  // Проверяем, является ли пользователь админом
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                  user?.email === 'admin@example.com'

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
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {t('hello')}, {getUserDisplayName()}
                </span>
                
                {/* Показываем кнопку "Панель управления" только обычным пользователям */}
                {!isAdmin && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      {t('dashboard')}
                    </Button>
                  </Link>
                )}
                
                {/* Показываем кнопку "Админ панель" только админам */}
                {isAdmin && (
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
        </div>
      </div>
    </header>
  )
} 