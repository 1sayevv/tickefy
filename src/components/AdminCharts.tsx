import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTickets } from '@/contexts/TicketContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface AdminChartsProps {
  selectedCompany: string
}

export default function AdminCharts({ selectedCompany }: AdminChartsProps) {
  const { t } = useTranslation()
  const { tickets } = useTickets()

  // Фильтруем тикеты по выбранной компании
  const filteredTickets = selectedCompany === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.company === selectedCompany)

  // Подготовка данных для Pie Chart (статусы тикетов)
  const getStatusData = () => {
    const statusCount = filteredTickets.reduce((acc, ticket) => {
      const status = ticket.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { name: t('open'), value: statusCount.open || 0, color: '#0088FE' },
      { name: t('inProgress'), value: statusCount['in progress'] || 0, color: '#00C49F' },
      { name: t('done'), value: statusCount.done || 0, color: '#FFBB28' }
    ]
  }

  // Подготовка данных для Line Chart (тикеты по датам)
  const getDateData = () => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const ticketsByDate = filteredTickets.reduce((acc, ticket) => {
      const date = new Date(ticket.createdAt).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return last14Days.map(date => ({
      date: new Date(date).toLocaleDateString('ru-RU', { 
        month: 'short', 
        day: 'numeric' 
      }),
      tickets: ticketsByDate[date] || 0
    }))
  }

  const statusData = getStatusData()
  const dateData = getDateData()

  return (
    <div className="space-y-6">
      {/* Pie Chart - Статусы тикетов */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('ticketsByStatus')}
          {selectedCompany !== 'all' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({t(selectedCompany.toLowerCase())})
            </span>
          )}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - Тикеты по датам */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('ticketsByDate')}
          {selectedCompany !== 'all' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({t(selectedCompany.toLowerCase())})
            </span>
          )}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Legend />
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
  )
} 