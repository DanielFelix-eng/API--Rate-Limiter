import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, loading, fetchUser } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (loading) {
      fetchUser()
    }
  }, [loading, fetchUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}