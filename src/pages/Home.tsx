import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@/layouts/MainLayout'

export default function Home() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Добро пожаловать в Tickefy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Современная платформа для управления задачами и проектами. Организуйте работу команды, отслеживайте прогресс и достигайте целей вместе.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg">
                  Перейти в панель управления
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg">
                    Начать работу
                  </button>
                </Link>
                <button className="px-8 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium text-lg">
                  Узнать больше
                </button>
              </>
            )}
          </div>

          {/* Тестовые аккаунты section */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">🧪 Тестовые аккаунты</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-blue-800 mb-2">User 1 (Nike)</h4>
                  <p className="text-blue-700">Email: user1@examplemail.com</p>
                  <p className="text-blue-700">Password: user123</p>
                  <p className="text-blue-700">Company: Nike</p>
                  <p className="text-blue-700">Role: User</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-blue-800 mb-2">User 2 (Adidas)</h4>
                  <p className="text-blue-700">Email: user2@examplemail.com</p>
                  <p className="text-blue-700">Password: user213</p>
                  <p className="text-blue-700">Company: Adidas</p>
                  <p className="text-blue-700">Role: User</p>
                </div>
                <div className="bg-white p-4 rounded border border-purple-200 bg-purple-50">
                  <h4 className="font-medium text-purple-800 mb-2">Admin</h4>
                  <p className="text-purple-700">Email: admin@example.com</p>
                  <p className="text-purple-700">Password: admin123</p>
                  <p className="text-purple-700">Company: Tickefy</p>
                  <p className="text-purple-700">Role: Admin</p>
                </div>
              </div>
              <p className="text-blue-600 text-sm mt-4">💡 Используйте эти аккаунты для тестирования системы авторизации</p>
            </div>
          )}

          {/* Features section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Управление тикетами</h3>
              <p className="text-muted-foreground">Создавайте, отслеживайте и управляйте задачами вашей команды</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Командная работа</h3>
              <p className="text-muted-foreground">Организуйте работу команды и отслеживайте прогресс</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Аналитика</h3>
              <p className="text-muted-foreground">Получайте детальную статистику и аналитику по проектам</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 