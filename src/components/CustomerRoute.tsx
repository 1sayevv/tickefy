import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

interface CustomerRouteProps {
  children: ReactNode
}

export default function CustomerRoute({ children }: CustomerRouteProps) {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  const isCustomer = !!user && (user.user_metadata?.role === 'customer')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">{t('noAccess')}</h2>
            <a href="/login" className="text-primary underline">{t('login')}</a>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">{t('noAccess')}</h2>
            <p className="text-muted-foreground">{t('customerAccessDenied')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 