import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getMiniAdmins, createMiniAdmin, updateMiniAdmin, deleteMiniAdmin, MiniAdmin } from '@/lib/mockAuth'
import { decryptPassword } from '@/lib/encryption'
import { Edit, Trash2, Plus, UserCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

export default function SuperAdminPanel() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [miniAdmins, setMiniAdmins] = useState<MiniAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<MiniAdmin | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companies: [] as string[],
    accessLevel: 'manager' as 'manager' | 'senior_admin',
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
    adminId: string | null
    adminName: string
  }>({
    show: false,
    adminId: null,
    adminName: ''
  })

  useEffect(() => {
    loadMiniAdmins()
  }, [])

  const loadMiniAdmins = async () => {
    try {
      setLoading(true)
      const admins = await getMiniAdmins()
      setMiniAdmins(admins)
    } catch (error) {
      console.error('Error loading mini admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMiniAdmin(formData)
      setIsCreateModalOpen(false)
      setFormData({ name: '', email: '', password: '', phone: '', companies: [], accessLevel: 'manager', status: 'active' })
      loadMiniAdmins()
      showNotification('success', '✅ Мини-админ успешно создан')
    } catch (error) {
      console.error('Error creating mini admin:', error)
      showNotification('error', '❌ Ошибка при создании мини-админа')
    }
  }

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdmin) return
    
    try {
      await updateMiniAdmin(editingAdmin.id, formData)
      setIsEditModalOpen(false)
      setEditingAdmin(null)
      setFormData({ name: '', email: '', password: '', phone: '', companies: [], accessLevel: 'manager', status: 'active' })
      loadMiniAdmins()
      showNotification('success', '✅ Изменения сохранены')
    } catch (error) {
      console.error('Error updating mini admin:', error)
      showNotification('error', '❌ Ошибка при сохранении изменений')
    }
  }

  const handleDeleteAdmin = async (id: string, name: string) => {
    setDeleteConfirmModal({
      show: true,
      adminId: id,
      adminName: name
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmModal.adminId) return
    
    try {
      await deleteMiniAdmin(deleteConfirmModal.adminId)
      setDeleteConfirmModal({ show: false, adminId: null, adminName: '' })
      loadMiniAdmins()
      showNotification('success', '✅ Мини-админ удален')
    } catch (error) {
      console.error('Error deleting mini admin:', error)
      showNotification('error', '❌ Ошибка при удалении мини-админа')
    }
  }

  const handleToggleStatus = async (admin: MiniAdmin) => {
    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active'
      await updateMiniAdmin(admin.id, { status: newStatus })
      loadMiniAdmins()
      showNotification('success', `✅ Статус изменен на ${newStatus === 'active' ? 'активный' : 'неактивный'}`)
    } catch (error) {
      console.error('Error toggling status:', error)
      showNotification('error', '❌ Ошибка при изменении статуса')
    }
  }

  const openEditModal = (admin: MiniAdmin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      password: decryptPassword(admin.password),
      phone: admin.phone,
      companies: admin.companies,
      accessLevel: admin.accessLevel,
      status: admin.status
    })
    setIsEditModalOpen(true)
  }

  const handleCompanyChange = (company: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      companies: checked 
        ? [...prev.companies, company]
        : prev.companies.filter(c => c !== company)
    }))
  }

  const formatAccessLevel = (level: string) => {
    return level === 'manager' ? 'Менеджер' : 'Старший админ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Управление мини-админами</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Создавайте и управляйте мини-админами для различных компаний
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Создать мини-админа</span>
                <span className="sm:hidden">Создать</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle>Создать мини-админа</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Имя</label>
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
                  <label className="block text-sm font-medium mb-1">Пароль</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Компании</label>
                  <div className="space-y-2">
                    {['Nike', 'Adidas'].map(company => (
                      <label key={company} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.companies.includes(company)}
                          onChange={(e) => handleCompanyChange(company, e.target.checked)}
                          className="mr-2"
                        />
                        {company}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Уровень доступа</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as 'manager' | 'senior_admin' }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="manager">Менеджер</option>
                    <option value="senior_admin">Старший админ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    Создать
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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

        {/* Таблица мини-админов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Мини-админы ({miniAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Загрузка...</p>
              </div>
            ) : miniAdmins.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Нет мини-админов</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Имя</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Телефон</th>
                      <th className="text-left py-3 px-4 font-medium">Компании</th>
                      <th className="text-left py-3 px-4 font-medium">Уровень</th>
                      <th className="text-left py-3 px-4 font-medium">Статус</th>
                      <th className="text-left py-3 px-4 font-medium">Дата создания</th>
                      <th className="text-left py-3 px-4 font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miniAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{admin.name}</td>
                        <td className="py-3 px-4">{admin.email}</td>
                        <td className="py-3 px-4">{admin.phone}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {admin.companies.map(company => (
                              <span key={company} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {company}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {formatAccessLevel(admin.accessLevel)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(admin.status)}`}>
                            {admin.status === 'active' ? 'Активный' : 'Неактивный'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(admin.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(admin)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(admin)}
                              className={admin.status === 'active' ? 'text-red-600' : 'text-green-600'}
                            >
                              {admin.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAdmin(admin.id, admin.name)}
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
              <DialogTitle>Редактировать мини-админа</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Имя</label>
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
                <label className="block text-sm font-medium mb-1">Пароль</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Компании</label>
                <div className="space-y-2">
                  {['Nike', 'Adidas'].map(company => (
                    <label key={company} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.companies.includes(company)}
                        onChange={(e) => handleCompanyChange(company, e.target.checked)}
                        className="mr-2"
                      />
                      {company}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Уровень доступа</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as 'manager' | 'senior_admin' }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="manager">Менеджер</option>
                  <option value="senior_admin">Старший админ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="active">Активный</option>
                  <option value="inactive">Неактивный</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  Сохранить
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Модальное окно подтверждения удаления */}
        <Dialog open={deleteConfirmModal.show} onOpenChange={(open) => !open && setDeleteConfirmModal(prev => ({ ...prev, show: false }))}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Вы уверены, что хотите удалить мини-админа <strong>{deleteConfirmModal.adminName}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Это действие нельзя отменить.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteConfirmModal(prev => ({ ...prev, show: false }))}>
                  Отмена
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Удалить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
} 