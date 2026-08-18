import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Key, BarChart3, Settings, FileText, Menu, X, LogOut, User, Bell } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Documentation', href: '/docs', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose, className }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <aside 
        className={`fixed lg:sticky top-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${className}`}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary tracking-wide">RateLimiter</p>
              <p className="text-[10px] text-text-secondary">API Protection</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-text-secondary"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
              <User className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); onClose(); }}
            className="w-full mt-3 sidebar-link text-error hover:bg-error-bg"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export function Header({ onToggleSidebar }) {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-text-secondary"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 lg:flex-none" />

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-text-secondary" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" aria-label="Unread notifications" />
          </button>

          <Link to="/settings" className="flex items-center gap-3 pl-3 border-l border-border lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-lg" />
              ) : (
                <User className="w-5 h-5 text-primary" aria-hidden="true" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>
          </Link>
          
          <Link to="/settings" className="hidden lg:flex items-center gap-3 pl-3 border-l border-border hover:bg-slate-50 rounded-lg p-2 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-lg" />
              ) : (
                <User className="w-5 h-5 text-primary" aria-hidden="true" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export function AppLayout() {
  const [width, setWidth] = useState(window.innerWidth)
  const [sidebarOpenButton, setSidebarOpenButton] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  // Compute if sidebar should be open based on width and state
  const sidebarOpen = width >= 1024 ? isHovering : sidebarOpenButton

  // Transform class for Sidebar
  const transformClass = width >= 1024 
    ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') 
    : (sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')

  // Hover handlers
  const handleEnter = () => {
    if (width >= 1024) {
      setIsHovering(true)
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
    }
  }

  const handleLeave = () => {
    if (width >= 1024) {
      setHoverTimeout(
        setTimeout(() => {
          setIsHovering(false)
          setHoverTimeout(null)
        }, 100)
      )
    }
  }

  // Close handler
  const handleClose = () => {
    if (width < 1024) {
      setSidebarOpenButton(false)
    } else {
      setIsHovering(false)
    }
  }

  // Toggle handler for small screens
  const handleToggleSidebar = () => {
    if (width < 1024) {
      setSidebarOpenButton(!sidebarOpenButton)
    }
  }

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      // Clear hover timeout if we go below 1024
      if (window.innerWidth < 1024 && hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
        setIsHovering(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Remove width and hoverTimeout from deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <div className="min-h-screen bg-background flex">
      {width >= 1024 ? (
        <div 
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="fixed left-0 top-0 bottom-0 w-64"
        >
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={handleClose} 
            className={transformClass}
          />
        </div>
      ) : (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleClose} 
          className={transformClass}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}