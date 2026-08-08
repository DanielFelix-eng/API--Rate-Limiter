import { forwardRef } from 'react'

export const Card = forwardRef(function Card({ children, className = '', ...props }, ref) {
  return (
    <div ref={ref} className={`card ${className}`} {...props}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export const CardHeader = forwardRef(function CardHeader({ children, className = '', ...props }, ref) {
  return (
    <div ref={ref} className={`card-header ${className}`} {...props}>
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

export const CardBody = forwardRef(function CardBody({ children, className = '', ...props }, ref) {
  return (
    <div ref={ref} className={`card-body ${className}`} {...props}>
      {children}
    </div>
  )
})

CardBody.displayName = 'CardBody'

export const CardFooter = forwardRef(function CardFooter({ children, className = '', ...props }, ref) {
  return (
    <div ref={ref} className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'