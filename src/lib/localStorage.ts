export interface CustomerData {
  id: string
  companyName: string
  address: string
  phoneNumber: string
  customerSince: string
  firstName: string
  lastName: string
  mobileNumber: string
  login: string
  position: string
  username: string
  password: string
  createdAt: string
}

const CUSTOMERS_STORAGE_KEY = 'customers'

// Получить всех customers из localStorage
export const getCustomersFromStorage = (): CustomerData[] => {
  try {
    const customers = localStorage.getItem(CUSTOMERS_STORAGE_KEY)
    return customers ? JSON.parse(customers) : []
  } catch (error) {
    console.error('Error reading customers from localStorage:', error)
    return []
  }
}

// Сохранить customer в localStorage
export const saveCustomerToStorage = (customerData: Omit<CustomerData, 'id' | 'createdAt'>): CustomerData => {
  try {
    const existingCustomers = getCustomersFromStorage()
    
    const newCustomer: CustomerData = {
      ...customerData,
      id: String(Date.now()), // Простой способ генерации ID
      createdAt: new Date().toISOString()
    }
    
    const updatedCustomers = [...existingCustomers, newCustomer]
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers))
    
    console.log('✅ Customer saved to localStorage:', newCustomer)
    return newCustomer
  } catch (error) {
    console.error('Error saving customer to localStorage:', error)
    throw new Error('Failed to save customer')
  }
}

// Проверить авторизацию customer
export const authenticateCustomer = (username: string, password: string): CustomerData | null => {
  try {
    // Загружаем массив customers из localStorage
    const customers: CustomerData[] = JSON.parse(localStorage.getItem('customers') || '[]')
    console.log('🔍 Searching for customer with username:', username)
    console.log('🔍 Available customers:', customers.map((c: CustomerData) => ({ username: c.username, login: c.login })))
    
    // Ищем пользователя по username и password
    const customer = customers.find((c: CustomerData) => c.username === username && c.password === password)
    
    if (customer) {
      console.log('✅ Customer authenticated:', customer)
      return customer
    }
    
    console.log('❌ Customer authentication failed for username:', username)
    console.log('❌ Available usernames:', customers.map((c: CustomerData) => c.username))
    console.log('❌ Available passwords:', customers.map((c: CustomerData) => c.password))
    return null
  } catch (error) {
    console.error('Error authenticating customer:', error)
    return null
  }
}

// Получить customer по ID
export const getCustomerById = (id: string): CustomerData | null => {
  try {
    const customers = getCustomersFromStorage()
    return customers.find(c => c.id === id) || null
  } catch (error) {
    console.error('Error getting customer by ID:', error)
    return null
  }
}

// Обновить customer
export const updateCustomerInStorage = (id: string, updates: Partial<CustomerData>): CustomerData | null => {
  try {
    const customers = getCustomersFromStorage()
    const customerIndex = customers.findIndex(c => c.id === id)
    
    if (customerIndex === -1) {
      return null
    }
    
    const updatedCustomer = { ...customers[customerIndex], ...updates }
    customers[customerIndex] = updatedCustomer
    
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers))
    
    console.log('✅ Customer updated in localStorage:', updatedCustomer)
    return updatedCustomer
  } catch (error) {
    console.error('Error updating customer in localStorage:', error)
    return null
  }
}

// Удалить customer
export const deleteCustomerFromStorage = (id: string): boolean => {
  try {
    const customers = getCustomersFromStorage()
    const filteredCustomers = customers.filter(c => c.id !== id)
    
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(filteredCustomers))
    
    console.log('✅ Customer deleted from localStorage:', id)
    return true
  } catch (error) {
    console.error('Error deleting customer from localStorage:', error)
    return false
  }
}

// Отладочная функция для проверки всех customers
export const debugCustomers = () => {
  try {
    const customers = getCustomersFromStorage()
    console.log('🔍 Debug: All customers in localStorage:', customers)
    console.log('🔍 Debug: Customer count:', customers.length)
    customers.forEach((customer, index) => {
      console.log(`🔍 Debug: Customer ${index + 1}:`, {
        id: customer.id,
        username: customer.username,
        login: customer.login,
        password: customer.password,
        companyName: customer.companyName
      })
    })
    return customers
  } catch (error) {
    console.error('Error debugging customers:', error)
    return []
  }
}

// ===== REGULAR USERS MANAGEMENT =====

export interface RegularUserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  position: string
  username: string // Username for login
  password: string // Password for login
  companyName: string // Company from the customer who created this user
  createdBy: string // Customer ID who created this user
  status: 'active' | 'inactive'
  createdAt: string
}

const REGULAR_USERS_STORAGE_KEY = 'regularUsers'

// Получить всех regular users из localStorage
export const getRegularUsersFromStorage = (): RegularUserData[] => {
  try {
    const users = localStorage.getItem(REGULAR_USERS_STORAGE_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error('Error reading regular users from localStorage:', error)
    return []
  }
}

// Получить regular users по компании
export const getRegularUsersByCompany = (companyName: string): RegularUserData[] => {
  try {
    const users = getRegularUsersFromStorage()
    return users.filter(user => user.companyName === companyName)
  } catch (error) {
    console.error('Error getting regular users by company:', error)
    return []
  }
}

// Сохранить regular user в localStorage
export const saveRegularUserToStorage = (userData: Omit<RegularUserData, 'id' | 'createdAt'>): RegularUserData => {
  try {
    const existingUsers = getRegularUsersFromStorage()
    
    const newUser: RegularUserData = {
      ...userData,
      id: String(Date.now()), // Простой способ генерации ID
      createdAt: new Date().toISOString()
    }
    
    const updatedUsers = [...existingUsers, newUser]
    localStorage.setItem(REGULAR_USERS_STORAGE_KEY, JSON.stringify(updatedUsers))
    
    console.log('✅ Regular user saved to localStorage:', newUser)
    return newUser
  } catch (error) {
    console.error('Error saving regular user to localStorage:', error)
    throw new Error('Failed to save regular user')
  }
}

// Обновить regular user
export const updateRegularUserInStorage = (id: string, updates: Partial<RegularUserData>): RegularUserData | null => {
  try {
    const users = getRegularUsersFromStorage()
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return null
    }
    
    const updatedUser = { ...users[userIndex], ...updates }
    users[userIndex] = updatedUser
    
    localStorage.setItem(REGULAR_USERS_STORAGE_KEY, JSON.stringify(users))
    
    console.log('✅ Regular user updated in localStorage:', updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating regular user in localStorage:', error)
    return null
  }
}

// Удалить regular user
export const deleteRegularUserFromStorage = (id: string): boolean => {
  try {
    const users = getRegularUsersFromStorage()
    const filteredUsers = users.filter(u => u.id !== id)
    
    localStorage.setItem(REGULAR_USERS_STORAGE_KEY, JSON.stringify(filteredUsers))
    
    console.log('✅ Regular user deleted from localStorage:', id)
    return true
  } catch (error) {
    console.error('Error deleting regular user from localStorage:', error)
    return false
  }
}

// Отладочная функция для проверки всех regular users
export const debugRegularUsers = () => {
  try {
    const users = getRegularUsersFromStorage()
    console.log('🔍 Debug: All regular users in localStorage:', users)
    console.log('🔍 Debug: Regular users count:', users.length)
    users.forEach((user, index) => {
      console.log(`🔍 Debug: Regular User ${index + 1}:`, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        password: user.password,
        companyName: user.companyName,
        createdBy: user.createdBy
      })
    })
    return users
  } catch (error) {
    console.error('Error debugging regular users:', error)
    return []
  }
}

// ===== REGULAR USER AUTHENTICATION =====

// Проверить авторизацию regular user
export const authenticateRegularUser = (username: string, password: string): RegularUserData | null => {
  try {
    // Загружаем массив regular users из localStorage
    const users: RegularUserData[] = JSON.parse(localStorage.getItem('regularUsers') || '[]')
    console.log('🔍 Searching for regular user with username:', username)
    console.log('🔍 Available regular users:', users.map((u: RegularUserData) => ({ username: u.username, email: u.email })))
    
    // Ищем пользователя по username и password
    const user = users.find((u: RegularUserData) => u.username === username && u.password === password)
    
    if (user) {
      console.log('✅ Regular user authenticated:', user)
      return user
    }
    
    console.log('❌ Regular user authentication failed for username:', username)
    console.log('❌ Available usernames:', users.map((u: RegularUserData) => u.username))
    return null
  } catch (error) {
    console.error('Error authenticating regular user:', error)
    return null
  }
}

// Получить regular user по ID
export const getRegularUserById = (id: string): RegularUserData | null => {
  try {
    const users = getRegularUsersFromStorage()
    return users.find(u => u.id === id) || null
  } catch (error) {
    console.error('Error getting regular user by ID:', error)
    return null
  }
} 