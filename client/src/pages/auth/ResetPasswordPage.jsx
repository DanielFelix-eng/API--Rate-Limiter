import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { Loader2, Lock } from 'lucide-react'
import { useToastContext } from '../../components/ui/Toast'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPassword } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [tokenValid, setTokenValid] = useState(true)

  const token = searchParams.get('token')

  if (!token) {
    setTokenValid(false)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (generalError) setGeneralError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || !token) return

    setLoading(true)
    setGeneralError('')

    try {
      const data = await resetPassword(token, { password: formData.password, confirmPassword: formData.confirmPassword })
      if (data?.success) {
        success('Password reset successfully!')
        navigate('/login')
      } else {
        setGeneralError(data?.message || 'Failed to reset password')
      }
    } catch (err) {
      setGeneralError(err.message || 'Unable to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid reset link</h1>
            <p className="text-text-secondary mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
              Request a new link
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
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Reset your password</h1>
            <p className="text-text-secondary mt-2">Enter your new password below</p>
          </div>

          {generalError && (
            <div className="mb-6 p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="New password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              required
              disabled={loading}
              leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
              hint="At least 8 characters"
            />

            <Input
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
              disabled={loading}
              leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
            />

            {generalError && (
              <div className="p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
                {generalError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? <Loader2 className="w-5 h-5" /> : 'Reset password'}
            </Button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            <a href="/login" className="text-primary hover:underline font-medium">Back to login</a>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}