import { useState } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { createRegularUser } from '@/lib/mockAuth'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CreateUser() {
  const { t } = useTranslation()
  const { getUserCompany } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const company = getUserCompany()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    username: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
  })

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await createRegularUser({ ...form, company })
    navigate('/users')
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('createUser')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('userInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('firstName')}</label>
                    <input className="w-full px-3 py-2 border rounded-md" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('lastName')}</label>
                    <input className="w-full px-3 py-2 border rounded-md" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('email')}</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-md" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('mobileNumber')}</label>
                  <input type="tel" className="w-full px-3 py-2 border rounded-md" placeholder="+994 (50) 123-45-67" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('position')}</label>
                  <input className="w-full px-3 py-2 border rounded-md" value={form.position} onChange={e => set('position', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('username')}</label>
                  <input className="w-full px-3 py-2 border rounded-md" value={form.username} onChange={e => set('username', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('password')}</label>
                  <input type="password" className="w-full px-3 py-2 border rounded-md" value={form.password} onChange={e => set('password', e.target.value)} required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('companyData')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('companyName')}</label>
                  <input className="w-full px-3 py-2 border rounded-md bg-gray-50" value={company} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('status')}</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/users')}>{t('cancel')}</Button>
            <Button type="submit" disabled={loading}>{loading ? t('creating') : t('create')}</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 