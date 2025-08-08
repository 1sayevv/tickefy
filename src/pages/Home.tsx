import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@/layouts/MainLayout'

export default function Home() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Добро пожаловать в Tickefy
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Современная платформа для управления задачами и проектами. Организуйте работу команды, отслеживайте прогресс и достигайте целей вместе.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link to="/dashboard">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-base sm:text-lg">
                  Перейти в панель управления
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-base sm:text-lg">
                    Начать работу
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium text-base sm:text-lg">
                  Узнать больше
                </button>
              </>
            )}
          </div>

          {/* Тестовые аккаунты section */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">🧪 Тестовые аккаунты</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 sm:p-4 rounded border">
                  <h4 className="font-medium text-blue-800 mb-2">User 1 (Nike)</h4>
                  <p className="text-blue-700">Email: user1</p>
                  <p className="text-blue-700">Password: 1234</p>
                  <p className="text-blue-700">Company: Nike</p>
                  <p className="text-blue-700">Role: User</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded border">
                  <h4 className="font-medium text-blue-800 mb-2">User 2 (Adidas)</h4>
                  <p className="text-blue-700">Email: user2</p>
                  <p className="text-blue-700">Password: 1234</p>
                  <p className="text-blue-700">Company: Adidas</p>
                  <p className="text-blue-700">Role: User</p>
                </div>
                                  <div className="bg-white p-3 sm:p-4 rounded border border-purple-200 bg-purple-50 sm:col-span-2 lg:col-span-1">
                    <h4 className="font-medium text-purple-800 mb-2">Root Admin</h4>
                    <p className="text-purple-700">Email: admin</p>
                    <p className="text-purple-700">Password: 1234</p>
                    <p className="text-purple-700">Company: Tickefy</p>
                    <p className="text-purple-700">Role: Root Admin</p>
                                          <p className="text-purple-700 text-sm mt-1">Доступ: Админ-панель + Управление клиентами</p>
                  </div>
              </div>
              <p className="text-blue-600 text-xs sm:text-sm mt-4">💡 Используйте эти аккаунты для тестирования системы авторизации</p>
            </div>
          )}

          {/* Features section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Управление тикетами</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Создавайте, отслеживайте и управляйте задачами вашей команды</p>
            </div>
            
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Командная работа</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Организуйте работу команды и отслеживайте прогресс</p>
            </div>
            
            <div className="text-center space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Аналитика</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Получайте детальную статистику и аналитику по проектам</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 