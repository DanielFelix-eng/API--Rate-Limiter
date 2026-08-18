import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { useToastContext } from '../../components/ui/Toast'
import { Loader2, Mail, Lock, User, Key } from 'lucide-react'
import GoogleAuth from '../../components/googleAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const from = location.state?.from?.pathname || '/'

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
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
      const data = await login(formData)
      if (data?.success) {
        success('Welcome back!')
        navigate(from, { replace: true })
      } else {
        setGeneralError(data?.message || 'Login failed')
      }
    } catch (err) {
      setGeneralError(err.message || 'Unable to sign in')
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
              <Key className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-text-secondary mt-2">Sign in to your RateLimiter account</p>
          </div>

          {generalError && (
            <div className="mb-6 p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              required
              disabled={loading}
              leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {generalError && (
              <div className="p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
                {generalError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? <Loader2 className="w-5 h-5" /> : 'Sign in'}
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}