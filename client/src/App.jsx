import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout, ProtectedRoute } from './components/layout'
import { ToastContainer } from './components/ui'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Protected pages
import DashboardPage from './pages/DashboardPage'
import ApiKeysPage from './pages/ApiKeysPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import DocsPage from './pages/DocsPage'

function PublicRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={
          <PublicRoute>
            <VerifyEmailPage />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/api-keys" element={<ApiKeysPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App