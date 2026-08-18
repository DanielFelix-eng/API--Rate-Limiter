import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { useToastContext } from '../../components/ui/Toast'
import GoogleAuth from '../../components/googleAuth'

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

          <GoogleAuth />

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