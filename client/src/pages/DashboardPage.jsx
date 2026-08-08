import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useKeysStore } from '../stores/useKeysStore'
import { useAuthStore } from '../stores/useAuthStore'
import { Button, Card, CardBody, CardHeader, Badge, EmptyState } from '../components/ui'
import { LayoutDashboard, Key, Plus, BarChart3, ArrowRight, ExternalLink, Eye } from 'lucide-react'
import { useToastContext } from '../components/ui/Toast'

export default function DashboardPage() {
  const { keys, loading: keysLoading, fetchKeys, fetchUsage, usageByKeyId } = useKeysStore()
  const { user } = useAuthStore()
  const { success, error: toastError } = useToastContext()

  // Ensure keys is always an array
  const keysArray = Array.isArray(keys) ? keys : []

  const totalKeys = keysArray.length
  const activeKeys = keysArray.filter((k) => k.active).length
  const totalRequests = Object.values(usageByKeyId).reduce((sum, u) => sum + (u?.count || 0), 0)

  const recentKeys = keysArray.slice(0, 5)

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  useEffect(() => {
    keys.forEach((key) => {
      if (key.active && !usageByKeyId[key._id]) {
        fetchUsage(key._id)
      }
    })
  }, [keys, usageByKeyId, fetchUsage])

  const getUsagePercent = (key) => {
    const usage = usageByKeyId[key._id]
    if (!usage) return 0
    // Estimate monthly capacity: capacity * refillRate * seconds in month / capacity
    // Simplified: assume monthly quota is capacity * 2592000 (30 days * 86400 seconds)
    const monthlyCapacity = key.capacity * 2592000 / key.refillRate
    return Math.min(100, (usage.count / monthlyCapacity) * 100)
  }

  const getUsageColor = (percent) => {
    if (percent < 50) return 'success'
    if (percent < 80) return 'warning'
    return 'danger'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your API rate limiting</p>
        </div>
        <Link to="/api-keys">
          <Button>
            <Plus className="w-4 h-4" />
            Create API Key
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Keys</p>
                <p className="stat-value">{totalKeys}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Active Keys</p>
                <p className="stat-value">{activeKeys}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Requests (Month)</p>
                <p className="stat-value">{totalRequests.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning-bg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Avg Daily Requests</p>
                <p className="stat-value">
                  {totalKeys > 0 ? Math.round(totalRequests / 30).toLocaleString() : 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-text-secondary" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Recent API Keys</h2>
              <p className="text-text-secondary text-sm">Your most recently created keys</p>
            </div>
            <Link to="/api-keys">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {keysLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : keys.length === 0 ? (
            <EmptyState
              icon={<Key className="w-12 h-12" />}
              title="No API keys yet"
              description="Create your first API key to start protecting your endpoints"
              children={
                <Link to="/api-keys">
                  <Button>
                    <Plus className="w-4 h-4" />
                    Create API Key
                  </Button>
                </Link>
              }
              className="py-12"
            />
          ) : (
            <div className="divide-y divide-border">
              {recentKeys.map((key) => {
                const usage = usageByKeyId[key._id]
                const usagePercent = getUsagePercent(key)
                const usageColor = getUsageColor(usagePercent)
                return (
                  <div key={key._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-text-primary truncate">{key.name || 'Unnamed Key'}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                          <Badge variant={key.active ? 'success' : 'neutral'}>
                            {key.active ? 'Active' : 'Revoked'}
                          </Badge>
                          <span>Capacity: {key.capacity}</span>
                          <span>Refill: {key.refillRate}/sec</span>
                          {usage && (
                            <span>Used: {usage.count.toLocaleString()} this month</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { /* TODO: Key detail view */ }} aria-label={`View ${key.name || 'key'} details`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link to="/analytics">
                        <Button variant="ghost" size="icon" aria-label="View analytics">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}