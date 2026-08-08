import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { useToastContext } from '../../components/ui/Toast'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
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
    if (!validate()) return

    setLoading(true)
    setGeneralError('')

    try {
      const data = await signup({ name: formData.name, email: formData.email, password: formData.password })
      if (data?.success) {
        success('Account created! Please verify your email.')
        navigate('/verify-email')
      } else {
        setGeneralError(data?.message || 'Signup failed')
      }
    } catch (err) {
      setGeneralError(err.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
            <p className="text-text-secondary mt-2">Start protecting your APIs today</p>
          </div>

          {generalError && (
            <div className="mb-6 p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              name="name"
              type="text"
              placeholder="Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
              required
              disabled={loading}
              leftIcon={<User className="w-5 h-5 text-text-secondary" />}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              required
              disabled={loading}
              leftIcon={<Mail className="w-5 h-5 text-text-secondary" />}
            />

            <Input
              label="Password"
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
              label="Confirm password"
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
              {loading ? <Loader2 className="w-5 h-5" /> : 'Create account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-text-secondary">Or continue with</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full" size="lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>

          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}