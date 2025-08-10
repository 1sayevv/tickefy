import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import CustomerManagerLayout from '@/layouts/CustomerManagerLayout'
import { getRegularUsersFromStorage } from '@/lib/localStorage'
import { Link } from 'react-router-dom'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  position?: string
  username?: string
  companyName: string
  role: 'customer' | 'user' | 'admin' | 'super_admin'
  createdAt: string
  status?: string
  address?: string
  mobileNumber?: string
  login?: string
}

export default function Profile() {
  const { t } = useTranslation()
  const { user, getUserDisplayName, getUserCompany } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine which layout to use based on user role
  const getLayout = () => {
    if (!user) return MainLayout
    
    const userRole = user.user_metadata?.role
    const isSuperAdmin = user?.email === 'admin' || userRole === 'super_admin'
    const isCustomer = userRole === 'customer'
    
    // Check if user is a customer manager by looking in localStorage
    const allUsers = getRegularUsersFromStorage()
    const isCustomerManager = allUsers.some(manager => 
      (manager.username === user.email || manager.email === user.email) && 
      manager.isCustomerManager === true
    )
    
    if (isSuperAdmin || isCustomer) {
      return AdminLayout
    } else if (isCustomerManager) {
      return CustomerManagerLayout
    } else {
      return MainLayout
    }
  }

  const Layout = getLayout()
  
  console.log('🔍 Profile - Layout selected:', Layout.name)
  console.log('🔍 Profile - User email:', user?.email)
  console.log('🔍 Profile - User role:', user?.user_metadata?.role)
  
  // Debug customer manager detection
  if (user) {
    const allUsers = getRegularUsersFromStorage()
    const isCustomerManager = allUsers.some(manager => 
      manager.username === user.email || manager.email === user.email
    )
    console.log('🔍 Profile - Is customer manager:', isCustomerManager)
    console.log('🔍 Profile - All users:', allUsers.map(u => ({ username: u.username, email: u.email, isCustomerManager: u.isCustomerManager })))
  }

  useEffect(() => {
    const loadProfile = () => {
      setLoading(true)
      
      if (!user) {
        setLoading(false)
        return
      }

      const userRole = user.user_metadata?.role
      let userProfile: UserProfile | null = null

      if (userRole === 'customer') {
        // Загружаем данные customer из sessionStorage
        const customerData = sessionStorage.getItem('currentCustomer')
        if (customerData) {
          const customer = JSON.parse(customerData)
          userProfile = {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.login,
            phoneNumber: customer.phoneNumber,
            position: customer.position,
            username: customer.username,
            companyName: customer.companyName,
            role: 'customer',
            createdAt: customer.createdAt,
            status: 'active',
            address: customer.address,
            mobileNumber: customer.mobileNumber,
            login: customer.login
          }
        }
      } else if (userRole === 'user') {
        // Загружаем данные regular user из sessionStorage
        const regularUserData = sessionStorage.getItem('currentRegularUser')
        if (regularUserData) {
          const regularUser = JSON.parse(regularUserData)
          userProfile = {
            id: regularUser.id,
            firstName: regularUser.firstName,
            lastName: regularUser.lastName,
            email: regularUser.email,
            phoneNumber: regularUser.phoneNumber,
            position: regularUser.position,
            username: regularUser.username,
            companyName: regularUser.companyName,
            role: 'user',
            createdAt: regularUser.createdAt,
            status: regularUser.status
          }
        }
      } else {
        // Для admin и super_admin используем данные из user
        userProfile = {
          id: user.id,
          firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
          email: user.email,
          companyName: user.user_metadata?.company || '',
          role: userRole as any,
          createdAt: user.created_at || new Date().toISOString()
        }
      }

      setProfile(userProfile)
      setLoading(false)
    }

    loadProfile()
  }, [user])

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Customer'
      case 'user':
        return 'Regular User'
      case 'admin':
        return 'Admin'
      case 'super_admin':
        return 'Root Admin'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'admin':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200'
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base text-gray-600">{t('loading')}</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout>
        <div className="w-full">
          <div className="text-center py-12 sm:py-16">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">Unable to load profile information.</p>
            <Button asChild>
              <Link to={user?.user_metadata?.role === 'customer_manager' ? '/customer-manager/dashboard' : '/admin'}>Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {t('profile')}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2">
                {t('profileDescription')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {profile.companyName}
              </Badge>
              <Button asChild variant="outline">
                <Link to={user?.user_metadata?.role === 'customer_manager' ? '/customer-manager/dashboard' : '/admin'}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('backToDashboard')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            {/* Personal Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('personalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('firstName')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">{profile.firstName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('lastName')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">{profile.lastName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('email')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">{profile.email}</p>
                  </div>
                  
                  {profile.username && (
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('username')}
                      </label>
                      <p className="text-sm sm:text-base font-medium">{profile.username}</p>
                    </div>
                  )}
                  
                  {profile.phoneNumber && (
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('phoneNumber')}
                      </label>
                      <p className="text-sm sm:text-base font-medium">{profile.phoneNumber}</p>
                    </div>
                  )}
                  
                  {profile.mobileNumber && (
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('mobileNumber')}
                      </label>
                      <p className="text-sm sm:text-base font-medium">{profile.mobileNumber}</p>
                    </div>
                  )}
                  
                  {profile.position && (
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('position')}
                      </label>
                      <p className="text-sm sm:text-base font-medium">{profile.position}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t('companyInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('companyName')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">{profile.companyName}</p>
                  </div>
                  
                  {profile.address && (
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('address')}
                      </label>
                      <p className="text-sm sm:text-base font-medium">{profile.address}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('registrationDate')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('userID')}
                    </label>
                    <p className="text-sm sm:text-base font-medium font-mono bg-gray-100 px-2 py-1 rounded">
                      {profile.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('accountInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('role')}
                    </label>
                    <Badge className={`text-xs sm:text-sm ${getRoleColor(profile.role)}`}>
                      {getRoleDisplayName(profile.role)}
                    </Badge>
                  </div>
                  
                  {profile.status && (
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t('status')}
                      </label>
                      <Badge className={`text-xs sm:text-sm ${getStatusColor(profile.status)}`}>
                        {profile.status === 'active' ? t('active') : t('inactive')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('lastLogin')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">
                      {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {t('accountType')}
                    </label>
                    <p className="text-sm sm:text-base font-medium">
                      {profile.role === 'customer' ? t('customerAccount') : 
                       profile.role === 'user' ? t('regularUserAccount') : 
                       profile.role === 'admin' ? t('adminAccount') : t('rootAdminAccount')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </Layout>
  )
} 