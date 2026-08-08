import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { Loader2, Mail } from 'lucide-react'
import { useToastContext } from '../../components/ui/Toast'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { forgotPassword } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    if (!email) { setError('Email is required'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email format'); return false }
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')

    try {
      const data = await forgotPassword({ email })
      if (data?.success) {
        setSubmitted(true)
        success('Password reset link sent!')
      } else {
        setError(data?.message || 'Failed to send reset link')
      }
    } catch (err) {
      setError(err.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Check your email</h1>
            <p className="text-text-secondary mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>.
              The link will expire in 1 hour.
            </p>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Back to login
            </Link>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Forgot password?</h1>
            <p className="text-text-secondary mt-2">Enter your email and we'll send you a reset link</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              error={error}
              autoComplete="email"
              required
              disabled={loading}
              leftIcon={<Mail className="w-5 h-5 text-text-secondary" />}
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? <Loader2 className="w-5 h-5" /> : 'Send reset link'}
            </Button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            <Link to="/login" className="text-primary hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}