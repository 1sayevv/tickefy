import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { saveRegularUserToStorage, getRegularUsersByCompany } from '@/lib/localStorage'
import MainLayout from '@/layouts/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateRegularUser() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    username: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)

  const getCurrentCompany = () => {
    if (user?.user_metadata?.role === 'customer') {
      return user.user_metadata.company || ''
    }
    return ''
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.firstName.trim()) errors.push('First name is required')
    if (!formData.lastName.trim()) errors.push('Last name is required')
    if (!formData.email.trim()) errors.push('Email is required')
    if (!formData.phoneNumber.trim()) errors.push('Phone number is required')
    if (!formData.position.trim()) errors.push('Position is required')
    if (!formData.username.trim()) errors.push('Username is required')
    if (!formData.password.trim()) errors.push('Password is required')
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Invalid email format')
    }
    
    // Check username and password length
    if (formData.username.length < 3) {
      errors.push('Username must be at least 3 characters')
    }
    if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters')
    }
    
    const existingUsers = getRegularUsersByCompany(getCurrentCompany())
    const isEmailExists = existingUsers.some(user => user.email === formData.email)
    if (isEmailExists) {
      errors.push('User with this email already exists')
    }
    
    // Check username uniqueness
    const isUsernameExists = existingUsers.some(user => user.username === formData.username)
    if (isUsernameExists) {
      errors.push('User with this username already exists')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔍 Creating regular user with data:', formData)
      
      const errors = validateForm()
      if (errors.length > 0) {
        errors.forEach(error => alert(error))
        setLoading(false)
        return
      }

      const currentCompany = getCurrentCompany()
      const currentCustomerId = user?.id || localStorage.getItem('currentCustomerId')
      
      if (!currentCompany || !currentCustomerId) {
        alert('Error: Could not determine company')
        setLoading(false)
        return
      }

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        position: formData.position.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        companyName: currentCompany,
        createdBy: currentCustomerId,
        status: 'active' as const
      }

      console.log('🔍 Saving regular user:', userData)
      
      const savedUser = saveRegularUserToStorage(userData)
      
      console.log('✅ Regular user created successfully:', savedUser)
      
      alert('User created successfully!')
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        position: '',
        username: '',
        password: ''
      })
      
      navigate('/users')
      
    } catch (error) {
      console.error('❌ Error creating regular user:', error)
      alert('Error creating user')
    } finally {
      setLoading(false)
    }
  }

  const positions = [
    'Manager', 'Developer', 'Designer', 'Analyst', 'Tester',
    'Marketer', 'Sales', 'Accountant', 'HR', 'Other'
  ]

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Create User
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2">
            Create a new user for your company
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm sm:text-base font-medium">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm sm:text-base font-medium">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm sm:text-base font-medium">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                    placeholder="user@company.com"
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm sm:text-base font-medium">Phone Number *</label>
                  <input
                    id="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="block text-sm sm:text-base font-medium">Position *</label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('position', e.target.value)}
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select position</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm sm:text-base font-medium">Username *</label>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                      placeholder="john_doe"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <p className="text-xs sm:text-sm text-gray-500">Minimum 3 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm sm:text-base font-medium">Password *</label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <p className="text-xs sm:text-sm text-gray-500">Minimum 6 characters</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium">Company</label>
                <input
                  type="text"
                  value={getCurrentCompany()}
                  disabled
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
                />
                <p className="text-xs sm:text-sm text-gray-600">
                  User will be created for company: {getCurrentCompany()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium">Created</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString()}
                  disabled
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
                />
                <p className="text-xs sm:text-sm text-gray-600">
                  Creation date: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 