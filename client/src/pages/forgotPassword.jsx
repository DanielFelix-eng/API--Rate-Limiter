import { useState } from 'react'
import { Link } from 'react-router-dom'
import apiUtils from '../utils/apiUtils'

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!formData.email.trim()) nextErrors.email = 'Email is required'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const data = await apiUtils.forgotPassword({ email: formData.email })
      setSuccessMessage(data.message || 'Password reset email sent successfully!')
      setFormData({ email: '' })
    } catch (error) {
      setErrorMessage(error.message || 'Unable to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page forgot-password-page">
      <section className="auth-hero" aria-label="Password recovery introduction">
        <div className="brand-block">
          <div className="brand-mark">🔐</div>
          <div>
            <p className="eyebrow">Password recovery</p>
            <h1>Reset access safely.</h1>
          </div>
        </div>

        <p className="hero-copy">
          Enter your email and we’ll send a secure reset link so you can get back into your workspace quickly.
        </p>
      </section>

      <section className="auth-card">
        <div className="auth-card-inner forgot-password-card">
          <p className="eyebrow">Recover account</p>
          <h2>Forgot your password?</h2>
          <p className="auth-subtitle">We’ll send a reset link to the email address on your account.</p>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          {successMessage ? <p className="form-success">{successMessage}</p> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
              />
            </label>

            {errors.email ? <p className="form-error">{errors.email}</p> : null}

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </button>
          </form>

          <p className="signup-link">
            <Link to="/">Back to sign in</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default ForgotPasswordPage
