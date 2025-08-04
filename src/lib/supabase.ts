import { createClient } from '@supabase/supabase-js'

// Получаем переменные окружения
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Проверяем, настроены ли переменные окружения
const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your_anon_key_here'
}

// Создаем клиент Supabase с fallback значениями
export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your_anon_key_here',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Выводим предупреждение, если Supabase не настроен
if (!isSupabaseConfigured()) {
  console.warn('⚠️ Supabase не настроен. Используется мок-авторизация.')
  console.warn('Для настройки Supabase создайте файл .env с переменными:')
  console.warn('VITE_SUPABASE_URL=your_supabase_url')
  console.warn('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

// Типы для авторизации
export interface User {
  id: string
  email: string
  created_at?: string
  user_metadata?: {
    full_name?: string
    company?: string
    role?: string
  }
}

export interface AuthError {
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName?: string
  company?: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  company: string
  created_at: string
  updated_at: string
} 