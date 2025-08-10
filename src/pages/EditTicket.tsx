import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { getRegularUsersFromStorage } from '@/lib/localStorage'
import CustomerManagerLayout from '@/layouts/CustomerManagerLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

export default function EditTicket() {
  const { t } = useTranslation()
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tickets, updateTicketStatus } = useTickets()
  const [ticket, setTicket] = useState<any>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Check if user is a customer manager
  const allUsers = getRegularUsersFromStorage()
  const isCustomerManager = allUsers.some(manager => 
    (manager.username === user?.email || manager.email === user?.email) && 
    manager.isCustomerManager === true
  )

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      const foundTicket = tickets.find(t => t.id === ticketId)
      if (foundTicket) {
        setTicket(foundTicket)
        setNewStatus(foundTicket.status)
      }
    }
  }, [ticketId, tickets])

  useEffect(() => {
    // Redirect if not a customer manager
    if (user && !isCustomerManager) {
      navigate('/dashboard')
    }
  }, [user, isCustomerManager, navigate])

  const handleStatusChange = async () => {
    if (!ticket || !newStatus || newStatus === ticket.status) return

    setLoading(true)
    try {
      await updateTicketStatus(ticket.id, newStatus as "open" | "in progress" | "done")
      alert('Ticket status updated successfully!')
      navigate('/tickets')
    } catch (error) {
      console.error('Error updating ticket status:', error)
      alert('Error updating ticket status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  if (!isCustomerManager) {
    return (
      <CustomerManagerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to edit tickets.</p>
          </div>
        </div>
      </CustomerManagerLayout>
    )
  }

  if (!ticket) {
    return (
      <CustomerManagerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading ticket...</p>
          </div>
        </div>
      </CustomerManagerLayout>
    )
  }

  return (
    <CustomerManagerLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/tickets')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tickets</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Edit Ticket
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Update ticket status and details
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Ticket Information */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Company</label>
                <p className="text-sm text-gray-900 mt-1">{ticket.company}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="text-sm text-gray-900 mt-1">{formatDate(ticket.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Current Status</label>
                <div className="mt-1">
                  <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleStatusChange}
                  disabled={loading || !newStatus || newStatus === ticket.status}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
              
              {newStatus && newStatus !== ticket.status && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    Status will be changed from <strong>{ticket.status}</strong> to <strong>{newStatus}</strong>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerManagerLayout>
  )
} 