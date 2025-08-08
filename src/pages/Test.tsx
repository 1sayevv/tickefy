import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Test() {
  const { signIn, user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleQuickLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await signIn(email, password)
      if (result.error) {
        alert(`Ошибка входа: ${result.error}`)
      } else {
        alert('Успешный вход!')
      }
    } catch (error) {
      alert('Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={() => handleQuickLogin('admin', '1234')}
                  disabled={loading}
                  className="w-full"
                >
                  Login as Root Admin
                </Button>
                <Button 
                  onClick={() => handleQuickLogin('customer', '1234')}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Login as Customer (Nike)
                </Button>
                <Button 
                  onClick={() => handleQuickLogin('user1', '1234')}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Login as Regular User (Nike)
                </Button>
                <Button 
                  onClick={() => handleQuickLogin('user2', '1234')}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Login as Regular User (Adidas)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current User</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.user_metadata?.role}</p>
                  <p><strong>Company:</strong> {user.user_metadata?.company}</p>
                  <p><strong>Name:</strong> {user.user_metadata?.full_name}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not logged in</p>
              )}
            </CardContent>
          </Card>
        </div>

                     <Card className="mt-6">
               <CardHeader>
                 <CardTitle>Test Accounts</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2 text-sm">
                   <p><strong>Root Admin:</strong> admin / 1234 (sees all data)</p>
                   <p><strong>Customer (Nike):</strong> customer / 1234 (sees only Nike data)</p>
                   <p><strong>Regular User (Nike):</strong> user1 / 1234 (sees only Nike data)</p>
                   <p><strong>Regular User (Adidas):</strong> user2 / 1234 (sees only Adidas data)</p>
                 </div>
               </CardContent>
             </Card>
      </div>
    </div>
  )
} 