import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export function Modal({ isOpen, onClose, title, children, footer, size = 'md', showCloseButton = true }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  const content = (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div 
        className={`modal-content ${sizes[size]} mx-auto my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="text-lg font-semibold text-text-primary">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 text-text-secondary"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}