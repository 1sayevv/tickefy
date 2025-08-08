import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SuperAdminRouteProps {
  children: ReactNode
}

export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  // Check if user is root admin
  const isSuperAdmin = user?.email === 'admin' || user?.user_metadata?.role === 'super_admin'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('noAccess')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('loginToSystem')}
              </p>
              <a 
                href="/login" 
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                {t('login')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('noAccess')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('rootAdminAccessDenied')}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p><strong>Email:</strong> admin</p>
                <p><strong>Password:</strong> 1234</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 