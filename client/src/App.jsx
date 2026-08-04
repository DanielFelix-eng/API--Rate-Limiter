import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from './stores/useAuthStore'
import './App.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const signup = useAuthStore((state) => state.signup)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }

        const data = await signup(payload)
        if (data?.success) {
          navigate('/verify-email')
        } else {
          setError(data?.message || 'Signup failed')
        }
      } else {
        const payload = {
          email: formData.email,
          password: formData.password,
        }

        const data = await login(payload)
        if (data?.success) {
          navigate('/dashboard')
        } else {
          setError(data?.message || 'Login failed')
        }
      }
    } catch (err) {
      setError(err.message || (isSignup ? 'Unable to create account' : 'Unable to sign in'))
    } finally {
      setLoading(false)
    }
  }

  const isSignup = location.pathname === '/signup'

  return (
    <div className="auth-page">
      <motion.section
        className="auth-hero"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        aria-label="Product introduction"
      >
        <div className="brand-block">
          <div className="brand-mark">⚡</div>
          <div>
            <p className="eyebrow">{isSignup ? 'Launch securely' : 'Secure traffic control'}</p>
            <h1>{isSignup ? 'Build with confidence.' : 'Protect every request.'}</h1>
          </div>
        </div>

        <motion.p
          className="hero-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {isSignup
            ? 'Create your workspace and start protecting every request with intelligent throttling, policy controls, and live observability.'
            : 'Shield your APIs with intelligent throttling, encrypted access, and real-time visibility across every endpoint.'}
        </motion.p>

        <motion.div
          className="illustration-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          aria-hidden="true"
        >
          <motion.div className="orb orb-one" animate={{ y: [0, -10, 0], x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} />
          <motion.div className="orb orb-two" animate={{ y: [0, 8, 0], x: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
          <div className="network-grid">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} />
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} />
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} />
          </div>
          <motion.div className="shield-pill" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}>
            Secure • Fast • Observable
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="auth-card"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        aria-label="Sign up form"
      >
        <motion.div className="auth-card-inner" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.55 }}>
          <p className="eyebrow">{isSignup ? 'Create account' : 'Welcome back'}</p>
          <h2>{isSignup ? 'Start protecting your APIs' : 'Sign in to your workspace'}</h2>
          <p className="auth-subtitle">
            {isSignup
              ? 'Join the platform and manage rate limits with confidence.'
              : 'Access your API policies, keys, and protection metrics.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup ? (
              <label className="field">
                <span>Full name</span>
                <input name="name" type="text" placeholder="Alex Morgan" value={formData.name} onChange={handleChange} required />
              </label>
            ) : null}

            <label className="field">
              <span>Email</span>
              <input name="email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Password</span>
              <input name="password" type="password" placeholder={isSignup ? 'Create a strong password' : 'Enter your password'} value={formData.password} onChange={handleChange} required />
            </label>

            {!isSignup ? (
              <div className="form-row">
                <label className="checkbox-row">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#">Forgot password?</a>
              </div>
            ) : null}

            {error ? <p className="form-error">{error}</p> : null}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : isSignup ? 'Create account' : 'Sign in'}
            </motion.button>
          </form>

          <p className="signup-link">
            {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(isSignup ? '/' : '/signup') }}>
              {isSignup ? 'Sign in' : 'Create one'}
            </a>
          </p>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default App
