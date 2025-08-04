import MainLayout from '@/layouts/MainLayout'

export default function Test() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ Tickefy работает!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          React, Vite и TailwindCSS настроены корректно
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">React 18</h3>
            <p className="text-green-700">Компоненты работают</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Vite</h3>
            <p className="text-blue-700">Сборка работает</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">TailwindCSS</h3>
            <p className="text-purple-700">Стили применяются</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Вернуться на главную
          </a>
        </div>
      </div>
    </MainLayout>
  )
} 