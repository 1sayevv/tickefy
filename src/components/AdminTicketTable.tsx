import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTickets } from '@/contexts/TicketContext'
import { useAuth } from '@/contexts/AuthContext'
import TestImage from './TestImage'

export default function AdminTicketTable() {
  const { t } = useTranslation()
  const { tickets, loading, updateTicketStatus } = useTickets()
  const { user } = useAuth()
  const [filteredTickets, setFilteredTickets] = useState(tickets)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  
  const isCustomer = user?.user_metadata?.role === 'customer'

  useEffect(() => {
    let filtered = tickets

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Для Customer автоматически фильтруем по его компании
    if (isCustomer) {
      const customerCompany = user?.user_metadata?.company
      if (customerCompany) {
        filtered = filtered.filter(ticket => ticket.company === customerCompany)
      }
    } else if (companyFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.company === companyFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, statusFilter, companyFilter, isCustomer, user?.user_metadata?.company])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return t('open')
      case 'in progress':
        return t('inProgress')
      case 'done':
        return t('done')
      default:
        return status
    }
  }

  const clearFilters = () => {
    setStatusFilter('all')
    // Для Customer не сбрасываем фильтр компании, так как он должен видеть только свою компанию
    if (!isCustomer) {
      setCompanyFilter('all')
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsImageModalOpen(true)
  }

  const hasValidImage = (imageUrl: string) => {
    if (!imageUrl || imageUrl.trim() === '') {
      console.log('Admin table - Empty image URL')
      return false
    }
    
    // Проверяем, что это не placeholder и не пустая строка
    const invalidUrls = [
      'https://via.placeholder.com',
      'placeholder.com',
      'data:image/svg+xml',
      ''
    ]
    
    // Проверяем, что это не object URL (blob:)
    if (imageUrl.startsWith('blob:')) {
      console.log('Admin table - Valid object URL:', imageUrl)
      return true
    }
    
    const isValid = !invalidUrls.some(invalid => imageUrl.includes(invalid))
    console.log('Admin table - Checking image URL:', imageUrl, 'isValid:', isValid)
    return isValid
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketStatus(ticketId, newStatus as any)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">{t('loadingTickets')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">{t('status')}:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="open">{t('open')}</option>
            <option value="in progress">{t('inProgress')}</option>
            <option value="done">{t('done')}</option>
          </select>
        </div>

        {/* Показываем фильтр компаний только для Root Admin */}
        {!isCustomer && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">{t('company')}:</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allCompanies')}</option>
              <option value="Nike">{t('nike')}</option>
              <option value="Adidas">{t('adidas')}</option>
            </select>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={clearFilters}>
          {t('resetFilters')}
        </Button>

        <span className="text-sm text-gray-600">
          {t('showing')}: {filteredTickets.length} {t('of')} {isCustomer ? filteredTickets.length : tickets.length}
        </span>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-24">{t('photo')}</TableHead>
              <TableHead>{t('title')}</TableHead>
              <TableHead className="w-32">{t('company')}</TableHead>
              <TableHead className="w-32">{t('status')}</TableHead>
              <TableHead className="w-40">{t('date')}</TableHead>
              <TableHead className="w-40">{t('changeStatus')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {t('noTicketsMatchingFilters')}
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>
                    {hasValidImage(ticket.image) ? (
                      <button onClick={() => handleImageClick(ticket.image)} className="block w-full">
                        <TestImage 
                          src={ticket.image} 
                          alt="Ticket preview" 
                          className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">{t('noAttachment')}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-2">{ticket.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">{ticket.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {ticket.company}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell>
                    <select 
                      value={ticket.status} 
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="open">{t('open')}</option>
                      <option value="in progress">{t('inProgress')}</option>
                      <option value="done">{t('done')}</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Модальное окно для изображения */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t('viewImage')}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage && (
              <TestImage 
                src={selectedImage} 
                alt={t('fullSizeImage')} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 