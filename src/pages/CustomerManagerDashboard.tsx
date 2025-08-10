import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { getRegularUsersFromStorage } from '@/lib/localStorage'
import CustomerManagerLayout from '@/layouts/CustomerManagerLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CustomerManagerDashboard() {
  const { t } = useTranslation()
  const { user, getUserDisplayName } = useAuth()
  const { tickets, loading } = useTickets()
  const [assignedCompany, setAssignedCompany] = useState<string>('')
  const [companyTickets, setCompanyTickets] = useState<any[]>([])

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
    }
  }, [user, tickets])

  // Functions for counting tickets by status
  const getStatusCount = (status: string) => {
    return companyTickets.filter(ticket => ticket.status === status).length
  }

  const getTotalCount = () => companyTickets.length
  const getOpenCount = () => getStatusCount('open')
  const getInProgressCount = () => getStatusCount('in progress')
  const getDoneCount = () => getStatusCount('done')

  // Prepare data for Pie Chart (ticket statuses)
  const getStatusData = () => {
    const statusCount = companyTickets.reduce((acc, ticket) => {
      const status = ticket.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { name: 'Open', value: statusCount.open || 0, color: '#0088FE' },
      { name: 'In Progress', value: statusCount['in progress'] || 0, color: '#00C49F' },
      { name: 'Done', value: statusCount.done || 0, color: '#FFBB28' }
    ]
  }

  // Prepare data for Line Chart (tickets by date)
  const getDateData = () => {
    const today = new Date()
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (13 - i))
      return date
    })

    const ticketsByDate = companyTickets.reduce((acc, ticket) => {
      const ticketDate = new Date(ticket.createdAt)
      if (isNaN(ticketDate.getTime())) {
        return acc
      }

      const dateKey = ticketDate.toISOString().split('T')[0]
      acc[dateKey] = (acc[dateKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return last14Days.map(date => {
      const dateKey = date.toISOString().split('T')[0]
      const isToday = date.toDateString() === today.toDateString()
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        tickets: ticketsByDate[dateKey] || 0,
        isToday
      }
    })
  }

  const statusData = getStatusData()
  const dateData = getDateData()

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // For Pie Chart tooltip
      if (payload[0]?.name === 'Open' || payload[0]?.name === 'In Progress' || payload[0]?.name === 'Done') {
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="font-semibold text-gray-900">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value} tickets ({((entry.value / payload.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(0)}%)
              </p>
            ))}
          </div>
        )
      }
      // For Line Chart tooltip
      const data = payload[0]?.payload
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">
            {label}
            {data?.isToday && <span className="text-blue-600 ml-2">(Today)</span>}
          </p>
          <p className="text-sm text-gray-600">
            {data?.fullDate}
          </p>
          <p className="text-sm" style={{ color: payload[0]?.color }}>
            Tickets: {payload[0]?.value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <CustomerManagerLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome, {getUserDisplayName()}!
              </p>
              {assignedCompany && (
                <Badge variant="secondary" className="mt-2">
                  Managing: {assignedCompany}
                </Badge>
              )}
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
              <div className="text-lg sm:text-2xl font-bold">{getTotalCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Open</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {getOpenCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getOpenCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">In Progress</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                {getInProgressCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getInProgressCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Done</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {getDoneCount()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{getDoneCount()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {companyTickets.length > 0 && (
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Pie Chart - Ticket Statuses */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                Tickets by Status
              </h3>
              <div className="h-48 sm:h-60 lg:h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: '30px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                      formatter={(value, entry) => [
                        `${value} (${((entry.payload?.value || 0) / statusData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(0)}%)`,
                        value
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart - Tickets by Date */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                Tickets by Date
              </h3>
              <div className="h-48 sm:h-60 lg:h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tickets" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Tickets */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold">Recent Tickets</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-muted-foreground">Loading tickets...</span>
            </div>
          ) : companyTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">No Tickets</h3>
                <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                  No tickets have been created for {assignedCompany} yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {companyTickets.slice(0, 6).map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm sm:text-base">{ticket.title}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      {ticket.status === 'done' && ticket.updatedAt && (
                        <div>Completed: {new Date(ticket.updatedAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerManagerLayout>
  )
} 