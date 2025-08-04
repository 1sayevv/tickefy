import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Profile, supabase } from '@/lib/supabase'
import { getCurrentUser, getProfile, signIn, signUp, signOut } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signUp: (email: string, password: string, fullName?: string, company?: string) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<void>
  getUserDisplayName: () => string
  getUserCompany: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Загрузка профиля пользователя
  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await getProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  useEffect(() => {
    // Проверяем текущую сессию при загрузке
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          await loadProfile(currentUser.id)
        }
      } catch (error) {
        console.error('Error checking user session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Слушаем изменения в авторизации (только для Supabase)
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentUser = session?.user ?? null
          setUser(currentUser)
          
          if (currentUser) {
            await loadProfile(currentUser.id)
          } else {
            setProfile(null)
          }
          
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setLoading(false)
    }
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password)
      if (result.user) {
        setUser(result.user)
        await loadProfile(result.user.id)
      }
      return result
    } catch (error) {
      return { user: null, error: 'Ошибка входа. Попробуйте еще раз.' }
    }
  }

  const handleSignUp = async (email: string, password: string, fullName?: string, company?: string) => {
    try {
      const result = await signUp(email, password, fullName, company)
      if (result.user) {
        setUser(result.user)
        await loadProfile(result.user.id)
      }
      return result
    } catch (error) {
      return { user: null, error: 'Ошибка регистрации. Попробуйте еще раз.' }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    return user.user_metadata?.full_name || user.email || 'Пользователь'
  }

  const getUserCompany = () => {
    if (!user) return ''
    return user.user_metadata?.company || profile?.company || ''
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    getUserDisplayName,
    getUserCompany
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 