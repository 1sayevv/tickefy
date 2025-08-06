import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getMiniAdmins, createMiniAdmin, updateMiniAdmin, deleteMiniAdmin, MiniAdmin } from '@/lib/mockAuth'
import { decryptPassword } from '@/lib/encryption'
import { Edit, Trash2, Plus, UserCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react'

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
      loadMiniAdmins()
      setDeleteConfirmModal({ show: false, adminId: null, adminName: '' })
      showNotification('success', '🗑️ Мини-админ удалён')
    } catch (error) {
      console.error('Error deleting mini admin:', error)
      showNotification('error', '❌ Ошибка при удалении мини-админа')
    }
  }

  const handleToggleStatus = async (admin: MiniAdmin) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active'
    const action = newStatus === 'active' ? 'активировать' : 'деактивировать'
    
    try {
      await updateMiniAdmin(admin.id, { status: newStatus })
      loadMiniAdmins()
      showNotification('success', `✅ Мини-админ ${action === 'активировать' ? 'активирован' : 'деактивирован'}`)
    } catch (error) {
      console.error('Error updating mini admin status:', error)
      showNotification('error', '❌ Ошибка при изменении статуса')
    }
  }

  const openEditModal = (admin: MiniAdmin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      password: decryptPassword(admin.password), // Расшифровываем пароль для отображения
      phone: admin.phone,
      companies: admin.companies,
      accessLevel: admin.accessLevel,
      status: admin.status
    })
    setIsEditModalOpen(true)
  }

  const handleCompanyChange = (company: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        companies: [...prev.companies, company]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        companies: prev.companies.filter(c => c !== company)
      }))
    }
  }

  // Вспомогательные функции для форматирования
  const formatAccessLevel = (level: string) => {
    return level === 'senior_admin' ? 'Старший админ' : 'Менеджер'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  // Функция для показа уведомлений
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 3000)
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление мини-админами</h1>
        <p className="text-muted-foreground">
          Создавайте и управляйте мини-админами для различных компаний
        </p>
      </div>

      <div className="mb-6">
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Создать мини-админа
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
                  <option value="active">Активен</option>
                  <option value="inactive">Неактивен</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Создать</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список мини-админов</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Имя</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Назначенные компании</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Уровень доступа</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Статус</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Дата создания</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {miniAdmins.map((admin, index) => (
                    <tr key={admin.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-4 px-6 font-medium text-gray-900">{admin.name}</td>
                      <td className="py-4 px-6 text-gray-700">{admin.email}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {admin.companies.map(company => (
                            <span key={company} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {company}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.accessLevel === 'senior_admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {formatAccessLevel(admin.accessLevel)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            admin.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(admin.status)}`}>
                            {admin.status === 'active' ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {formatDate(admin.created_at)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(admin)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(admin)}
                            className={admin.status === 'active' 
                              ? 'text-orange-600 hover:text-orange-700' 
                              : 'text-green-600 hover:text-green-700'
                            }
                          >
                            {admin.status === 'active' ? 'Деактивировать' : 'Активировать'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                            className="text-red-600 hover:text-red-700"
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

      {/* Модалка редактирования */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
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
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Сохранить</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Отмена
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
            <p className="text-gray-700">
              Вы уверены, что хотите удалить мини-админа <strong>{deleteConfirmModal.adminName}</strong>?
            </p>
            <p className="text-sm text-red-600">
              Это действие нельзя отменить.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Удалить
              </Button>
              <Button 
                variant="outline"
                onClick={() => setDeleteConfirmModal(prev => ({ ...prev, show: false }))}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Уведомления */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : notification.type === 'error'
            ? 'bg-red-100 border border-red-300 text-red-800'
            : 'bg-blue-100 border border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
} 