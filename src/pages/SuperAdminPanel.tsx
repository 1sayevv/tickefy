import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getCustomers, updateCustomer, deleteCustomer, Customer } from '@/lib/mockAuth'
import { decryptPassword } from '@/lib/encryption'
import { Edit, Trash2, Plus, UserCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

export default function SuperAdminPanel() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    status: 'active' as 'active' | 'inactive'
  })

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

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const customersData = await getCustomers()
      setCustomers(customersData)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return
    
    try {
      await updateCustomer(editingCustomer.id, formData)
      setIsEditModalOpen(false)
      setEditingCustomer(null)
      setFormData({ name: '', email: '', password: '', phone: '', company: '', status: 'active' })
      loadCustomers()
      showNotification('success', '✅ Changes saved')
    } catch (error) {
      console.error('Error updating customer:', error)
      showNotification('error', '❌ Error saving changes')
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
      await deleteCustomer(deleteConfirmModal.customerId)
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

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      password: decryptPassword(customer.password),
      phone: customer.phone,
      company: customer.company,
      status: customer.status
    })
    setIsEditModalOpen(true)
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Customers</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and manage customers for various companies
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto"
                          onClick={() => navigate('/customers/create')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Customer</span>
            <span className="sm:hidden">Create</span>
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
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 font-medium">Company</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{customer.name}</td>
                        <td className="py-3 px-4">{customer.email}</td>
                        <td className="py-3 px-4">{customer.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {customer.company}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(customer.status)}`}>
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(customer.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(customer)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(customer)}
                              className={customer.status === 'active' ? 'text-red-600' : 'text-green-600'}
                            >
                              {customer.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                              className="text-red-600"
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

        {/* Модальное окно редактирования */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                                      placeholder="+994 (50) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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