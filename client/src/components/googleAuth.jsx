import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import useAuthStore from '../stores/useAuthStore'

export default function GoogleAuth() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      const { user } = result

      const response = await fetch('/api/googleAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        }),
      })

      const data = await response.json()

      if (data.success) {
        useAuthStore.setState({ user: data.user, loading: false, error: null })
        navigate('/dashboard')
      } else {
        setError(data.message || 'Google sign-in failed')
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="social-auth">
      <div className="social-divider">
        <span>or</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="google-btn"
      >
        <span className="google-icon" aria-hidden="true">
          <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M533.5 278.4c0-18.3-1.5-36-4.3-53.2H272v100.7h146.9c-6.4 34.7-25.9 64.1-55 83.8v69.6h88.8c52.1-48 82-118.6 82-201z" />
            <path fill="#34A853" d="M272 544.3c74 0 136-24.6 181.4-66.7l-88.8-69.6c-24.6 16.5-56 26.1-92.6 26.1-71 0-131.2-47.9-152.8-112.5H29.8v70.6C74.4 485.1 167 544.3 272 544.3z" />
            <path fill="#FBBC05" d="M119.2 325.6c-8.6-25.6-8.6-53.3 0-78.9V176.1H29.8c-44.4 88.7-44.4 192.8 0 281.5l89.4-70z" />
            <path fill="#EA4335" d="M272 107.7c39.2 0 74.6 13.5 102.4 39.8l76.8-76.8C407.6 24.7 346 0 272 0 167 0 74.4 59.2 29.8 146.1l89.4 70C140.8 155.6 201 107.7 272 107.7z" />
          </svg>
        </span>
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>

      {error ? <p className="form-error social-error">{error}</p> : null}
    </div>
  )
}
