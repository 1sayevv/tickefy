import { useEffect, useState } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { getRegularUsersByCompany, deleteRegularUserFromStorage, type RegularUserData } from '@/lib/localStorage'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ManageUsers() {
  const { t } = useTranslation()
  const { getUserCompany } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<RegularUserData[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const company = getUserCompany()
    console.log('🔍 Loading users for company:', company)
    const data = getRegularUsersByCompany(company)
    console.log('🔍 Loaded users:', data)
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = (id: string) => {
    console.log('🔍 Deleting user with ID:', id)
    deleteRegularUserFromStorage(id)
    load()
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('manageUsers')}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{t('usersOfCompany')}</p>
          </div>
          <Button onClick={() => navigate('/users/create')}>{t('createUser')}</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('tickets')} ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t('loadingUsers')}</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">{t('noUsers')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">{t('firstName')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('lastName')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('email')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('position')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('username')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('phoneNumber')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('status')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('createdAt')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-3 px-4">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastName}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{u.position}</td>
                        <td className="py-3 px-4">{u.username}</td>
                        <td className="py-3 px-4">{u.phoneNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded border ${u.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                            {u.status === 'active' ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/users/${u.id}/edit`)}>{t('editUser')}</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>{t('deleteUser')}</Button>
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