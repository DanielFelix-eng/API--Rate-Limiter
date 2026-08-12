import { Badge, CodeBlock } from './CodeBlock'

export function ApiReferenceTable({ endpoints }) {
  return (
    <div className="space-y-6">
      {endpoints.map((endpoint) => (
        <div key={`${endpoint.method}-${endpoint.path}`} className="border border-slate-200 rounded-lg overflow-hidden">
          {/* Endpoint Header */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <Badge 
              variant={endpoint.method === 'GET' ? 'success' : 
                      endpoint.method === 'POST' ? 'primary' : 
                      endpoint.method === 'DELETE' ? 'danger' : 'secondary'}
              className="text-xs font-mono px-2.5 py-1"
            >
              {endpoint.method}
            </Badge>
            <code className="font-mono text-sm text-text-primary">{endpoint.path}</code>
            {endpoint.deprecated && <Badge variant="warning">Deprecated</Badge>}
            {endpoint.auth && (
              <Badge variant="neutral" className="text-xs">
                {endpoint.auth}
              </Badge>
            )}
          </div>

          {/* Description */}
          {endpoint.description && (
            <div className="px-4 py-3 text-text-secondary text-sm">
              {endpoint.description}
            </div>
          )}

          {/* Request */}
          {endpoint.request && (
            <div className="border-t border-slate-200">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 font-medium text-text-secondary text-sm">
                Request
              </div>
              <div className="p-4 space-y-4">
                {endpoint.request.headers && (
                  <div>
                    <h5 className="font-medium text-sm text-text-secondary mb-2">Headers</h5>
                    <CodeBlock
                      code={Object.entries(endpoint.request.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}
                      language="http"
                      showLineNumbers={false}
                    />
                  </div>
                )}
                {endpoint.request.body && (
                  <div>
                    <h5 className="font-medium text-sm text-text-secondary mb-2">Body</h5>
                    <CodeBlock
                      code={JSON.stringify(endpoint.request.body, null, 2)}
                      language="json"
                      showLineNumbers={false}
                    />
                  </div>
                )}
                {endpoint.request.params && (
                  <div>
                    <h5 className="font-medium text-sm text-text-secondary mb-2">Path Parameters</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Type</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.request.params.map(param => (
                          <tr key={param.name}>
                            <td><code className="text-sm">{param.name}</code></td>
                            <td><code className="text-sm">{param.type}</code></td>
                            <td className="text-sm text-text-secondary">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Responses */}
          {endpoint.responses && (
            <div className="border-t border-slate-200">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 font-medium text-text-secondary text-sm">
                Responses
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(endpoint.responses).map(([status, response]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={status === '200' || status === '201' ? 'success' : 
                                status === '429' ? 'warning' : 
                                status.startsWith('4') ? 'danger' : 'secondary'}
                      >
                        {status}
                      </Badge>
                      <span className="text-sm text-text-secondary">{response.description}</span>
                    </div>
                    {response.body && (
                      <CodeBlock
                        code={JSON.stringify(response.body, null, 2)}
                        language="json"
                        showLineNumbers={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Headers */}
          {endpoint.responseHeaders && (
            <div className="border-t border-slate-200">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 font-medium text-text-secondary text-sm">
                Response Headers
              </div>
              <div className="p-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Header</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(endpoint.responseHeaders).map(([header, desc]) => (
                      <tr key={header}>
                        <td><code className="text-sm">{header}</code></td>
                        <td className="text-sm text-text-secondary">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Example */}
          {endpoint.example && (
            <div className="border-t border-slate-200 bg-slate-50">
              <div className="px-4 py-2 border-b border-slate-200 font-medium text-text-secondary text-sm">
                Example
              </div>
              <div className="p-4">
                <CodeBlock
                  code={endpoint.example}
                  language={endpoint.exampleLanguage || 'bash'}
                  showLineNumbers={false}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}