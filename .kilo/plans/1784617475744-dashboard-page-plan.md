# Dashboard Page Implementation Plan

## Goal
Build a frontend dashboard page that allows authenticated users to:
- View their API keys in a list (name, capacity, refillRate, active status, current month usage)
- Create new API keys via a modal form
- Copy the API key to clipboard (only shown once on creation)
- Deactivate/delete API keys
- Auto-redirect to login if not authenticated

## Tech Stack
- React 19 + React Router DOM
- Tailwind CSS (deep red / soft yellow theme)
- Vite dev server with proxy to `http://localhost:3000/api`

## Backend API Endpoints (already implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/` | cookie JWT | Create API key → returns `{ id, name, capacity, refillRate, key }` |
| GET | `/api/` | cookie JWT | List user's keys → `[{ id, name, capacity, refillRate, active, createdAt }]` |
| GET | `/api/:id/usage` | cookie JWT | Monthly usage → `{ month, count }` |
| DELETE | `/api/:id` | cookie JWT | Deactivate key → `{ ok: true }` |

## File Structure to Create/Modify
```
client/src/
├── pages/
│   └── dashboard/
│       ├── index.jsx          (main dashboard page)
│       └── DashboardPage.jsx  (renamed from index.jsx for clarity)
├── components/
│   ├── ApiKeyList.jsx         (table/list of keys with usage)
│   ├── CreateApiKeyModal.jsx  (modal form for new key)
│   ├── ApiKeyCard.jsx         (individual key row with actions)
│   └── AuthGuard.jsx          (HOC to protect routes)
├── utils/
│   └── apiUtils.js            (add createKey, listKeys, getUsage, deleteKey)
└── hooks/
    └── useAuth.js             (auth state + redirect logic)
```

## Implementation Tasks

### 1. Update `client/src/utils/apiUtils.js`
Add functions:
- `createApiKey({ name, capacity, refillRate })` → POST `/api/`
- `listApiKeys()` → GET `/api/`
- `getApiKeyUsage(keyId)` → GET `/api/:id/usage`
- `deleteApiKey(keyId)` → DELETE `/api/:id`

All with `credentials: 'include'` for cookie auth.

### 2. Create `client/src/hooks/useAuth.js`
- `useAuth()` hook that:
  - Calls `/api/checkAuth` (or any protected endpoint) on mount
  - Stores `user` state (id, name, email)
  - Redirects to `/login` if 401/unauthorized
  - Returns `{ user, loading, logout }`

### 3. Create `client/src/components/AuthGuard.jsx`
- Wrapper component that uses `useAuth`
- Shows loading spinner while checking auth
- Renders children if authenticated, else redirects

### 4. Create `client/src/components/ApiKeyList.jsx`
- Fetches keys via `listApiKeys()`
- For each key, fetches usage via `getApiKeyUsage(keyId)` (can use `Promise.all` or `useEffect` per key)
- Renders table with columns: Name | Capacity | Refill Rate | Status | This Month | Actions
- Loading skeleton while fetching
- Empty state: "No API keys yet. Create your first key."

### 5. Create `client/src/components/CreateApiKeyModal.jsx`
- Modal with form: Name (text, optional), Capacity (number, default 20), Refill Rate (number, default 5)
- On submit: calls `createApiKey()`, shows success toast with the **raw key** (only time it's visible)
- "Copy to clipboard" button for the raw key
- Close modal after copy or user dismisses

### 6. Create `client/src/components/ApiKeyCard.jsx` (or inline in list)
- Row component with:
  - Key info display
  - Active/Inactive badge
  - Usage count this month
  - "Delete" button → confirm → `deleteApiKey()` → refresh list

### 7. Update `client/src/pages/dashboard/index.jsx` (or `DashboardPage.jsx`)
- Wrap in `<AuthGuard>`
- Layout: Header (user name + logout), "Create API Key" button, `<ApiKeyList />`, `<CreateApiKeyModal />`
- State: `showModal`, `keys[]`, `loading`

### 8. Update `client/src/App.jsx`
- Add route: `/dashboard` → DashboardPage (protected)
- Update root redirect: `/` → `/dashboard` (if auth) else `/login`

### 9. Styling (Tailwind)
- Theme: `bg-gradient-to-br from-red-950 to-red-900`
- Cards: `bg-red-900/80 border border-red-800/50 rounded-2xl`
- Primary buttons: `bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50`
- Text: `text-yellow-200` (headings), `text-yellow-300` (body), `text-yellow-400/50` (muted)
- Inputs: `bg-red-800/50 border border-red-700/60 focus:ring-yellow-400/50 focus:border-yellow-400`
- Modal overlay: `fixed inset-0 bg-black/50 backdrop-blur-sm`

## Edge Cases & Error Handling
- Network errors → toast notification
- 401 on any API call → logout + redirect to login
- Delete confirmation modal
- Key only shown once → warn user to copy immediately
- Empty usage → show "0" or "—"
- Rate limit on backend → handle 429 gracefully

## Validation Steps
1. Start backend (`npm run dev` in root)
2. Start frontend (`npm run dev` in client/)
3. Register/login → should land on `/dashboard`
4. See empty state → click "Create API Key"
5. Fill form → submit → see key in toast → copy it
6. Key appears in list with usage = 0
7. Click delete → confirm → key removed
8. Refresh page → keys persist (cookie auth)
9. Logout → redirect to login

## Out of Scope (Future)
- Regenerate key endpoint
- Historical usage charts
- Key permissions/scopes
- Team/organization sharing
- Webhook configuration
- Real-time polling

---
**Ready for implementation.** The plan is complete and actionable.