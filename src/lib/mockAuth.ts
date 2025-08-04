// Мок-пользователи для тестирования
export const mockUsers = [
  {
    id: '1',
    email: 'user1@examplemail.com',
    password: 'user123',
    full_name: 'User One',
    company: 'Nike',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user2@examplemail.com',
    password: 'user213',
    full_name: 'User Two',
    company: 'Adidas',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'admin123',
    full_name: 'Administrator',
    company: 'Tickefy',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Проверяем, есть ли сохраненная сессия в localStorage
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('tickefy_user')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

// Сохраняем пользователя в localStorage
const storeUser = (user: any) => {
  try {
    localStorage.setItem('tickefy_user', JSON.stringify(user))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

// Удаляем пользователя из localStorage
const removeStoredUser = () => {
  try {
    localStorage.removeItem('tickefy_user')
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Мок-функции авторизации
export const mockSignIn = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const user = mockUsers.find(u => u.email === email && u.password === password)
  
  if (user) {
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
    
    // Сохраняем в localStorage
    storeUser(userData)
    
    return {
      user: userData,
      error: null
    }
  } else {
    return {
      user: null,
      error: { message: 'Неверный email или пароль' }
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
  
  // Сохраняем в localStorage
  storeUser(userData)
  
  return {
    user: userData,
    error: null
  }
}

export const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  removeStoredUser()
  console.log('mockSignOut - User removed from localStorage')
  return { error: null }
}

// Функция для принудительной очистки localStorage (для отладки)
export const clearMockAuth = () => {
  removeStoredUser()
  console.log('clearMockAuth - localStorage cleared')
}

export const mockGetCurrentUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Проверяем localStorage для сохраненной сессии
  const storedUser = getStoredUser()
  console.log('mockGetCurrentUser - Stored user:', storedUser)
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