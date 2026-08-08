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
          content: `Welcome to RateLimiter API documentation. RateLimiter helps you protect your APIs with intelligent rate limiting using the token bucket algorithm.`
        },
        {
          id: 'quickstart',
          title: 'Quick Start',
          content: `1. Sign up for an account\n2. Create an API key from the dashboard\n3. Include the key in your requests via the \`x-api-key\` header\n4. Start protecting your endpoints!`
        },
        {
          id: 'authentication',
          title: 'Authentication',
          content: `All API endpoints (except auth) require authentication via cookie-based JWT. The frontend handles this automatically. For direct API access, use the \`x-api-key\` header with your API key.`
        }
      ]
    },
    {
      title: 'API Reference',
      sections: [
        {
          id: 'auth-endpoints',
          title: 'Auth Endpoints',
          content: `\`\`\`\nPOST /api/signUp     - Create account\nPOST /api/login      - Sign in\nPOST /api/logout     - Sign out\nGET  /api/checkAuth  - Check auth status\nPOST /api/verifyEmail - Verify email\nPOST /api/resendVerification - Resend code\nPOST /api/forgotPassword - Request reset\nPOST /api/resetPassword - Reset password\n\`\`\``
        },
        {
          id: 'key-endpoints',
          title: 'API Key Endpoints',
          content: `\`\`\`\nPOST   /api/           - Create key\nGET    /api/           - List keys\nGET    /api/:id/usage  - Get usage\nDELETE /api/:id        - Revoke key\n\`\`\``
        },
        {
          id: 'check-endpoint',
          title: 'Rate Limit Check',
          content: `\`\`\`\nPOST /api/check\nHeaders: x-api-key: rlk_...\nBody: { "identifier": "user-123" }\nResponse: { "allowed", "remaining", "limit", "retryAfter" }\n\`\`\``
        }
      ]
    },
    {
      title: 'Integration Examples',
      sections: [
        {
          id: 'node',
          title: 'Node.js',
          content: `\`\`\`javascript\nconst response = await fetch('https://api.ratelimiter.com/api/check', {\n  method: 'POST',\n  headers: {\n    'x-api-key': 'rlk_your_key_here',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ identifier: 'user-123' })\n})\n\nconst { allowed, remaining, limit, retryAfter } = await response.json()\n\nif (!allowed) {\n  console.log(\`Rate limited. Retry after \${retryAfter}ms\`)\n  return\n}\n\n// Proceed with request\n\`\`\``
        },
        {
          id: 'python',
          title: 'Python',
          content: `\`\`\`python\nimport requests\n\nresponse = requests.post(\n    'https://api.ratelimiter.com/api/check',\n    headers={'x-api-key': 'rlk_your_key_here'},\n    json={'identifier': 'user-123'}\n)\n\ndata = response.json()\n\nif not data['allowed']:\n    print(f"Rate limited. Retry after {data['retryAfter']}ms")\n    return\n\n# Proceed with request\n\`\`\``
        },
        {
          id: 'curl',
          title: 'cURL',
          content: `\`\`\`bash\ncurl -X POST https://api.ratelimiter.com/api/check \\\n  -H "x-api-key: rlk_your_key_here" \\\n  -H "Content-Type: application/json" \\\n  -d '{"identifier": "user-123"}'\n\`\`\``
        }
      ]
    },
    {
      title: 'Plans & Limits',
      sections: [
        {
          id: 'free',
          title: 'Free Tier',
          content: `- 10 API keys\n- 100,000 requests/month\n- Basic analytics\n- Community support`
        },
        {
          id: 'pro',
          title: 'Pro',
          content: `- Unlimited API keys\n- 10,000,000 requests/month\n- Advanced analytics\n- Priority support\n- Custom rate limit rules`
        },
        {
          id: 'enterprise',
          title: 'Enterprise',
          content: `- Unlimited requests\n- Dedicated infrastructure\n- SLA guarantee\n- Custom integrations\n- 24/7 support`
        }
      ]
    },
    {
      title: 'Error Codes',
      sections: [
        {
          id: 'errors',
          title: 'Common Errors',
          content: `\`\`\`\n400 - Bad Request\n401 - Unauthorized (invalid/missing API key)\n403 - Forbidden (key revoked)\n429 - Too Many Requests (rate limited)\n500 - Internal Server Error\n\`\`\`\n\nRate limit response (429):\n\`\`\`json\n{\n  "allowed": false,\n  "remaining": 0,\n  "limit": 20,\n  "retryAfter": 200\n}\n\`\`\``
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