import { useState, useEffect } from 'react'
import { useKeysStore } from '../stores/useKeysStore'
import { Button, Card, CardBody, CardHeader, Badge, Input, Modal, EmptyState } from '../components/ui'
import { Key, Plus, Trash2, Copy, Check, Loader2, Eye, EyeOff, Shield, Info } from 'lucide-react'
import { useToastContext } from '../components/ui/Toast'

export default function ApiKeysPage() {
  const { keys, loading, fetchKeys, createKey, revokeKey, fetchUsage, usageByKeyId } = useKeysStore()
  const { success, error: toastError } = useToastContext()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({ name: '', capacity: 20, refillRate: 5 })
  const [formErrors, setFormErrors] = useState({})
  const [newKey, setNewKey] = useState(null)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [revokingKey, setRevokingKey] = useState(null)
  const [showRevokeModal, setShowRevokeModal] = useState(null)

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  useEffect(() => {
    const keysArray = Array.isArray(keys) ? keys : []
    keysArray.forEach((key) => {
      if (key.active && !usageByKeyId[key._id]) {
        fetchUsage(key._id)
      }
    })
  }, [keys, usageByKeyId, fetchUsage])

  const validateForm = () => {
    const errors = {}
    if (formData.capacity < 1) errors.capacity = 'Capacity must be at least 1'
    if (formData.refillRate < 1) errors.refillRate = 'Refill rate must be at least 1'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateKey = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setCreating(true)
    try {
      const key = await createKey(formData)
      setNewKey(key)
      setShowKey(true)
      setShowCreateModal(false)
      setFormData({ name: '', capacity: 20, refillRate: 5 })
      success('API key created successfully!')
    } catch (err) {
      toastError(err.message || 'Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async () => {
    if (!showRevokeModal) return
    setRevokingKey(showRevokeModal)
    try {
      await revokeKey(showRevokeModal)
      success('API key revoked')
    } catch (err) {
      toastError(err.message || 'Failed to revoke API key')
    } finally {
      setRevokingKey(null)
      setShowRevokeModal(null)
    }
  }

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">API Keys</h1>
          <p className="page-subtitle">Manage your API keys for rate limiting</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create API Key
        </Button>
      </div>

      {/* Keys List */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
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
              description="Create your first API key to start protecting your endpoints with rate limiting"
              children={
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4" />
                  Create API Key
                </Button>
              }
              className="py-16"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Refill Rate</th>
                    <th>Status</th>
                    <th>Usage (Month)</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => {
                    const usage = usageByKeyId[key._id]
                    return (
                      <tr key={key._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                              <Key className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">{key.name || 'Unnamed Key'}</p>
                              <p className="text-xs text-text-secondary font-mono">{key.key?.slice(0, 12)}...</p>
                            </div>
                          </div>
                        </td>
                        <td><code className="text-sm">{key.capacity}</code></td>
                        <td><code className="text-sm">{key.refillRate}/sec</code></td>
                        <td>
                          <Badge variant={key.active ? 'success' : 'neutral'}>
                            {key.active ? 'Active' : 'Revoked'}
                          </Badge>
                        </td>
                        <td>
                          {usage ? (
                            <span className="font-mono text-sm">{usage.count.toLocaleString()}</span>
                          ) : (
                            <span className="text-text-secondary text-sm">-</span>
                          )}
                        </td>
                        <td className="text-text-secondary text-sm">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            {key.active && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowRevokeModal(key._id)}
                                disabled={revokingKey === key._id}
                                aria-label={`Revoke ${key.name || 'key'}`}
                              >
                                <Trash2 className="w-4 h-4 text-error" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create API Key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} loading={creating} disabled={creating}>
              {creating ? 'Creating...' : 'Create Key'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateKey} className="space-y-4">
          <Input
            label="Name (optional)"
            name="name"
            placeholder="e.g., Production API"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            hint="A friendly name to identify this key"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
              error={formErrors.capacity}
              hint="Max requests in bucket"
            />
            <Input
              label="Refill Rate"
              name="refillRate"
              type="number"
              min="1"
              value={formData.refillRate}
              onChange={(e) => setFormData({ ...formData, refillRate: parseInt(e.target.value) || 1 })}
              error={formErrors.refillRate}
              hint="Requests added per second"
            />
          </div>
          <p className="text-sm text-text-secondary">
            <Info className="w-4 h-4 inline mr-1" /> This uses a token bucket algorithm. Capacity is the bucket size, refill rate is tokens added per second.
          </p>
        </form>
      </Modal>

      {/* Show New Key Modal */}
      <Modal
        isOpen={!!newKey}
        onClose={() => { setNewKey(null); setShowKey(false); setCopied(false); }}
        title="API Key Created"
        size="lg"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div className="p-4 bg-success-bg border border-success-border rounded-lg">
            <div className="flex items-center gap-2 text-success mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Your API key is ready!</span>
            </div>
            <p className="text-sm text-text-secondary">
              This is the only time the full key will be shown. Copy and store it securely.
            </p>
          </div>

          <div className="space-y-3">
            <label className="label">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={newKey.key}
                readOnly
                className="input font-mono text-sm pr-12"
                aria-label="API key"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(newKey.key)}
                  aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {copied && <p className="text-sm text-success">Copied to clipboard!</p>}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium text-text-primary mb-2">Test your key:</p>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono"><code>{`curl -X POST http://localhost:3000/api/check \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"identifier": "user-123"}'`}</code></pre>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button onClick={() => { setNewKey(null); setShowKey(false); setCopied(false); }}>
              I've saved my key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Revoke Confirmation Modal */}
      <Modal
        isOpen={!!showRevokeModal}
        onClose={() => setShowRevokeModal(null)}
        title="Revoke API Key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRevokeModal(null)} disabled={revokingKey}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRevoke} loading={!!revokingKey}>
              Revoke Key
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Shield className="w-12 h-12 text-warning mx-auto" />
          <p className="text-center text-text-secondary">
            Are you sure you want to revoke this API key? This action cannot be undone.
            The key will immediately stop working for all rate limit checks.
          </p>
        </div>
      </Modal>
    </div>
  )
}