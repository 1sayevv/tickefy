import { hashPassword, verifyPassword } from './encryption'

// Мок-пользователи с зашифрованными паролями
export const mockUsers = [
  {
    id: '1',
    email: 'user1',
    password: hashPassword('1234'),
    full_name: 'User One',
    company: 'Nike',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user2',
    password: hashPassword('1234'),
    full_name: 'User Two',
    company: 'Adidas',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin',
    password: hashPassword('1234'),
    full_name: 'Super Administrator',
    company: 'Tickefy',
    role: 'super_admin',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Интерфейс для мини-админа
export interface MiniAdmin {
  id: string
  name: string
  email: string
  password: string
  phone: string
  companies: string[]
  accessLevel: 'manager' | 'senior_admin'
  status: 'active' | 'inactive'
  created_at: string
}

// Массив мини-админов с зашифрованными паролями
export let mockMiniAdmins: MiniAdmin[] = [
  {
    id: '1',
    name: 'Nike Manager',
    email: 'nike.admin@example.com',
    password: hashPassword('nike123'),
    phone: '+7 (999) 123-45-67',
    companies: ['Nike'],
    accessLevel: 'manager',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Adidas Manager',
    email: 'adidas.admin@example.com',
    password: hashPassword('adidas123'),
    phone: '+7 (999) 234-56-78',
    companies: ['Adidas'],
    accessLevel: 'manager',
    status: 'active',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: 'Senior Admin',
    email: 'senior.admin@example.com',
    password: hashPassword('senior123'),
    phone: '+7 (999) 345-67-89',
    companies: ['Nike', 'Adidas'],
    accessLevel: 'senior_admin',
    status: 'active',
    created_at: '2024-01-17T00:00:00Z'
  }
]

// Храним текущего пользователя только в памяти
let currentUserInMemory: any = null

// Получаем пользователя из памяти
const getCurrentUserFromMemory = () => {
  return currentUserInMemory
}

// Сохраняем пользователя в память
const storeUserInMemory = (user: any) => {
  currentUserInMemory = user
}

// Удаляем пользователя из памяти
const removeUserFromMemory = () => {
  currentUserInMemory = null
}

// Мок-функции авторизации
export const mockSignIn = async (email: string, password: string) => {
  console.log('🔍 mockSignIn called with:', { email, password })
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const user = mockUsers.find(u => u.email === email)
  console.log('🔍 Found user:', user)
  
  if (user) {
    const isPasswordValid = verifyPassword(password, user.password)
    console.log('🔍 Password verification:', { 
      providedPassword: password, 
      hashedPassword: user.password, 
      isValid: isPasswordValid 
    })
    
    if (isPasswordValid) {
      const userData = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_metadata: {
          full_name: user.full_name,
          company: user.company,
          role: user.role
        }
      }
      
      console.log('✅ Creating user data:', userData)
      
      // Сохраняем в память
      storeUserInMemory(userData)
      console.log('💾 User stored in memory')
      
      return {
        user: userData,
        error: null
      }
    } else {
      console.log('❌ Password verification failed')
      return {
        user: null,
        error: { message: 'Неверный логин или пароль' }
      }
    }
  } else {
    console.log('❌ User not found')
    return {
      user: null,
      error: { message: 'Неверный логин или пароль' }
    }
  }
}

export const mockSignUp = async (email: string, password: string, fullName?: string, company?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Проверяем, существует ли пользователь
  const existingUser = mockUsers.find(u => u.email === email)
  if (existingUser) {
    return {
      user: null,
      error: { message: 'Пользователь с таким email уже существует' }
    }
  }
  
  // Создаем нового пользователя
  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    password,
    full_name: fullName || '',
    company: company || '',
    role: 'user',
    created_at: new Date().toISOString()
  }
  
  mockUsers.push(newUser)
  
  const userData = {
    id: newUser.id,
    email: newUser.email,
    created_at: newUser.created_at,
    user_metadata: {
      full_name: newUser.full_name,
      company: newUser.company,
      role: newUser.role
    }
  }
  
  // Сохраняем в память
  storeUserInMemory(userData)
  
  return {
    user: userData,
    error: null
  }
}

export const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  removeUserFromMemory()
  console.log('mockSignOut - User removed from memory')
  return { error: null }
}

// Функция для принудительной очистки localStorage (для отладки)
export const clearMockAuth = () => {
  removeUserFromMemory()
  console.log('clearMockAuth - memory cleared')
}

export const mockGetCurrentUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Проверяем память для сохраненной сессии
  const storedUser = getCurrentUserFromMemory()
  console.log('mockGetCurrentUser - Stored user:', storedUser)
  
  // Если память пустая или поврежден, возвращаем null
  if (!storedUser || !storedUser.id || !storedUser.email) {
    console.log('mockGetCurrentUser - No valid user found, returning null')
    return null
  }
  
  return storedUser
}

export const mockGetProfile = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const user = mockUsers.find(u => u.id === userId)
  if (user) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company: user.company,
      created_at: user.created_at,
      updated_at: user.created_at
    }
  }
  
  return null
}

// Функции для управления мини-админами
export const getMiniAdmins = async (): Promise<MiniAdmin[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockMiniAdmins
}

export const createMiniAdmin = async (miniAdminData: Omit<MiniAdmin, 'id' | 'created_at'>): Promise<MiniAdmin> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newMiniAdmin: MiniAdmin = {
    id: String(mockMiniAdmins.length + 1),
    ...miniAdminData,
    password: hashPassword(miniAdminData.password), // Шифруем пароль
    created_at: new Date().toISOString()
  }
  
  mockMiniAdmins.push(newMiniAdmin)
  return newMiniAdmin
}

export const updateMiniAdmin = async (id: string, miniAdminData: Partial<MiniAdmin>): Promise<MiniAdmin | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockMiniAdmins.findIndex(admin => admin.id === id)
  if (index !== -1) {
    mockMiniAdmins[index] = { ...mockMiniAdmins[index], ...miniAdminData }
    return mockMiniAdmins[index]
  }
  
  return null
}

export const deleteMiniAdmin = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockMiniAdmins.findIndex(admin => admin.id === id)
  if (index !== -1) {
    mockMiniAdmins.splice(index, 1)
    return true
  }
  
  return false
} 