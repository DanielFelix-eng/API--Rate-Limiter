import { useState } from 'react'
import { Button, Card, CardBody, CardHeader } from '../components/ui'
import { FileText, Code, Terminal, ExternalLink, Copy, Check } from 'lucide-react'

export default function DocsPage() {
  const docs = [
    {
      title: 'Getting Started',
      sections: [
        {
          id: 'introduction',
          title: 'Introduction',
          content: `RateLimiter protects your API with a token-bucket rate limiter. Each API key can be configured with a bucket capacity and refill rate, and the backend checks requests with the POST /api/check endpoint.`
        },
        {
          id: 'quickstart',
          title: 'Quick Start',
          content: `1. Sign up or log in to the app\n2. Create an API key from the dashboard\n3. Copy the generated key, for example rlk_xxxxxxxxxx\n4. Send the key in the \`x-api-key\` header on each rate-limit check\n5. Use the response to allow or deny the user action for your own service`
        },
        {
          id: 'authentication',
          title: 'Authentication Model',
          content: `The backend uses two different auth patterns:\n\n- User dashboard endpoints: protected with a JWT cookie named \`token\`. The browser app handles this automatically.\n- API rate-limit checks: protected with the \`x-api-key\` header. This is the header you send for integration requests.\n\nImportant: the rate-limit endpoint does not read an Authorization header. It reads the raw API key directly from \`x-api-key\`.`
        }
      ]
    },
    {
      title: 'API Reference',
      sections: [
        {
          id: 'auth-endpoints',
          title: 'Auth Endpoints',
          content: `\`\`\`\nPOST /api/signUp\nPOST /api/login\nPOST /api/logout\nGET  /api/checkAuth\nPOST /api/verifyEmail\nPOST /api/resendVerification\nPOST /api/forgotPassword\nPOST /api/resetPassword\nPOST /api/googleAuth\n\`\`\``
        },
        {
          id: 'google-auth',
          title: 'Google OAuth',
          content: `Google OAuth allows users to sign in with their Google account.\n\n\`\`\`\nPOST /api/googleAuth\nBody: { "email", "name", "uid", "photoURL" }\n\`\`\`\n\nThe frontend uses Firebase to authenticate the user, then sends the Google profile data to this endpoint. The backend creates or finds the user, marks them as verified, and returns a JWT cookie.`
        },
        {
          id: 'key-endpoints',
          title: 'API Key Endpoints',
          content: `These routes require a valid user JWT cookie, because they belong to the authenticated dashboard account.\n\`\`\`\nPOST   /api/               - Create a key\nGET    /api/               - List keys for the current user\nGET    /api/:id/usage      - Get usage data for a key\nDELETE /api/:id            - Revoke a key\n\`\`\`\n\nResponse from key creation includes:\n\`\`\`json\n{\n  "_id": "...",\n  "id": "...",\n  "name": "default",\n  "capacity": 20,\n  "refillRate": 5,\n  "key": "rlk_xxxxxxxxx"\n}\n\`\`\``
        },
        {
          id: 'check-endpoint',
          title: 'Rate Limit Check',
          content: `\`\`\`\nPOST /api/check\nHeaders:\n  x-api-key: rlk_xxxxxxxxx\nBody:\n  { "identifier": "user-123" }\n\nResponse when allowed:\n  { "allowed": true, "remaining": 19, "limit": 20 }\n\nResponse when blocked:\n  { "allowed": false, "remaining": 0, "limit": 20, "retryAfter": 200 }\n\`\`\`\n\nThe backend also returns headers:\n- X-RateLimit-Limit\n- X-RateLimit-Remaining\n- Retry-After (on 429)`
        }
      ]
    },
    {
      title: 'Integration Examples',
      sections: [
        {
          id: 'node',
          title: 'Node.js',
          content: `\`\`\`javascript\nconst apiKey = 'rlk_your_key_here'\nconst baseUrl = process.env.RATELIMITER_API_URL || 'http://localhost:3000'\n\nconst response = await fetch(baseUrl + '/api/check', {\n  method: 'POST',\n  headers: {\n    'x-api-key': apiKey,\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ identifier: 'user-123' })\n})\n\nconst data = await response.json()\n\nif (!data.allowed) {\n  console.log('Rate limited. Retry after', data.retryAfter, 'ms')\n  return\n}\n\nconsole.log('Allowed:', data.allowed, 'remaining:', data.remaining)\n\`\`\``
        },
        {
          id: 'python',
          title: 'Python',
          content: `\`\`\`python\nimport os\nimport requests\n\napi_key = 'rlk_your_key_here'\nbase_url = os.getenv('RATELIMITER_API_URL', 'http://localhost:3000')\n\nresponse = requests.post(\n    f'{base_url}/api/check',\n    headers={'x-api-key': api_key},\n    json={'identifier': 'user-123'}\n)\n\ndata = response.json()\n\nif not data['allowed']:\n    print(f"Rate limited. Retry after {data['retryAfter']}ms")\n    raise SystemExit\n\nprint('Allowed:', data['allowed'])\n\`\`\``
        },
        {
          id: 'curl',
          title: 'cURL',
          content: `\`\`\`bash\nBASE_URL=http://localhost:3000\nAPI_KEY=rlk_your_key_here\n\ncurl -X POST $BASE_URL/api/check \\\n  -H "x-api-key: $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"identifier":"user-123"}'\n\`\`\``
        }
      ]
    },
    {
      title: 'Behavior & Limits',
      sections: [
        {
          id: 'bucket',
          title: 'Token Bucket Rules',
          content: `Each API key owns a token bucket with a configured capacity and refill rate. The app stores values on the key record and applies them to the request identifier.\n\n- capacity: maximum tokens in the bucket\n- refillRate: tokens added per second\n- identifier: optional string used to distinguish users, sessions, or IPs\n\nIf no identifier is supplied, the backend uses the default bucket key.`
        },
        {
          id: 'usage',
          title: 'Usage Tracking',
          content: `Every successful check records usage for the current month, keyed by API key ID. This data is available through the authenticated usage endpoint:\n\`\`\`\nGET /api/:id/usage\n\`\`\``
        }
      ]
    },
    {
      title: 'Error Codes',
      sections: [
        {
          id: 'errors',
          title: 'Common Errors',
          content: `\`\`\`\n400 - Bad Request\n401 - Missing or invalid API key\n403 - Invalid API key or key revoked\n429 - Rate limit exceeded\n500 - Internal server error\n\`\`\`\n\nRate limit response (429):\n\`\`\`json\n{\n  "allowed": false,\n  "remaining": 0,\n  "limit": 20,\n  "retryAfter": 200\n}\n\`\`\``
        }
      ]
    }
  ]

  const [activeSection, setActiveSection] = useState('introduction')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Documentation</h1>
        <p className="page-subtitle">Learn how to integrate and use RateLimiter</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <Card className="lg:w-72 flex-shrink-0 hidden lg:block">
          <CardBody className="p-4">
            <nav className="space-y-1" aria-label="Documentation navigation">
              {docs.map((category) => (
                <div key={category.title} className="space-y-1">
                  <h3 className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {category.title}
                  </h3>
                  {category.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-light text-primary font-medium'
                          : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
                      }`}
                      aria-current={activeSection === section.id ? 'page' : undefined}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {docs.flatMap((category) => category.sections).map((section) => (
            <Card key={section.id} className={activeSection !== section.id ? 'hidden' : 'block'}>
              <CardHeader>
                <h2 className="section-title">{section.title}</h2>
              </CardHeader>
              <CardBody>
                <div className="prose prose-slate max-w-none">
                  {section.content.split('\n').map((line, i) => {
                    if (line.startsWith('```')) return null
                    if (line.trim() === '') return <br key={i} />
                    if (line.startsWith('- ')) return (
                      <li key={i} className="ml-6 list-disc text-text-secondary">{line.slice(2)}</li>
                    )
                    if (line.match(/^\d+\. /)) return (
                      <li key={i} className="ml-6 list-decimal text-text-secondary">{line}</li>
                    )
                    return <p key={i} className="text-text-secondary leading-relaxed">{line}</p>
                  })}
                </div>
                {/* Code blocks */}
                {section.content.includes('```') && (
                  <div className="mt-4 space-y-4">
                    {section.content.split('```').filter((_, i) => i % 2 === 1).map((code, i) => (
                      <div key={i} className="relative group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-secondary">Example</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(code.trim())
                              // TODO: Show toast
                            }}
                            aria-label="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                          <code>{code.trim()}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}