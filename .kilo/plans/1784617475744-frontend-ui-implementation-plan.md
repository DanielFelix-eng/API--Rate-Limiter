# API Rate Limiter - Frontend UI Implementation Plan

## Project Overview
Build a production-ready frontend for an API Rate Limiter service with authentication, API key management, and usage analytics. The backend is already implemented with Express, MongoDB, and Redis-based token bucket rate limiting.

## Tech Stack
- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **API Client**: Custom fetch wrapper with cookie-based auth
- **Icons**: Lucide React

---

## Design System

### Color Palette (from requirements)
- **Primary**: `bg-blue-600` / `hover:bg-blue-700`
- **Background**: `bg-white`
- **Card**: `bg-slate-50`
- **Border**: `border-slate-200`
- **Text Primary**: `text-slate-900`
- **Text Secondary**: `text-slate-500`

### Typography
- **Font**: System UI stack (Inter/IBM Plex Sans)
- **Headings**: font-semibold/text-slate-900
- **Body**: text-slate-500
- **Code/Mono**: font-mono text-sm

### Components
- **Buttons**: Rounded-lg, transition-colors, disabled states
- **Inputs**: Rounded-lg, border-slate-200, focus:ring-2 focus:ring-blue-500
- **Cards**: bg-slate-50, border-slate-200, rounded-xl, shadow-sm
- **Error states**: text-red-600 bg-red-50 border-red-200
- **Success states**: text-green-600 bg-green-50 border-green-200

---

## Backend API Endpoints

### Auth (Cookie-based JWT)
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/signUp` | `{email, name, password}` | None |
| POST | `/api/login` | `{email, password}` | None |
| POST | `/api/logout` | - | Cookie |
| GET | `/api/checkAuth` | - | Cookie |
| POST | `/api/verifyEmail` | `{code}` | None |
| POST | `/api/resendVerification` | `{email}` | Cookie |
| POST | `/api/forgotPassword` | `{email}` | None |
| POST | `/api/resetPassword` | `{token, password, confirmPassword}` | None |
| POST | `/api/googleAuth` | `{email, name, uid, photoURL}` | None |

### API Keys (JWT Cookie)
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/` | `{name?, capacity?, refillRate?}` | `{_id, name, capacity, refillRate, key}` |
| GET | `/api/` | - | `[{_id, name, capacity, refillRate, active, createdAt}]` |
| GET | `/api/:id/usage` | - | `{month, count}` |
| DELETE | `/api/:id` | - | `{ok: true}` |

### Rate Limit Check (API Key Header)
| Method | Endpoint | Headers | Body | Response |
|--------|----------|---------|------|----------|
| POST | `/api/check` | `x-api-key: rlk_...` | `{identifier?}` | `{allowed, remaining, limit, retryAfter?}` |

---

## Frontend Pages & Components

### 1. Public Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email/password + Google OAuth |
| Sign Up | `/signup` | Name, email, password |
| Verify Email | `/verify-email` | 6-digit code entry + resend |
| Forgot Password | `/forgot-password` | Email entry for reset link |
| Reset Password | `/reset-password` | Token from URL + new password |

### 2. Protected App Pages (require auth)
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Overview: total keys, active keys, total requests this month, key list |
| API Keys | `/api-keys` | Create/list/revoke keys, view usage, copy key (shown once) |
| Analytics | `/analytics` | Charts: usage trends, key comparison, insights |
| Settings | `/settings` | Profile, password change, email preferences |
| Documentation | `/docs` | Static markdown docs |

### 3. Layout Components
- **AppLayout**: Sidebar + header + content area
- **Sidebar**: Navigation links, collapsible on mobile
- **Header**: User avatar, notifications, logout
- **ProtectedRoute**: Wrapper for auth-required pages

---

## State Management (Zustand Stores)

### useAuthStore
```js
{
  user: null,           // {id, name, email, isVerified, googleId?, profilePicture?}
  loading: true,
  error: null,
  fetchUser: async () => {},
  login: async (formData) => {},
  signup: async (formData) => {},
  logout: async () => {},
}
```

### useApiKeysStore
```js
{
  keys: [],             // [{_id, name, capacity, refillRate, active, createdAt}]
  loading: false,
  error: null,
  usageByKeyId: {},     // {keyId: {month, count}}
  fetchKeys: async () => {},
  createKey: async (data) => {},
  revokeKey: async (keyId) => {},
  fetchUsage: async (keyId) => {},
}
```

### useAnalyticsStore
```js
{
  trendData: [],        // [{month, requests}] - 12 months
  keyComparisonData: [], // [{name, requests, capacity, refillRate}] - top 10
  loading: false,
  fetchAnalytics: async () => {},
}
```

---

## Implementation Phases

### Phase 1: Foundation & Auth (Week 1)
1. Set up Tailwind config with design tokens
2. Create AppLayout with Sidebar/Header
3. Implement ProtectedRoute wrapper
4. Build auth pages:
   - Login page (email/password + Google)
   - Sign Up page
   - Verify Email page (code + resend)
   - Forgot Password page
   - Reset Password page (token from URL)
5. Wire auth store to backend endpoints
6. Test auth flow: signup → verify → login → logout

### Phase 2: API Keys Management (Week 2)
1. Create API Keys page with:
   - Key list table (name, capacity, refillRate, status, usage, actions)
   - Create Key modal (name, capacity default 20, refillRate default 5)
   - Key creation success toast with **raw key copy** (shown once)
   - Revoke confirmation modal
   - Usage fetch per key (monthly count)
2. Wire keys store to backend endpoints
3. Add empty state for new users

### Phase 3: Dashboard & Analytics (Week 3)
1. Dashboard page:
   - Stats cards: Total Keys, Active Keys, Total Requests This Month
   - Recent API Keys list with quick actions
   - Quick create key button
2. Analytics page:
   - Usage trend chart (12 months) - Recharts
   - Key comparison bar chart (top 10)
   - Insights: most active key, total requests, avg daily
3. Wire analytics store (aggregate from keys + usage)

### Phase 4: Documentation & Polish (Week 4)
1. Documentation page with static markdown:
   - Getting Started
   - API Reference (auth, keys, check endpoint)
   - Integration Examples (Node, Python, cURL)
   - Plans & Limits
   - Error Codes
2. Settings page: profile, change password, email prefs
3. Responsive design: mobile sidebar drawer, tablet breakpoints
4. Accessibility: focus states, ARIA labels, keyboard nav
5. Error boundaries, loading skeletons, empty states

---

## Key UX Decisions

### API Key Creation Flow
1. User clicks "Create Key" → Modal opens
2. User fills name (optional), capacity (default 20), refillRate (default 5)
3. On submit → API returns **raw key** (only time shown)
4. Show success toast with copyable code block + "This won't be shown again" warning
5. Provide pre-filled cURL/Node snippet for `/api/check` usage

### Token Bucket Visualization
- Dashboard shows: "Capacity: 20 | Refill: 5/sec"
- Usage bar: percentage of monthly quota used
- Color coding: green < 50%, yellow 50-80%, red > 80%

### Error Handling
- Network errors: toast notification
- 401: redirect to login
- 429: show retry-after countdown
- Validation errors: inline field messages

---

## File Structure (Target)
```
client/src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── SignUpForm.jsx
│   │   ├── VerifyEmailForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   └── ResetPasswordForm.jsx
│   ├── keys/
│   │   ├── KeyList.jsx
│   │   ├── KeyCard.jsx
│   │   ├── CreateKeyModal.jsx
│   │   └── RevokeConfirmModal.jsx
│   ├── charts/
│   │   ├── UsageTrendChart.jsx
│   │   ├── KeyComparisonChart.jsx
│   │   └── StatsCards.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       └── Toast.jsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── VerifyEmailPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── ApiKeysPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── SettingsPage.jsx
│   └── DocsPage.jsx
├── stores/
│   ├── useAuthStore.js
│   ├── useApiKeysStore.js
│   └── useAnalyticsStore.js
├── utils/
│   ├── apiUtils.js
│   └── helpers.js
├── hooks/
│   └── useAuth.js
├── App.jsx
├── main.jsx
└── index.css (Tailwind v4 config)
```

---

## Dependencies to Add
```json
{
  "dependencies": {
    "recharts": "^2.12.0",
    "lucide-react": "^0.453.0"
  }
}
```

---

## Validation Checklist
- [ ] Auth flow: signup → email verify → login → logout works
- [ ] Create API key shows raw key once, copy works
- [ ] Revoke key removes from list, usage cleared
- [ ] Dashboard shows correct stats from backend
- [ ] Analytics charts render with real data
- [ ] Mobile: sidebar drawer, header responsive
- [ ] 401 redirects to login, 429 shows retry-after
- [ ] Google OAuth works (if configured)
- [ ] Documentation page renders markdown
- [ ] All forms have validation + error states
- [ ] Loading skeletons for async data
- [ ] Empty states for new users

---

## Out of Scope (Future)
- Team/organization workspaces
- Webhook configuration
- Custom rate limit rules per endpoint
- Real-time usage updates (WebSockets)
- Export analytics (CSV/PDF)
- API key rotation/regeneration

---

## Questions for Clarification

1. **Chart Library**: Use Recharts (recommended) or Chart.js? Recharts is more React-native.

2. **Google OAuth**: Is `GOOGLE_CLIENT_ID` configured in backend? Frontend needs it for the button.

3. **Markdown Rendering**: Use `react-markdown` + `remark-gfm` for docs page?

4. **Toast Library**: Use `react-hot-toast` or custom toast component?

5. **Settings Page**: Should it include password change (requires current password) or just profile/email prefs?

6. **Rate Limit Check Endpoint**: Should frontend have a "Test Key" feature that calls `/api/check`?

7. **Historical Data**: Backend only stores monthly aggregates. Should we simulate daily data for charts or add a new backend endpoint?

---

Ready to proceed with implementation once decisions are confirmed.