import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { getRegularUsersFromStorage } from '@/lib/localStorage'
import CustomerManagerLayout from '@/layouts/CustomerManagerLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Edit, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function CustomerManagerTickets() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, getUserDisplayName } = useAuth()
  const { tickets, loading, updateTicketStatus } = useTickets()
  const [assignedCompany, setAssignedCompany] = useState<string>('')
  const [companyTickets, setCompanyTickets] = useState<any[]>([])
  const [filteredTickets, setFilteredTickets] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    // Find the customer manager and their assigned company
    const allUsers = getRegularUsersFromStorage()
    const customerManager = allUsers.find(manager => 
      manager.username === user?.email || manager.email === user?.email
    )
    
    if (customerManager) {
      setAssignedCompany(customerManager.companyName)
      // Filter tickets for the assigned company
      const filteredTickets = tickets.filter(ticket => ticket.company === customerManager.companyName)
      setCompanyTickets(filteredTickets)
      setFilteredTickets(filteredTickets)
    }
  }, [user, tickets])

  useEffect(() => {
    // Apply status filter
    if (statusFilter === 'all') {
      setFilteredTickets(companyTickets)
    } else {
      setFilteredTickets(companyTickets.filter(ticket => ticket.status === statusFilter))
    }
  }, [statusFilter, companyTickets])

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsViewModalOpen(true)
  }

  const handleUpdateStatus = (ticket: any) => {
    navigate(`/ticket/${ticket.id}/edit`)
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />
      case 'in progress':
        return <Clock className="w-4 h-4" />
      case 'done':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
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

  const getStatusCount = (status: string) => {
    return companyTickets.filter(ticket => ticket.status === status).length
  }

  return (
    <CustomerManagerLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Manage Tickets
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage tickets for {assignedCompany}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="all">All Tickets ({companyTickets.length})</option>
                <option value="open">Open ({getStatusCount('open')})</option>
                <option value="in progress">In Progress ({getStatusCount('in progress')})</option>
                <option value="done">Done ({getStatusCount('done')})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Tickets</CardTitle>
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{companyTickets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Open</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {getStatusCount('open')}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getStatusCount('open')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">In Progress</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                {getStatusCount('in progress')}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getStatusCount('in progress')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Done</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {getStatusCount('done')}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getStatusCount('done')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tickets ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-muted-foreground">Loading tickets...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Tickets Found</h3>
                <p className="text-gray-600">
                  {statusFilter === 'all' 
                    ? `No tickets have been created for ${assignedCompany} yet.`
                    : `No ${statusFilter} tickets found.`
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{ticket.title}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={ticket.description}>
                            {ticket.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {ticket.status === 'done' && ticket.updatedAt 
                            ? formatDate(ticket.updatedAt)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(ticket)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Ticket Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTicket.title}</h3>
                  <Badge variant="secondary" className={`mt-2 ${getStatusColor(selectedTicket.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status}
                    </div>
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Created</h4>
                    <p className="text-sm text-gray-600">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  {selectedTicket.status === 'done' && selectedTicket.updatedAt && (
                    <div>
                      <h4 className="font-medium mb-1">Completed</h4>
                      <p className="text-sm text-gray-600">{formatDate(selectedTicket.updatedAt)}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Company</h4>
                  <p className="text-sm text-gray-600">{selectedTicket.company}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>


      </div>
    </CustomerManagerLayout>
  )
} 