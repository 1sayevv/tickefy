import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTickets } from '@/contexts/TicketContext'
import { Ticket, TicketMessage } from '@/lib/mockTickets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

import { ArrowLeft, Send, Paperclip, User, MessageSquare, Clock, Building, X, Upload, FileText, Image } from 'lucide-react'

export default function TicketDetails() {
  const { t } = useTranslation()
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { updateTicketStatus, addMessage, tickets, deactivateTicket } = useTickets()
  
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      setLoading(false)
    }
  }, [ticketId, tickets])

  const ticket = tickets.find(t => t.id === ticketId) || null

  const handleSendMessage = () => {
    if (!newMessage.trim() || !ticket) return

    const attachmentNames = attachments.map(file => file.name)

    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.email || 'Unknown',
      senderType: user?.user_metadata?.role === 'customer_manager' ? 'customer_manager' : 'customer',
      content: newMessage,
      timestamp: new Date().toISOString(),
      attachments: attachmentNames
    }

    addMessage(ticket.id, message)
    setNewMessage('')
    setAttachments([])
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    setAttachments(prev => [...prev, ...files])
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />
    }
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSenderDisplayName = (message: TicketMessage) => {
    if (message.senderType === 'customer') {
      return `Müşteri: ${message.sender}`
    } else if (message.senderType === 'customer_manager') {
      return `Yetkili: ${message.sender}`
    }
    return message.sender
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t('ticketNotFound')}</p>
          <Button onClick={() => navigate('/tickets')}>
            {t('backToTickets')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tickets')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{ticket.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <span className="text-sm text-gray-500">#{ticket.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">#{ticket.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status - Fixed at top */}
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{t('currentStatus')}:</span>
                  <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  #{ticket.id}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Info - Fixed at top */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {t('ticketInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('company')}</p>
                    <p className="text-lg font-semibold text-gray-900">{ticket.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('customer')}</p>
                    <p className="text-lg font-semibold text-gray-900">{ticket.user_email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('created')}</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(ticket.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation - Full width below */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('conversation')}
              </CardTitle>
              <Button 
                onClick={() => {
                  if (ticket && ticket.status === 'open') {
                    deactivateTicket(ticket.id)
                  }
                }}
                disabled={ticket?.status !== 'open'}
                className={`${
                  ticket?.status === 'open' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                {t('deactivate')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reply Form - Integrated at top */}
            <div className="border-b border-gray-200 pb-6">
              <div className="space-y-4">
                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('typeYourMessage')}
                  </label>
                  <Textarea
                    placeholder={t('typeYourMessage')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* File Attachments */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('attachFiles')}
                  </label>
                  
                  {/* Drag & Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {t('dragDropFiles')} {t('or')} 
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                      >
                        {t('browseFiles')}
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('supportedFormats')}: JPG, PNG, PDF, DOC, TXT
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </div>
                  
                  {/* Selected Files */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                          {t('selectedFiles')} ({attachments.length})
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachments([])}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          {t('clearAll')}
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('send')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {ticket.messages && ticket.messages.length > 0 ? (
              <div className="space-y-6">
                {ticket.messages.map((message, index) => (
                  <div key={message.id} className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.senderType === 'customer' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {getSenderDisplayName(message)}
                            </span>
                            {message.senderType === 'customer_manager' && (
                              <Badge variant="secondary" className="text-xs">
                                {t('support')}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>

                        {/* Message Text */}
                        <div className="text-gray-700 whitespace-pre-wrap mb-3">
                          {message.content}
                        </div>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="border-t border-gray-100 pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t('attachments')} ({message.attachments.length})
                            </p>
                            <div className="space-y-1">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-blue-600">
                                  <Paperclip className="w-3 h-3" />
                                  {attachment}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rating (for support messages) */}
                        {message.senderType === 'customer_manager' && (
                          <div className="border-t border-gray-100 pt-3 mt-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('noMessagesYet')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 