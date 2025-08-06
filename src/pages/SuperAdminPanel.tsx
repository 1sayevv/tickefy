import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getMiniAdmins, createMiniAdmin, updateMiniAdmin, deleteMiniAdmin, MiniAdmin } from '@/lib/mockAuth'
import { Edit, Trash2, Plus, UserCheck, UserX } from 'lucide-react'

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
    companies: [] as string[],
    status: 'active' as 'active' | 'inactive'
  })

  // Проверяем, является ли пользователь супер-админом
  const isSuperAdmin = user?.email === 'admin@examplemail.com' || user?.user_metadata?.role === 'super_admin'

  useEffect(() => {
    if (isSuperAdmin) {
      loadMiniAdmins()
    }
  }, [isSuperAdmin])

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
      setFormData({ name: '', email: '', companies: [], status: 'active' })
      loadMiniAdmins()
    } catch (error) {
      console.error('Error creating mini admin:', error)
    }
  }

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdmin) return
    
    try {
      await updateMiniAdmin(editingAdmin.id, formData)
      setIsEditModalOpen(false)
      setEditingAdmin(null)
      setFormData({ name: '', email: '', companies: [], status: 'active' })
      loadMiniAdmins()
    } catch (error) {
      console.error('Error updating mini admin:', error)
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого мини-админа?')) {
      try {
        await deleteMiniAdmin(id)
        loadMiniAdmins()
      } catch (error) {
        console.error('Error deleting mini admin:', error)
      }
    }
  }

  const openEditModal = (admin: MiniAdmin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      companies: admin.companies,
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

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Доступ запрещен</h2>
            <p className="text-center text-muted-foreground">
              У вас нет прав для доступа к этой странице.
            </p>
          </CardContent>
        </Card>
      </div>
    )
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
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Имя</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Компании</th>
                    <th className="text-left py-3 px-4">Статус</th>
                    <th className="text-left py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {miniAdmins.map(admin => (
                    <tr key={admin.id} className="border-b">
                      <td className="py-3 px-4">{admin.name}</td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {admin.companies.map(company => (
                            <span key={company} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {company}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {admin.status === 'active' ? (
                            <UserCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-600" />
                          )}
                          <span className={admin.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                            {admin.status === 'active' ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
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
                            onClick={() => handleDeleteAdmin(admin.id)}
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
    </div>
  )
} 