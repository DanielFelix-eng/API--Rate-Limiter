import { useState, useCallback, useRef, useEffect } from 'react'
import { Send, Loader2, Check, X, Zap, Trash2 } from 'lucide-react'
import { Button, Input, Card, CardBody, CardHeader, Badge } from '../ui'
import { useToastContext } from '../ui/Toast'
import { useKeysStore } from '../../stores/useKeysStore'
import { CodeBlock } from './CodeBlock'

const API_BASE = '/api'

export function RequestBuilder() {
  const { keys } = useKeysStore()
  const { success, error: toastError } = useToastContext()
  const [selectedKey, setSelectedKey] = useState('')
  const [identifier, setIdentifier] = useState('user-123')
  const [loading, setLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState(null)
  const [lastRequest, setLastRequest] = useState(null)
  const responseRef = useRef(null)

  const activeKeys = keys.filter(k => k.active)

  const handleRequest = useCallback(async () => {
    if (!selectedKey) {
      toastError('Please select an API key')
      return
    }

    setLoading(true)
    const requestBody = { identifier }
    const requestConfig = {
      method: 'POST',
      headers: {
        'x-api-key': selectedKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }

    setLastRequest({ url: `${API_BASE}/check`, ...requestConfig, body: requestBody })

    try {
      const response = await fetch(`${API_BASE}/check`, requestConfig)
      const data = await response.json()
      
      setLastResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        timestamp: new Date().toISOString()
      })
      
      if (response.ok && data.allowed) {
        success(`Request allowed! Remaining: ${data.remaining}/${data.limit}`)
      } else if (response.status === 429) {
        toastError(`Rate limited! Retry after ${data.retryAfter}ms`)
      } else {
        toastError(data.error || 'Request failed')
      }
    } catch (err) {
      toastError('Network error: ' + err.message)
      setLastResponse({
        status: 0,
        error: err.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }, [selectedKey, identifier, success, toastError])

  const handleClear = () => {
    setLastResponse(null)
    setLastRequest(null)
  }

  const copyCurl = () => {
    if (!selectedKey) return
    const curl = `curl -X POST ${API_BASE}/check \\
  -H "x-api-key: ${selectedKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ identifier })}'`
    navigator.clipboard.writeText(curl)
    success('cURL command copied!')
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="section-title">Live API Tester</h2>
          <Badge variant="secondary">Try it live</Badge>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Configuration */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-medium text-text-primary">Configuration</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">API Key</label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="input"
              >
                <option value="">Select an API key...</option>
                {activeKeys.map(key => (
                  <option key={key._id} value={key.key}>
                    {key.name || 'Unnamed'} (${key.key?.slice(0, 12)}...)
                  </option>
                ))}
              </select>
              {activeKeys.length === 0 && (
                <p className="text-sm text-text-secondary mt-1">
                  No active keys. <a href="/api-keys" className="text-primary hover:underline">Create one</a>
                </p>
              )}
            </div>
            
            <div>
              <label className="label">Identifier</label>
              <Input
                placeholder="user-123"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                hint="Unique identifier for rate limiting (e.g., user ID, IP)"
              />
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleRequest} 
            loading={loading} 
            disabled={!selectedKey || loading}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Checking...' : 'Check Rate Limit'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={copyCurl}
            disabled={!selectedKey}
          >
            Copy cURL
          </Button>
          {lastResponse && (
            <Button variant="ghost" onClick={handleClear} className="text-error">
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>

        {/* Last Request */}
        {lastRequest && (
          <div className="space-y-2">
            <h4 className="font-medium text-text-primary">Last Request</h4>
            <CodeBlock
              code={`POST ${lastRequest.url}
${Object.entries(lastRequest.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}

${JSON.stringify(lastRequest.body, null, 2)}`}
              language="http"
              title="Request"
              filename="request.http"
            />
          </div>
        )}

        {/* Last Response */}
        {lastResponse && (
          <div className="space-y-2">
            <h4 className="font-medium text-text-primary">Response</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={lastResponse.status === 200 && lastResponse.data?.allowed ? 'success' : 
                        lastResponse.status === 429 ? 'warning' : 'danger'}
              >
                {lastResponse.status} {lastResponse.status === 200 ? 'OK' : lastResponse.status === 429 ? 'Too Many Requests' : 'Error'}
              </Badge>
              <span className="text-xs text-text-secondary">{new Date(lastResponse.timestamp).toLocaleTimeString()}</span>
            </div>
            <CodeBlock
              code={JSON.stringify(lastResponse.data || { error: lastResponse.error }, null, 2)}
              language="json"
              title="Response Body"
              filename="response.json"
            />
            {lastResponse.headers && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                  Response Headers
                </summary>
                <CodeBlock
                  code={Object.entries(lastResponse.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}
                  language="http"
                  title="Headers"
                  showLineNumbers={false}
                />
              </details>
            )}
          </div>
        )}

        {/* Empty State */}
        {!lastRequest && !lastResponse && (
          <div className="text-center py-8 text-text-secondary border-2 border-dashed border-slate-200 rounded-lg">
            <Zap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Select an API key and click "Check Rate Limit" to test the API</p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}