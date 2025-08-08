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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('manageUsers')}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{t('usersOfCompany')}</p>
            </div>
            <Button 
              onClick={() => navigate('/users/create')}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('createUser')}
            </Button>
          </div>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">{t('users')} ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">{t('loadingUsers')}</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 11a4 4 0 10-6 0" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2 sm:mb-3">{t('noUsers')}</h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                  You don't have any users yet. Create your first user to get started.
                </p>
                <Button 
                  onClick={() => navigate('/users/create')}
                  className="mt-4 sm:mt-6 w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First User
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('firstName')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('lastName')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('email')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('position')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('username')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('phoneNumber')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('status')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('createdAt')}</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{u.firstName}</td>
                          <td className="py-3 px-4 text-sm">{u.lastName}</td>
                          <td className="py-3 px-4 text-sm">{u.email}</td>
                          <td className="py-3 px-4 text-sm">{u.position}</td>
                          <td className="py-3 px-4 text-sm">{u.username}</td>
                          <td className="py-3 px-4 text-sm">{u.phoneNumber}</td>
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

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {users.map((u) => (
                    <Card key={u.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg">{u.firstName} {u.lastName}</h3>
                              <p className="text-sm text-gray-600">{u.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded border ${u.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                              {u.status === 'active' ? t('active') : t('inactive')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">{t('position')}:</span>
                              <p className="text-gray-600">{u.position}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">{t('username')}:</span>
                              <p className="text-gray-600">{u.username}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">{t('phoneNumber')}:</span>
                              <p className="text-gray-600">{u.phoneNumber}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">{t('createdAt')}:</span>
                              <p className="text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => navigate(`/users/${u.id}/edit`)}
                              className="w-full sm:w-auto"
                            >
                              {t('editUser')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDelete(u.id)}
                              className="w-full sm:w-auto"
                            >
                              {t('deleteUser')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 