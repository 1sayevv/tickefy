import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Импортируем файлы переводов
import enTranslation from '../locales/en.json'
import ruTranslation from '../locales/ru.json'

const resources = {
  en: enTranslation,
  ru: ruTranslation
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Изменено с 'ru' на 'en'
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n 