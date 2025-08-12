import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function TicketHistoryRedirect() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (ticketId) {
      navigate(`/ticket/${ticketId}`, { replace: true })
    }
  }, [ticketId, navigate])

  return null
} 