import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LanguageSwitcher from './LanguageSwitcher'

export default function LanguageTest() {
  const { t, i18n } = useTranslation()

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Тест переключателя языков</span>
          <LanguageSwitcher />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Текущий язык:</h3>
          <p className="text-sm text-muted-foreground">
            {i18n.language === 'ru' ? 'Русский' : 'English'} ({i18n.language})
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Примеры переводов:</h3>
          <ul className="text-sm space-y-1">
            <li><strong>{t('createTicket')}</strong> - создание тикета</li>
            <li><strong>{t('dashboard')}</strong> - панель управления</li>
            <li><strong>{t('login')}</strong> - вход в систему</li>
            <li><strong>{t('logout')}</strong> - выход из системы</li>
            <li><strong>{t('adminPanel')}</strong> - админ панель</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">localStorage:</h3>
          <p className="text-xs text-muted-foreground">
            i18nextLng: {localStorage.getItem('i18nextLng') || 'не установлен'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 