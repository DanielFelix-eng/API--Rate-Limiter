# Documentation / Integration Page Enhancement Plan

## Overview
Enhance the existing `DocsPage.jsx` to provide a comprehensive, production-ready documentation page for developers integrating with the RateLimiter API. The page should cover authentication, API key management, rate limit checking, error handling, and integration examples across multiple languages.

## Current State Analysis
- **Existing**: `client/src/pages/DocsPage.jsx` has basic structure with sidebar navigation, code blocks, and copy buttons
- **Backend APIs**:
  - Auth: `/api/signUp`, `/api/login`, `/api/logout`, `/api/checkAuth`, `/api/verifyEmail`, `/api/resendVerification`, `/api/forgotPassword`, `/api/resetPassword`, `/api/googleAuth`
  - API Keys: `POST /api/keys`, `GET /api/keys`, `GET /api/keys/:id/usage`, `DELETE /api/keys/:id`
  - Rate Limit Check: `POST /api/check` (requires `x-api-key` header)
- **Token Bucket Algorithm**: Capacity (bucket size), Refill Rate (tokens/sec)
- **Response Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

## Goals
1. **Complete API Reference** - Document all endpoints with request/response examples
2. **Integration Guides** - Step-by-step guides for common use cases
3. **Code Examples** - Production-ready snippets for Node.js, Python, Go, cURL, JavaScript (browser)
4. **Best Practices** - Error handling, retry logic, key rotation, monitoring
5. **Interactive Elements** - Live API tester, copy-to-clipboard with feedback
6. **Responsive Design** - Works on mobile, tablet, desktop

## Implementation Plan

### Phase 1: Content Enhancement
- [ ] **Expand API Reference** with full request/response schemas for all endpoints
- [ ] **Add Integration Guides** section:
  - Protecting an Express.js API
  - Protecting a Next.js API route
  - Protecting a Python FastAPI endpoint
  - Client-side rate limiting (SPA)
- [ ] **Add Best Practices** section:
  - Choosing capacity/refillRate values
  - Handling 429 responses with exponential backoff
  - API key rotation strategy
  - Monitoring and alerting
- [ ] **Add Troubleshooting/FAQ** section

### Phase 2: Interactive Features
- [ ] **API Key Selector** - Dropdown to select user's keys for auto-filling examples
- [ ] **Live Request Builder** - Form to construct and test `/api/check` requests
- [ ] **Response Viewer** - Pretty-printed JSON response display
- [ ] **Copy-to-Clipboard with Toast** - Replace TODO with actual toast notifications

### Phase 3: UI/UX Improvements
- [ ] **Responsive Sidebar** - Collapsible on mobile with hamburger menu
- [ ] **Table of Contents** - Auto-generated from headings in active section
- [ ] **Search/Filter** - Filter sidebar sections by keyword
- [ ] **Dark Mode Support** - Ensure code blocks and UI work in dark mode
- [ ] **Anchor Links** - Deep linking to sections via URL hash

### Phase 4: Advanced Features (Optional)
- [ ] **OpenAPI/Swagger Export** - Generate OpenAPI spec from code
- [ ] **SDK Documentation** - Document official SDKs if available
- [ ] **Webhook Documentation** - If webhooks are planned

## Technical Details

### New Components Needed
1. `ApiReferenceTable` - Reusable table for endpoint documentation
2. `CodeBlock` - Enhanced code block with line numbers, copy button, language tabs
3. `RequestBuilder` - Interactive form for building API requests
4. `ResponseViewer` - Collapsible JSON response display
5. `SidebarNav` - Extracted responsive sidebar component

### Data Structure for Documentation Content
```javascript
const docsContent = {
  categories: [
    {
      title: 'Getting Started',
      sections: [...]
    },
    {
      title: 'Authentication',
      sections: [...]
    },
    {
      title: 'API Reference',
      sections: [
        { id: 'auth-endpoints', title: 'Auth Endpoints', endpoints: [...] },
        { id: 'key-endpoints', title: 'API Key Management', endpoints: [...] },
        { id: 'check-endpoint', title: 'Rate Limit Check', endpoints: [...] }
      ]
    },
    {
      title: 'Integration Guides',
      sections: [...]
    },
    {
      title: 'Best Practices',
      sections: [...]
    },
    {
      title: 'Error Reference',
      sections: [...]
    }
  ]
}
```

### Endpoint Documentation Format
```javascript
{
  method: 'POST',
  path: '/api/check',
  description: 'Check rate limit for an identifier',
  auth: 'x-api-key header',
  request: {
    headers: { 'x-api-key': 'rlk_...', 'Content-Type': 'application/json' },
    body: { identifier: 'user-123' }
  },
  responses: {
    200: { allowed: true, remaining: 15, limit: 20 },
    429: { allowed: false, remaining: 0, limit: 20, retryAfter: 200 },
    401: { error: 'Missing x-api-key header' },
    403: { error: 'Invalid API key' }
  },
  headers: {
    'X-RateLimit-Limit': 'Bucket capacity',
    'X-RateLimit-Remaining': 'Tokens remaining',
    'Retry-After': 'Seconds until next token (on 429)'
  }
}
```

## Files to Modify
1. `client/src/pages/DocsPage.jsx` - Main page component (major rewrite)
2. `client/src/components/ui/` - New components (CodeBlock, RequestBuilder, etc.)
3. `client/src/utils/apiUtils.js` - Add helper for documentation (if needed)

## Validation Checklist
- [ ] All backend endpoints documented with examples
- [ ] Code examples are syntactically correct and runnable
- [ ] Copy buttons work with toast feedback
- [ ] Page is responsive (mobile/tablet/desktop)
- [ ] Keyboard navigation works (tab through sidebar, sections)
- [ ] Deep linking via URL hash works
- [ ] Dark mode renders correctly
- [ ] No console errors

## Open Questions
1. **Base URL**: Should examples use relative (`/api/`) or absolute (`https://api.example.com/api/`) URLs?
2. **Authentication**: Document cookie-based JWT for dashboard vs `x-api-key` for rate limit checks clearly
3. **Rate Limit Algorithm**: Include token bucket explanation with visual diagram?
4. **Analytics/Usage API**: Document `/api/keys/:id/usage` for programmatic access?
5. **Versioning**: Include API versioning strategy in docs?

## Recommendation
Start with Phase 1-2 (content + interactive features) as they provide immediate value. Phase 3-4 can be iterative improvements.