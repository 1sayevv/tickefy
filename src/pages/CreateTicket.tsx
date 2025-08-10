import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreateTicketForm from '@/components/CreateTicketForm'
import MainLayout from '@/layouts/MainLayout'

export default function CreateTicket() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleTicketCreated = () => {
    console.log('Ticket created, navigating to dashboard...')
    navigate('/dashboard')
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <MainLayout>
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('createTicket')}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">{t('createTicketDescription')}</p>
        </div>
        <CreateTicketForm onTicketCreated={handleTicketCreated} onCancel={handleCancel} />
      </div>
    </MainLayout>
  )
} 