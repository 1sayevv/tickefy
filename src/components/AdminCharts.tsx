import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTickets } from '@/contexts/TicketContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface AdminChartsProps {
  selectedCompany: string
}

// Кастомный компонент для тултипа
const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation()
  
  if (active && payload && payload.length) {
    // Для Pie Chart тултипа
    if (payload[0]?.name === t('open') || payload[0]?.name === t('inProgress') || payload[0]?.name === t('done')) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {t('tickets')} ({((entry.value / payload.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(0)}%)
            </p>
          ))}
        </div>
      )
    }
    // Для Line Chart тултипа
    const data = payload[0]?.payload
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900">
          {label}
          {data?.isToday && <span className="text-blue-600 ml-2">({t('today')})</span>}
        </p>
        <p className="text-sm text-gray-600">
          {data?.fullDate}
        </p>
        <p className="text-sm" style={{ color: payload[0]?.color }}>
          {t('tickets')}: {payload[0]?.value}
        </p>
      </div>
    )
  }
  return null
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
    console.log('📊 Filtered tickets for charts:', filteredTickets.length, filteredTickets.map(t => ({ id: t.id, company: t.company, status: t.status })))
    
    const statusCount = filteredTickets.reduce((acc, ticket) => {
      const status = ticket.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('📊 Status count:', statusCount)

    const data = [
      { name: t('open'), value: statusCount.open || 0, color: '#0088FE' },
      { name: t('inProgress'), value: statusCount['in progress'] || 0, color: '#00C49F' },
      { name: t('done'), value: statusCount.done || 0, color: '#FFBB28' }
    ]

    console.log('📊 Final status data:', data)
    return data
  }

  // Подготовка данных для Line Chart (тикеты по датам)
  const getDateData = () => {
    // Получаем последние 14 дней, включая сегодня
    const today = new Date()
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (13 - i)) // Начинаем с 14 дней назад и идем до сегодня
      return date
    })

    console.log('📅 Generated date range:', last14Days.map(d => d.toISOString().split('T')[0]))

    // Группируем тикеты по дате создания
    const ticketsByDate = filteredTickets.reduce((acc, ticket) => {
      // Проверяем валидность даты
      const ticketDate = new Date(ticket.createdAt)
      if (isNaN(ticketDate.getTime())) {
        console.warn('❌ Invalid date for ticket:', ticket.id, ticket.createdAt)
        return acc
      }
      
      // Нормализуем дату до YYYY-MM-DD формата
      const dateKey = ticketDate.toISOString().split('T')[0]
      acc[dateKey] = (acc[dateKey] || 0) + 1
      console.log(`📊 Ticket ${ticket.id} created on ${dateKey}, count: ${acc[dateKey]}`)
      return acc
    }, {} as Record<string, number>)

    console.log('📊 Tickets by date:', ticketsByDate)

    // Создаем данные для графика
    const chartData = last14Days.map(date => {
      const dateKey = date.toISOString().split('T')[0]
      const ticketCount = ticketsByDate[dateKey] || 0
      
      console.log(`📈 Chart data for ${dateKey}: ${ticketCount} tickets`)
      
      return {
        date: date.toLocaleDateString('ru-RU', { 
          month: 'short', 
          day: 'numeric' 
        }),
        tickets: ticketCount,
        fullDate: dateKey,
        isToday: dateKey === today.toISOString().split('T')[0]
      }
    })

    console.log('📈 Final chart data:', chartData)
    return chartData
  }

  const statusData = getStatusData()
  const dateData = getDateData()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pie Chart - Статусы тикетов */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          {t('ticketsByStatus')}
          {selectedCompany !== 'all' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({t(selectedCompany.toLowerCase())})
            </span>
          )}
        </h3>
        <div className="h-60 sm:h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={false} // Убираем лейблы с круга
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

      {/* Line Chart - Тикеты по датам */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          {t('ticketsByDate')}
          {selectedCompany !== 'all' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({t(selectedCompany.toLowerCase())})
            </span>
          )}
        </h3>
        <div className="h-60 sm:h-80 relative">
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
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-gray-900">
                          {label}
                          {data?.isToday && <span className="text-blue-600 ml-2">(Сегодня)</span>}
                        </p>
                        <p className="text-sm text-gray-600">
                          {data?.fullDate}
                        </p>
                        <p className="text-sm" style={{ color: payload[0]?.color }}>
                          {t('tickets')}: {payload[0]?.value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
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
  )
}