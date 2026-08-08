import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import apiUtils from '../utils/apiUtils'

const VerifyEmailPage = () => {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      navigate(`/reset-password?token=${token}`, { replace: true })
    }
  }, [navigate, searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setErrorMessage('Please enter the verification code before continuing.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const data = await apiUtils.verifyEmail(trimmedCode)
      setSuccessMessage(data.message || 'Email verified successfully!')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to verify your email')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address before requesting a new code.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const data = await apiUtils.resendVerificationEmail(email)
      setSuccessMessage(data.message || 'A new verification code has been sent.')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to resend the verification code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page verify-email-page">
      <section className="auth-hero" aria-label="Email verification introduction">
        <div className="brand-block">
          <div className="brand-mark">✉️</div>
          <div>
            <p className="eyebrow">Almost there</p>
            <h1>Verify your inbox.</h1>
          </div>
        </div>

        <p className="hero-copy">
          Enter the six-digit code we sent to your email to activate your account and continue securely.
        </p>
      </section>

      <section className="auth-card">
        <div className="auth-card-inner">
          <p className="eyebrow">Email verification</p>
          <h2>Check your email</h2>
          <p className="auth-subtitle">We sent a verification code to your inbox. Enter it below to continue.</p>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          {successMessage ? <p className="form-success">{successMessage}</p> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </label>

            <label className="field">
              <span>Verification code</span>
              <input
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
              />
            </label>

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify email'}
            </button>
          </form>

          <button type="button" className="link-button" onClick={handleResendCode} disabled={loading}>
            Request a new code
          </button>
        </div>
      </section>
    </div>
  )
}

export default VerifyEmailPage
