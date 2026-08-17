import { forwardRef } from 'react'

export const Input = forwardRef(function Input({ 
  label, 
  error, 
  hint, 
  className = '', 
  id, 
  leftIcon,
  rightIcon,
  ...props 
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="flex items-center">
          {leftIcon && (
            <div className="flex items-center justify-center w-10 h-full bg-slate-50 border border-r-0 border-border rounded-l-lg text-text-secondary pointer-events-none" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input ${error ? 'input-error' : ''} ${leftIcon ? 'pl-0 rounded-l-none' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'