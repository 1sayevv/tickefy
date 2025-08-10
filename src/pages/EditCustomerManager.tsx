import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { getRegularUsersFromStorage, updateRegularUserInStorage, getCustomersFromStorage } from '@/lib/localStorage'
import { useToast } from '@/contexts/ToastContext'
import AdminLayout from '@/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, UserCheck } from 'lucide-react'

export default function EditCustomerManager() {
  const { t } = useTranslation()
  const { managerId } = useParams<{ managerId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  
  const [manager, setManager] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    companyName: '',
    status: 'active' as 'active' | 'inactive'
  })

  // Get all customers/companies for the dropdown
  const customers = getCustomersFromStorage()

  useEffect(() => {
    if (managerId) {
      loadManager()
    }
  }, [managerId])

  const loadManager = () => {
    try {
      setLoading(true)
      const allUsers = getRegularUsersFromStorage()
      const foundManager = allUsers.find(user => user.id === managerId)
      
      if (foundManager) {
        setManager(foundManager)
        setFormData({
          firstName: foundManager.firstName || '',
          lastName: foundManager.lastName || '',
          email: foundManager.email || '',
          phoneNumber: foundManager.phoneNumber || '',
          position: foundManager.position || '',
          companyName: foundManager.companyName || '',
          status: foundManager.status || 'active'
        })
      } else {
        console.error('Manager not found')
        navigate('/customer-managers')
      }
    } catch (error) {
      console.error('Error loading manager:', error)
      navigate('/customer-managers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!manager) return
    
    try {
      setSaving(true)
      
      const updatedManager = {
        ...manager,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        position: formData.position,
        companyName: formData.companyName,
        status: formData.status,
        updatedAt: new Date().toISOString()
      }
      
      const result = updateRegularUserInStorage(manager.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        position: formData.position,
        companyName: formData.companyName,
        status: formData.status
      })
      
      if (!result) {
        throw new Error('Failed to update manager')
      }
      
      showSuccess('Success!', 'Customer manager updated successfully!')
      setTimeout(() => {
        navigate('/customer-managers')
      }, 1500)
    } catch (error) {
      console.error('Error updating manager:', error)
      showError('Error!', 'Failed to update customer manager')
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading manager...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!manager) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Manager Not Found</h1>
            <p className="text-gray-600 mb-6">The manager you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/customer-managers')}>
              Back to Managers
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

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
                onClick={() => navigate('/customer-managers')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Managers
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Edit Customer Manager
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Update manager information and settings
                </p>
              </div>
            </div>
            <Badge className={`text-sm ${manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {manager.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Edit Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Manager Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Customer Success Manager"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Assigned Company *
                    </label>
                    <select
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a company</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.companyName}>
                          {customer.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/customer-managers')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
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