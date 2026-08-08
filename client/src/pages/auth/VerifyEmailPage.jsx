import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button, Input, Card, CardBody } from '../../components/ui'
import { Loader2, Mail, RotateCcw } from 'lucide-react'
import { useToastContext } from '../../components/ui/Toast'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyEmail, resendVerificationEmail } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [generalError, setGeneralError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(emailParam)
  }, [searchParams])

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (generalError) setGeneralError('')
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    pasted.split('').forEach((char, i) => {
      const input = document.getElementById(`code-${i}`)
      if (input) input.value = char
    })
    setCode(pasted.split('').concat(Array(6 - pasted.length).fill('')))
    if (pasted.length === 6) handleSubmit()
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length !== 6) return

    setLoading(true)
    setGeneralError('')

    try {
      const data = await verifyEmail(fullCode)
      if (data?.success) {
        success('Email verified successfully!')
        navigate('/login')
      } else {
        setGeneralError(data?.message || 'Invalid verification code')
      }
    } catch (err) {
      setGeneralError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return

    setResendLoading(true)
    try {
      const data = await resendVerificationEmail(email)
      if (data?.success) {
        success('Verification code resent!')
        setResendCooldown(60)
      } else {
        toastError(data?.message || 'Failed to resend code')
      }
    } catch (err) {
      toastError(err.message || 'Failed to resend code')
    } finally {
      setResendLoading(false)
    }
  }

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [resendCooldown])

  const isComplete = code.every((c) => c.length === 1)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Verify your email</h1>
            <p className="text-text-secondary mt-2">
              We've sent a 6-digit code to <span className="font-medium">{email || 'your email'}</span>
            </p>
          </div>

          {generalError && (
            <div className="mb-6 p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2" role="group" aria-label="Verification code">
              {code.map((char, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  disabled={loading}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!isComplete}>
              {loading ? <Loader2 className="w-5 h-5" /> : 'Verify'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-text-secondary text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendLoading}
                className="text-primary hover:underline font-medium disabled:text-text-secondary disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? (
                  <>Resend in {resendCooldown}s <RotateCcw className="w-4 h-4 inline animate-spin ml-1" /></>
                ) : resendLoading ? (
                  <><Loader2 className="w-4 h-4 inline animate-spin mr-1" />Sending...</>
                ) : (
                  'Resend code'
                )}
              </button>
            </p>
            <p className="text-text-secondary text-sm mt-2">
              <a href="/login" className="text-primary hover:underline font-medium">Back to login</a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}