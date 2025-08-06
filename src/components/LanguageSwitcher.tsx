import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  // Загружаем сохраненный язык из localStorage при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
      i18n.changeLanguage(savedLanguage)
      setCurrentLanguage(savedLanguage)
    } else {
      // Если нет сохраненного языка, устанавливаем английский по умолчанию
      i18n.changeLanguage('en')
      localStorage.setItem('i18nextLng', 'en')
      setCurrentLanguage('en')
    }
  }, [i18n])

  // Обновляем состояние при изменении языка
  useEffect(() => {
    setCurrentLanguage(i18n.language)
  }, [i18n.language])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
    setCurrentLanguage(lng)
  }

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={currentLanguage === 'ru' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('ru')}
        className="text-xs px-2 py-1 h-8 min-w-[50px]"
        title="Русский"
      >
        <span className="mr-1">🇷🇺</span>
        <span className="hidden sm:inline">RU</span>
      </Button>
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('en')}
        className="text-xs px-2 py-1 h-8 min-w-[50px]"
        title="English"
      >
        <span className="mr-1">🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </Button>
    </div>
  )
} 