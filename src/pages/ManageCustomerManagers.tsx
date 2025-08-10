import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { getRegularUsersFromStorage, deleteRegularUserFromStorage, getCustomersFromStorage } from '@/lib/localStorage'
import AdminLayout from '@/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, UserCheck, UserX } from 'lucide-react'

export default function ManageCustomerManagers() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [managers, setManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Get all customers/companies for the dropdown
  const customers = getCustomersFromStorage()

  useEffect(() => {
    loadManagers()
  }, [])

  const loadManagers = () => {
    try {
      setLoading(true)
      const allUsers = getRegularUsersFromStorage()
      // Filter users who are customer managers (created by root admin for specific companies)
      const customerManagers = allUsers.filter(user => {
        // Check if this user was created by a customer (has a customer ID as createdBy)
        const createdByCustomer = customers.find(customer => customer.id === user.createdBy)
        return createdByCustomer && user.companyName
      })
      
      console.log('🔍 Loaded customer managers:', customerManagers)
      setManagers(customerManagers)
    } catch (error) {
      console.error('Error loading customer managers:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer manager?')) {
      try {
        deleteRegularUserFromStorage(id)
        loadManagers()
        alert('Customer manager deleted successfully!')
      } catch (error) {
        console.error('Error deleting customer manager:', error)
        alert('Error deleting customer manager')
      }
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

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Manage Customer Managers
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2">
                Create and manage users who can handle tickets for customer companies
              </p>
            </div>
            <Button 
              onClick={() => navigate('/customer-managers/create')}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Manager
            </Button>
          </div>
        </div>

        

        {/* Managers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Customer Managers ({managers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Loading managers...</span>
              </div>
            ) : managers.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Customer Managers</h3>
                <p className="text-gray-600 mb-4">No customer managers have been created yet.</p>
                <Button onClick={() => navigate('/customer-managers/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Manager
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 font-medium">Position</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((manager) => (
                      <tr key={manager.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{manager.firstName} {manager.lastName}</div>
                            <div className="text-sm text-gray-500">@{manager.username}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{manager.email}</td>
                        <td className="py-3 px-4 text-sm">{manager.phoneNumber}</td>
                        <td className="py-3 px-4 text-sm">{manager.position}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {manager.companyName}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className={manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {manager.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(manager.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/customer-managers/${manager.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(manager.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 