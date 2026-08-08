import { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { Button, Input, Card, CardBody, CardHeader } from '../components/ui'
import { User, Mail, Lock, Bell, Shield } from 'lucide-react'
import { useToastContext } from '../components/ui/Toast'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({ name: '', email: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    // TODO: Implement profile update API
    setTimeout(() => {
      setProfileLoading(false)
      success('Profile updated successfully!')
    }, 1000)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    setPasswordLoading(true)
    setPasswordError('')
    // TODO: Implement password change API
    setTimeout(() => {
      setPasswordLoading(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      success('Password changed successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-64 flex-shrink-0">
          <CardBody className="p-2">
            <nav className="space-y-1" aria-label="Settings navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors font-medium ${
                      activeTab === tab.id ? 'bg-primary-light text-primary' : ''
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <h2 className="section-title">Profile</h2>
                <p className="text-text-secondary text-sm mt-1">Update your personal information</p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name || user?.name || ''}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your name"
                    leftIcon={<User className="w-5 h-5 text-text-secondary" />}
                    disabled={profileLoading}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email || user?.email || ''}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="Enter your email"
                    leftIcon={<Mail className="w-5 h-5 text-text-secondary" />}
                    disabled={profileLoading}
                  />
                  {profileError && (
                    <div className="p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
                      {profileError}
                    </div>
                  )}
                  <Button type="submit" loading={profileLoading}>
                    Save Changes
                  </Button>
                </form>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h2 className="section-title">Change Password</h2>
                <p className="text-text-secondary text-sm mt-1">Update your password for security</p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
                    required
                    disabled={passwordLoading}
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
                    required
                    hint="At least 8 characters"
                    disabled={passwordLoading}
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    leftIcon={<Lock className="w-5 h-5 text-text-secondary" />}
                    required
                    disabled={passwordLoading}
                  />
                  {passwordError && (
                    <div className="p-3 rounded-lg bg-error-bg text-error text-sm border border-error-border" role="alert">
                      {passwordError}
                    </div>
                  )}
                  <Button type="submit" loading={passwordLoading}>
                    Change Password
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="section-title mb-4">Danger Zone</h3>
                  <p className="text-text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger" onClick={() => { /* TODO: Implement account deletion */ }}>
                    Delete Account
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h2 className="section-title">Notifications</h2>
                <p className="text-text-secondary text-sm mt-1">Configure your notification preferences</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-6 max-w-md">
                  <div>
                    <h3 className="font-medium text-text-primary mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'usage-alerts', label: 'Usage Alerts', description: 'Get notified when API key usage exceeds 80% capacity' },
                        { id: 'weekly-reports', label: 'Weekly Reports', description: 'Receive a weekly summary of your API usage' },
                        { id: 'security-alerts', label: 'Security Alerts', description: 'Get notified about suspicious activity on your keys' },
                        { id: 'product-updates', label: 'Product Updates', description: 'Receive updates about new features and improvements' },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-text-primary">{item.label}</p>
                            <p className="text-sm text-text-secondary">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked={item.id !== 'product-updates'}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}