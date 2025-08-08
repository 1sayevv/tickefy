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
    full_name: 'Root Administrator',
    company: 'Tickefy',
    role: 'super_admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'customer',
    password: hashPassword('1234'),
    full_name: 'Nike Customer',
    company: 'Nike',
    role: 'customer',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Интерфейс для клиента (заменяет мини-админа)
export interface Customer {
  id: string
  name: string
  email: string
  password: string
  phone: string
  company: string
  status: 'active' | 'inactive'
  created_at: string
}

// Новый интерфейс для обычного пользователя компании (Regular User)
export interface RegularUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  username: string
  password: string
  status: 'active' | 'inactive'
  company: string
  created_at: string
}

// Массив клиентов с зашифрованными паролями
export let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Nike Customer',
    email: 'nike.customer@example.com',
    password: hashPassword('nike123'),
    phone: '+994 (50) 123-45-67',
    company: 'Nike',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Adidas Customer',
    email: 'adidas.customer@example.com',
    password: hashPassword('adidas123'),
    phone: '+994 (50) 234-56-78',
    company: 'Adidas',
    status: 'active',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: 'Premium Customer',
    email: 'premium.customer@example.com',
    password: hashPassword('premium123'),
    phone: '+994 (50) 345-67-89',
    company: 'Premium Corp',
    status: 'active',
    created_at: '2024-01-17T00:00:00Z'
  }
]

// Начальные мок-пользователи компаний
export let mockCompanyUsers: RegularUser[] = [
  {
    id: '101',
    firstName: 'Elvin',
    lastName: 'Aliyev',
    email: 'elvin.nike@example.com',
    phone: '+994 (50) 111-22-33',
    position: 'Engineer',
    username: 'elvin',
    password: hashPassword('1234'),
    status: 'active',
    company: 'Nike',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '102',
    firstName: 'Aynur',
    lastName: 'Huseynova',
    email: 'aynur.adidas@example.com',
    phone: '+994 (50) 222-33-44',
    position: 'Support',
    username: 'aynur',
    password: hashPassword('1234'),
    status: 'active',
    company: 'Adidas',
    created_at: '2024-02-02T00:00:00Z'
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
export const getCustomers = async (): Promise<Customer[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCustomers
}

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newCustomer: Customer = {
    id: String(mockCustomers.length + 1),
    ...customerData,
    password: hashPassword(customerData.password), // Шифруем пароль
    created_at: new Date().toISOString()
  }
  
  mockCustomers.push(newCustomer)

  // Также создаем учетную запись для входа как Customer
  const newAuthUser = {
    id: String(mockUsers.length + 1),
    email: newCustomer.email,
    password: newCustomer.password,
    full_name: newCustomer.name,
    company: newCustomer.company,
    role: 'customer',
    created_at: newCustomer.created_at
  }
  ;(mockUsers as any[]).push(newAuthUser)

  return newCustomer
}

export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockCustomers.findIndex(customer => customer.id === id)
  if (index !== -1) {
    mockCustomers[index] = { ...mockCustomers[index], ...customerData }
    return mockCustomers[index]
  }
  
  return null
}

export const deleteCustomer = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockCustomers.findIndex(customer => customer.id === id)
  if (index !== -1) {
    mockCustomers.splice(index, 1)
    return true
  }
  
  return false
} 

// CRUD для пользователей компании (Regular Users)
export const getUsersByCompany = async (company: string): Promise<RegularUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCompanyUsers.filter(u => u.company === company)
}

export const createRegularUser = async (userData: Omit<RegularUser, 'id' | 'created_at'>): Promise<RegularUser> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  const newUser: RegularUser = {
    id: String(Date.now()),
    ...userData,
    password: hashPassword(userData.password),
    created_at: new Date().toISOString()
  }
  mockCompanyUsers.push(newUser)

  // Создаем также учетку для входа
  ;(mockUsers as any[]).push({
    id: String(mockUsers.length + 1),
    email: newUser.email,
    password: newUser.password,
    full_name: `${newUser.firstName} ${newUser.lastName}`,
    company: newUser.company,
    role: 'user',
    created_at: newUser.created_at
  })

  return newUser
}

export const updateRegularUser = async (id: string, updates: Partial<RegularUser>): Promise<RegularUser | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const idx = mockCompanyUsers.findIndex(u => u.id === id)
  if (idx === -1) return null
  const current = mockCompanyUsers[idx]
  const next: RegularUser = {
    ...current,
    ...updates,
    password: updates.password ? hashPassword(updates.password) : current.password
  }
  mockCompanyUsers[idx] = next
  return next
}

export const deleteRegularUser = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const idx = mockCompanyUsers.findIndex(u => u.id === id)
  if (idx === -1) return false
  const removed = mockCompanyUsers.splice(idx, 1)[0]
  // Удаляем и из mockUsers по email
  const authIdx = (mockUsers as any[]).findIndex((u: any) => u.email === removed.email)
  if (authIdx !== -1) {
    ;(mockUsers as any[]).splice(authIdx, 1)
  }
  return true
} 