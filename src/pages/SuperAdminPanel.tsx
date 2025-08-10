import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getCustomers, updateCustomer, deleteCustomer, Customer } from '@/lib/mockAuth'
import { getCustomersFromStorage, updateCustomerInStorage, deleteCustomerFromStorage, CustomerData } from '@/lib/localStorage'
import { decryptPassword } from '@/lib/encryption'
import { Edit, Trash2, Plus, UserCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

export default function SuperAdminPanel() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [customers, setCustomers] = useState<(Customer | CustomerData)[]>([])
  const [loading, setLoading] = useState(true)

  // Состояния для уведомлений
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
    show: boolean
  }>({
    type: 'success',
    message: '',
    show: false
  })

  // Состояние для модального окна подтверждения удаления
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    show: boolean
    customerId: string | null
    customerName: string
  }>({
    show: false,
    customerId: null,
    customerName: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  // Добавляем слушатель для обновления списка при изменении localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      loadCustomers()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      
      // Загружаем customers из mockAuth (старые)
      const mockCustomers = await getCustomers()
      
      // Загружаем customers из localStorage (новые)
      const localStorageCustomers = getCustomersFromStorage()
      
      // Объединяем все customers
      const allCustomers = [...mockCustomers, ...localStorageCustomers]
      
      console.log('📊 Loaded customers:', {
        mock: mockCustomers.length,
        localStorage: localStorageCustomers.length,
        total: allCustomers.length
      })
      
      setCustomers(allCustomers)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }





  const handleDeleteCustomer = async (id: string, name: string) => {
    setDeleteConfirmModal({
      show: true,
      customerId: id,
      customerName: name
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmModal.customerId) return
    
    try {
      // Находим customer для определения его типа
      const customer = customers.find(c => c.id === deleteConfirmModal.customerId)
      
      if (customer && 'companyName' in customer) {
        // Удаляем customer из localStorage
        const success = deleteCustomerFromStorage(deleteConfirmModal.customerId)
        if (!success) {
          throw new Error('Failed to delete customer from localStorage')
        }
      } else {
        // Удаляем customer из mockAuth
        await deleteCustomer(deleteConfirmModal.customerId)
      }
      
      setDeleteConfirmModal({ show: false, customerId: null, customerName: '' })
      loadCustomers()
      showNotification('success', '✅ Customer deleted')
    } catch (error) {
      console.error('Error deleting customer:', error)
      showNotification('error', '❌ Error deleting customer')
    }
  }

  const handleToggleStatus = async (customer: Customer) => {
    try {
      const newStatus = customer.status === 'active' ? 'inactive' : 'active'
      await updateCustomer(customer.id, { status: newStatus })
      loadCustomers()
      showNotification('success', `✅ Status changed to ${newStatus === 'active' ? 'active' : 'inactive'}`)
    } catch (error) {
      console.error('Error toggling status:', error)
      showNotification('error', '❌ Error changing status')
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

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Customers</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and manage customers for various companies
          </p>
        </div>

        <div className="mb-4 sm:mb-6 flex gap-2 flex-wrap">
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => navigate('/customers/create')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Customer</span>
            <span className="sm:hidden">Create</span>
          </Button>
          

          
          <Button 
            variant="outline"
            onClick={() => {
              const customers = JSON.parse(localStorage.getItem('customers') || '[]')
              console.log('🔍 Test: All customers:', customers)
              if (customers.length > 0) {
                const lastCustomer = customers[customers.length - 1]
                console.log('🔍 Test: Last customer:', lastCustomer)
                showNotification('info', `Last customer: ${lastCustomer.username} / ${lastCustomer.password}`)
              } else {
                showNotification('info', 'No customers found')
              }
            }}
          >
            Test Customer
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).debugMockAuth) {
                (window as any).debugMockAuth()
                showNotification('info', 'Check console for mockAuth debug info')
              } else {
                showNotification('error', 'Debug function not available')
              }
            }}
          >
            Debug MockAuth
          </Button>
        </div>

        {/* Уведомления */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Таблица клиентов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Customers ({customers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No customers</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Username / Email</th>
                      <th className="text-left py-3 px-4 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      // Определяем тип customer и извлекаем данные
                      const isLocalStorageCustomer = 'companyName' in customer
                      
                      const customerName = isLocalStorageCustomer 
                        ? `${customer.firstName} ${customer.lastName}`
                        : customer.name
                      
                      const customerEmail = isLocalStorageCustomer 
                        ? customer.login
                        : customer.email
                      
                      const customerPhone = isLocalStorageCustomer 
                        ? customer.mobileNumber
                        : customer.phone
                      
                      const customerCompany = isLocalStorageCustomer 
                        ? customer.companyName
                        : customer.company
                      
                      const customerStatus = isLocalStorageCustomer 
                        ? 'active' // localStorage customers всегда активны
                        : customer.status
                      
                      const customerCreatedAt = isLocalStorageCustomer 
                        ? customer.createdAt
                        : customer.created_at
                      
                      return (
                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{customerName}</td>
                          <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{isLocalStorageCustomer ? customer.username : customerName}</div>
                            <div className="text-sm text-gray-500">{customerEmail}</div>
                          </div>
                        </td>
                          <td className="py-3 px-4">{customerPhone}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {customerCompany}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(customerStatus)}`}>
                              {customerStatus === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(customerCreatedAt)}
                          </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(customer as Customer)}
                              className={customerStatus === 'active' ? 'text-red-600' : 'text-green-600'}
                            >
                              {customerStatus === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCustomer(customer.id, customerName)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>



        {/* Модальное окно подтверждения удаления */}
        <Dialog open={deleteConfirmModal.show} onOpenChange={(open) => !open && setDeleteConfirmModal(prev => ({ ...prev, show: false }))}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete customer <strong>{deleteConfirmModal.customerName}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteConfirmModal(prev => ({ ...prev, show: false }))}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
} 