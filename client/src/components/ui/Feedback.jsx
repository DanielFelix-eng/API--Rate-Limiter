import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export const Badge = forwardRef(function Badge({ 
  children, 
  variant = 'neutral', 
  className = '', 
  ...props 
}, ref) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
    primary: 'bg-primary-light text-primary border border-primary-light',
  }

  return (
    <span ref={ref} className={`badge ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export const Spinner = forwardRef(function Spinner({ size = 'md', className = '', ...props }, ref) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 
      ref={ref} 
      className={`${sizes[size]} text-primary animate-spin ${className}`} 
      aria-hidden="true"
      {...props}
    />
  )
})

Spinner.displayName = 'Spinner'

export const EmptyState = ({ icon, title, description, children, className = '' }) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon" aria-hidden="true">{icon}</div>}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
      {children}
    </div>
  )
}

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 rounded ${className}`} 
      {...props}
      aria-hidden="true"
    />
  )
}