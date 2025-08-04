import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MainLayout from '@/layouts/MainLayout'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Страница не найдена
            </h2>
            <p className="text-muted-foreground">
              Извините, запрашиваемая страница не существует или была перемещена.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                Вернуться на главную
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto">
                Войти в систему
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 