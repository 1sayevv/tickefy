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
  setUser: (user: User | null) => void
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
        console.log('🔍 AuthContext: checkUser started')
        
        // Сначала проверяем, есть ли customer в sessionStorage
        const customerData = sessionStorage.getItem('currentCustomer')
        console.log('🔍 AuthContext: customerData from sessionStorage:', customerData)
        if (customerData) {
          const customer = JSON.parse(customerData)
          console.log('AuthContext - Customer from sessionStorage:', customer)
          
          // Создаем объект пользователя для customer
          const customerUser = {
            id: customer.id,
            email: customer.username,
            created_at: customer.createdAt,
            user_metadata: {
              full_name: `${customer.firstName} ${customer.lastName}`,
              company: customer.companyName,
              role: 'customer',
              customerData: customer
            }
          }
          
          setUser(customerUser as any)
          setLoading(false)
          return
        }
        
        // Проверяем, есть ли regular user в sessionStorage
        const regularUserData = sessionStorage.getItem('currentRegularUser')
        console.log('🔍 AuthContext: regularUserData from sessionStorage:', regularUserData)
        if (regularUserData) {
          const regularUser = JSON.parse(regularUserData)
          console.log('AuthContext - Regular User from sessionStorage:', regularUser)
          
          // Создаем объект пользователя для regular user
          const regularUserObj = {
            id: regularUser.id,
            email: regularUser.email,
            created_at: regularUser.createdAt,
            user_metadata: {
              full_name: `${regularUser.firstName} ${regularUser.lastName}`,
              company: regularUser.companyName,
              role: 'user',
              regularUserData: regularUser
            }
          }
          
          setUser(regularUserObj as any)
          setLoading(false)
          return
        }
        
        // Проверяем, есть ли customer ID в localStorage
        const currentCustomerId = localStorage.getItem('currentCustomerId')
        console.log('🔍 AuthContext: Checking currentCustomerId:', currentCustomerId)
        
        if (currentCustomerId) {
          const customers = JSON.parse(localStorage.getItem('customers') || '[]')
          console.log('🔍 AuthContext: All customers:', customers)
          const customer = customers.find((c: any) => c.id === currentCustomerId)
          
          if (customer) {
            console.log('AuthContext - Customer from localStorage ID:', customer)
            
            // Создаем объект пользователя для customer
            const customerUser = {
              id: customer.id,
              email: customer.username,
              created_at: customer.createdAt,
              user_metadata: {
                full_name: `${customer.firstName} ${customer.lastName}`,
                company: customer.companyName,
                role: 'customer',
                customerData: customer
              }
            }
            
            // Сохраняем в sessionStorage для совместимости
            sessionStorage.setItem('currentCustomer', JSON.stringify(customer))
            
            console.log('🔍 AuthContext: Setting customer user:', customerUser)
            setUser(customerUser as any)
            setLoading(false)
            console.log('🔍 AuthContext: Customer user set successfully')
            
            return
          } else {
            // Если customer не найден, очищаем currentCustomerId
            console.log('❌ Customer not found, clearing currentCustomerId')
            localStorage.removeItem('currentCustomerId')
            sessionStorage.removeItem('currentCustomer')
          }
        }
        
        // Проверяем, есть ли regular user ID в localStorage
        const currentRegularUserId = localStorage.getItem('currentRegularUserId')
        console.log('🔍 AuthContext: Checking currentRegularUserId:', currentRegularUserId)
        
        if (currentRegularUserId) {
          const regularUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]')
          console.log('🔍 AuthContext: All regular users:', regularUsers)
          const regularUser = regularUsers.find((u: any) => u.id === currentRegularUserId)
          
          if (regularUser) {
            console.log('AuthContext - Regular User from localStorage ID:', regularUser)
            
            // Создаем объект пользователя для regular user
            const regularUserObj = {
              id: regularUser.id,
              email: regularUser.email,
              created_at: regularUser.createdAt,
              user_metadata: {
                full_name: `${regularUser.firstName} ${regularUser.lastName}`,
                company: regularUser.companyName,
                role: 'user',
                regularUserData: regularUser
              }
            }
            
            // Сохраняем в sessionStorage для совместимости
            sessionStorage.setItem('currentRegularUser', JSON.stringify(regularUser))
            
            console.log('🔍 AuthContext: Setting regular user:', regularUserObj)
            setUser(regularUserObj as any)
            setLoading(false)
            console.log('🔍 AuthContext: Regular user set successfully')
            return
          } else {
            // Если regular user не найден, очищаем currentRegularUserId
            console.log('❌ Regular user not found, clearing currentRegularUserId')
            localStorage.removeItem('currentRegularUserId')
            sessionStorage.removeItem('currentRegularUser')
          }
        }
        
        const currentUser = await getCurrentUser()
        console.log('AuthContext - Current user:', currentUser)
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
        async (_event, session) => {
          const currentUser = session?.user ?? null
          setUser(currentUser as any)
          
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
      const result = await signIn(email, password) as any
      if (result.user) {
        setUser(result.user as any)
        await loadProfile(result.user.id)
      }
      return {
        user: result.user,
        error: result.error ? (typeof result.error === 'string' ? result.error : result.error.message) : null
      }
    } catch (error) {
      return { user: null, error: 'Ошибка входа. Попробуйте еще раз.' }
    }
  }

  const handleSignUp = async (email: string, password: string, fullName?: string, company?: string) => {
    try {
      const result = await signUp(email, password, fullName, company) as any
      if (result.user) {
        setUser(result.user as any)
        await loadProfile(result.user.id)
      }
      return {
        user: result.user,
        error: result.error ? (typeof result.error === 'string' ? result.error : result.error.message) : null
      }
    } catch (error) {
      return { user: null, error: 'Ошибка регистрации. Попробуйте еще раз.' }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      setProfile(null)
      
      // Очищаем sessionStorage для customers и regular users
      sessionStorage.removeItem('currentCustomer')
      sessionStorage.removeItem('currentRegularUser')
      
      // Очищаем ID из localStorage
      localStorage.removeItem('currentCustomerId')
      localStorage.removeItem('currentRegularUserId')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    return user.user_metadata?.full_name || user.email || 'Пользователь'
  }

  const getUserCompany = () => {
    if (!user) {
      // Проверяем, есть ли customer в sessionStorage
      const customerData = sessionStorage.getItem('currentCustomer')
      if (customerData) {
        const customer = JSON.parse(customerData)
        return customer.companyName || ''
      }
      
      // Проверяем, есть ли customer ID в localStorage
      const currentCustomerId = localStorage.getItem('currentCustomerId')
      if (currentCustomerId) {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]')
        const customer = customers.find((c: any) => c.id === currentCustomerId)
        if (customer) {
          return customer.companyName || ''
        }
      }
      
      return ''
    }
    return user.user_metadata?.company || profile?.company || ''
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    setUser,
    getUserDisplayName,
    getUserCompany
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 