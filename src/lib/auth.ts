import { supabase } from './supabase'
import { mockSignIn, mockSignUp, mockSignOut, mockGetCurrentUser, mockGetProfile } from './mockAuth'
import type { User, AuthError, LoginCredentials, SignUpCredentials, Profile } from './supabase'

// Проверяем, настроен ли Supabase
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && 
         url !== 'https://your-project.supabase.co' && 
         key !== 'your_anon_key_here'
}

// Функции авторизации
export const signIn = async (email: string, password: string) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, error: { message: error.message } }
      }

      return { user: data.user, error: null }
    } else {
      return await mockSignIn(email, password)
    }
  } catch (error) {
    console.error('Error in signIn:', error)
    return { user: null, error: { message: 'Произошла ошибка при входе' } }
  }
}

export const signUp = async (email: string, password: string, fullName?: string, company?: string) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: company,
            role: 'user'
          }
        }
      })

      if (error) {
        return { user: null, error: { message: error.message } }
      }

      return { user: data.user, error: null }
    } else {
      return await mockSignUp(email, password, fullName, company)
    }
  } catch (error) {
    console.error('Error in signUp:', error)
    return { user: null, error: { message: 'Произошла ошибка при регистрации' } }
  }
}

export const signOut = async () => {
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut()
      return { error: error ? { message: error.message } : null }
    } else {
      return await mockSignOut()
    }
  } catch (error) {
    console.error('Error in signOut:', error)
    return { error: { message: 'Произошла ошибка при выходе' } }
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } else {
      return await mockGetCurrentUser()
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } else {
      return await mockGetProfile(userId)
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return data
    } else {
      // Для мок-системы просто возвращаем обновленные данные
      return { ...updates, id: userId } as Profile
    }
  } catch (error) {
    console.error('Error in updateProfile:', error)
    return null
  }
} 