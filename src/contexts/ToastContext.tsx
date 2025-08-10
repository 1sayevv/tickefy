import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastProps } from '@/components/ui/toast'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const showToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps & { id: string } = {
      id,
      type,
      title,
      message,
      duration: 5000,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== toastId))
      }
    }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast('success', title, message)
  }, [showToast])

  const showError = useCallback((title: string, message?: string) => {
    showToast('error', title, message)
  }, [showToast])

  const showInfo = useCallback((title: string, message?: string) => {
    showToast('info', title, message)
  }, [showToast])

  const showWarning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message)
  }, [showToast])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={hideToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Global toast function for use outside of React components
export const showGlobalToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    ;(window as any).showToast({ type, title, message })
  }
} 