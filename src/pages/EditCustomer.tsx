import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { getCustomersFromStorage, updateCustomerInStorage, CustomerData } from '@/lib/localStorage'
import { getCustomers, updateCustomer, Customer } from '@/lib/mockAuth'
import { decryptPassword, hashPassword } from '@/lib/encryption'
import { useToast } from '@/contexts/ToastContext'
import AdminLayout from '@/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Building, User } from 'lucide-react'

export default function EditCustomer() {
  const { t } = useTranslation()
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  
  const [customer, setCustomer] = useState<Customer | CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    status: 'active' as 'active' | 'inactive'
  })

  useEffect(() => {
    if (customerId) {
      loadCustomer()
    }
  }, [customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      
      // First try to find in localStorage
      const localStorageCustomers = getCustomersFromStorage()
      let foundCustomer = localStorageCustomers.find(c => c.id === customerId)
      let isLocalStorageCustomer = true
      
      if (!foundCustomer) {
        // Try to find in mockAuth
        const mockCustomers = await getCustomers()
        const mockCustomer = mockCustomers.find(c => c.id === customerId)
        if (mockCustomer) {
          foundCustomer = mockCustomer as any // Type assertion for compatibility
          isLocalStorageCustomer = false
        }
      }
      
      if (foundCustomer) {
        setCustomer(foundCustomer)
        
        if (isLocalStorageCustomer) {
          // localStorage customer
          const localCustomer = foundCustomer as CustomerData
          setFormData({
            name: `${localCustomer.firstName} ${localCustomer.lastName}`,
            email: localCustomer.login,
            password: localCustomer.password,
            phone: localCustomer.mobileNumber,
            company: localCustomer.companyName,
            status: 'active' as 'active' | 'inactive'
          })
        } else {
          // mockAuth customer
          const mockCustomer = foundCustomer as any
          setFormData({
            name: mockCustomer.name,
            email: mockCustomer.email,
            password: decryptPassword(mockCustomer.password),
            phone: mockCustomer.phone,
            company: mockCustomer.company,
            status: mockCustomer.status
          })
        }
      } else {
        console.error('Customer not found')
        navigate('/super-admin')
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      navigate('/super-admin')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customer) return
    
    try {
      setSaving(true)
      
      const isLocalStorageCustomer = 'companyName' in customer
      
      if (isLocalStorageCustomer) {
        // Update localStorage customer
        const localCustomer = customer as CustomerData
        const [firstName, ...lastNameParts] = formData.name.split(' ')
        const lastName = lastNameParts.join(' ')
        
        const updatedCustomer: CustomerData = {
          ...localCustomer,
          firstName: firstName || '',
          lastName: lastName || '',
          login: formData.email,
          password: formData.password,
          mobileNumber: formData.phone,
          companyName: formData.company
        }
        
        const result = updateCustomerInStorage(customer.id, {
          firstName: firstName || '',
          lastName: lastName || '',
          login: formData.email,
          password: formData.password,
          mobileNumber: formData.phone,
          companyName: formData.company
        })
        
        if (!result) {
          throw new Error('Failed to update customer')
        }
      } else {
        // Update mockAuth customer
        const mockCustomer = customer as Customer
        const updatedCustomer: Customer = {
          ...mockCustomer,
          name: formData.name,
          email: formData.email,
          password: formData.password, // Note: This should be encrypted in real app
          phone: formData.phone,
          company: formData.company,
          status: formData.status
        }
        
        const result = await updateCustomer(customer.id, {
          name: formData.name,
          email: formData.email,
          password: hashPassword(formData.password),
          phone: formData.phone,
          company: formData.company,
          status: formData.status
        })
        
        if (!result) {
          throw new Error('Failed to update customer')
        }
      }
      
      showSuccess('Success!', 'Customer updated successfully!')
      setTimeout(() => {
        navigate('/super-admin')
      }, 1500)
    } catch (error) {
      console.error('Error updating customer:', error)
      showError('Error!', 'Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading customer...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h1>
            <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/super-admin')}>
              Back to Customers
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const isLocalStorageCustomer = 'companyName' in customer
  const customerName = isLocalStorageCustomer 
    ? `${customer.firstName} ${customer.lastName}`
    : customer.name
  const customerEmail = isLocalStorageCustomer 
    ? customer.login
    : customer.email
  const customerCompany = isLocalStorageCustomer 
    ? customer.companyName
    : customer.company

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/super-admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Customers
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Edit Customer
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Update customer information and settings
                </p>
              </div>
            </div>
            <Badge className={`text-sm ${getStatusColor(formData.status)}`}>
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Edit Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/super-admin')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 