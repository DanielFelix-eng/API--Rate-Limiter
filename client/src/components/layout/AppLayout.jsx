import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Key, 
  Settings, 
  FileText, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Monitor,
  Circle,
  TrendingUp
} from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/api-keys', icon: Key },
  { name: 'Monitoring', href: '/analytics', icon: Monitor },
  { name: 'Logs', href: '/docs', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/settings', icon: Circle },
]

export function Sidebar({ isOpen, onClose, isSmallScreen, isHovering, sidebarOpen }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <>
      {/* Backdrop for small screens only */}
      {isSmallScreen && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={`fixed top-0 z-50 h-screen flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          w-64 bg-card border-r border-border`}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden transition-all duration-300">
              <p className="text-xs font-semibold text-text-primary tracking-wide whitespace-nowrap">RateLimiter</p>
              <p className="text-[10px] text-text-secondary whitespace-nowrap">API Protection</p>
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
                onClick={() => {
                  // Don't close if sidebar is open but not pinned (hover mode on desktop)
                  if (isOpen && !sidebarOpen && !isSmallScreen) {
                    return
                  }
                  onClose()
                }}
                className={({ isActive }) => 
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
                  }`
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
                }`} aria-hidden="true" />
                <span className="truncate font-medium transition-opacity duration-200">
                  {item.name}
                </span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-lg" />
              ) : (
                <User className="w-5 h-5 text-primary" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); onClose(); }}
            className="w-full mt-3 flex items-center gap-3 px-3 py-2 text-left text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export function Header({ onToggleSidebar, sidebarOpen, onMouseEnter }) {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-slate-100 text-text-secondary transition-colors duration-200"
            onClick={onToggleSidebar}
            onMouseEnter={onMouseEnter}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex-1" />
        </div>

        <div className="flex-1 lg:flex-none" />

        <div className="flex items-center gap-3">
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  // For large screens: sidebar opens on hover, closes when leaving
  // For small screens: sidebar opens via button click
  const isSmallScreen = width < 1024
  
  // On large screens, sidebar can be toggled by click OR hover
  // On small screens, only by click
  const effectiveSidebarOpen = isSmallScreen ? sidebarOpen : (sidebarOpen || isHovering)

  // Toggle handler - works on all screen sizes
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  // Close handler
  const handleClose = () => {
    setSidebarOpen(false)
    setIsHovering(false)
  }

  // Hover handlers (only for large screens)
  const handleEnter = () => {
    if (!isSmallScreen) {
      setIsHovering(true)
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
    }
  }

  // Close when hovering over main content (or other areas)
  const handleMainEnter = () => {
    if (!isSmallScreen) {
      setIsHovering(false)
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
    }
  }

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      if (window.innerWidth < 1024 && hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
        setIsHovering(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [hoverTimeout])

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
      {isSmallScreen && (
        <Sidebar 
          isOpen={effectiveSidebarOpen} 
          onClose={handleClose} 
          isSmallScreen={isSmallScreen}
          isHovering={isHovering}
          sidebarOpen={sidebarOpen}
        />
      )}
      {!isSmallScreen && (
        <Sidebar 
          isOpen={effectiveSidebarOpen} 
          onClose={handleClose} 
          isSmallScreen={isSmallScreen}
          isHovering={isHovering}
          sidebarOpen={sidebarOpen}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <Header 
          onToggleSidebar={handleToggleSidebar} 
          sidebarOpen={effectiveSidebarOpen}
          onMouseEnter={handleEnter}
        />
        <main 
          className="flex-1 p-4 lg:p-6 overflow-auto"
          onMouseEnter={handleMainEnter}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}