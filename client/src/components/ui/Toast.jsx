import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastClasses = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info',
}

let toastId = 0
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    listeners.add(notify)
    return () => listeners.delete(notify)
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++toastId
    const toast = { id, message, type, duration }
    setToasts((prev) => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])

  return { toasts, addToast, removeToast, success, error, warning, info }
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={`toast ${toastClasses[toast.type]} pointer-events-auto animate-slide-in`}
            role="alert"
            aria-live="assertive"
          >
            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-black/10 text-current opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToastContext() {
  return useToast()
}