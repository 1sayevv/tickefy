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
    const customers = getCustomersFromStorage()
    const customer = customers.find(c => c.username === username && c.password === password)
    
    if (customer) {
      console.log('✅ Customer authenticated:', customer)
      return customer
    }
    
    console.log('❌ Customer authentication failed for username:', username)
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