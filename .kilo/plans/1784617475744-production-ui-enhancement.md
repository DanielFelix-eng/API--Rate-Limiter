# Production-Ready UI Enhancement Plan

## Overview
Transform the current basic dashboard into a polished, production-ready application with:
- Modern dark theme (Background: #0B1120, Sidebar: #111827, Primary: #00E676, Accent: #14B8A6)
- Collapsible sidebar navigation (Dashboard, API Keys, Docs)
- Top navbar with user greeting and profile menu
- Dashboard with usage charts
- Framer Motion animations and Lucide React icons
- Fully responsive design

---

## Color Scheme Configuration

### Tailwind CSS v4 Theme (in `client/src/index.css`)
```css
@import "tailwindcss";

@theme {
  --color-bg: #0B1120;
  --color-sidebar: #111827;
  --color-primary: #00E676;
  --color-accent: #14B8A6;
  --color-card: #161F35;
  --color-border: #1F2A44;
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;
}
```

---

## Component Architecture

### 1. Layout Components (`client/src/components/layout/`)
- **`Layout.jsx`** - Root layout with sidebar + navbar + outlet
- **`Sidebar.jsx`** - Collapsible sidebar with navigation links
- **`Navbar.jsx`** - Top bar with user greeting, profile dropdown
- **`SidebarNavItem.jsx`** - Individual nav link with icon + label

### 2. Pages (`client/src/pages/`)
- **`dashboard/index.jsx`** - Overview with charts, stats cards
- **`api-keys/index.jsx`** - API key management (moved from dashboard)
- **`docs/index.jsx`** - Documentation page
- **`settings/index.jsx`** - User settings (optional, for profile menu)

### 3. Chart Components (`client/src/components/charts/`)
- **`UsageChart.jsx`** - Line/area chart for requests over time
- **`StatsCards.jsx`** - Summary cards (total keys, requests, avg latency)
- **`KeyUsageBreakdown.jsx`** - Bar chart per API key

### 4. UI Components (`client/src/components/ui/`)
- **`Card.jsx`** - Consistent card wrapper
- **`Button.jsx`** - Primary, secondary, ghost variants
- **`Dropdown.jsx`** - Profile dropdown menu
- **`Tooltip.jsx`** - For sidebar icons when collapsed

---

## State Management Updates

### Auth Store (`client/src/stores/useAuthStore.js`)
- Add `userName` derived from user email/name
- Add `toggleSidebar` action for mobile

### Keys Store (`client/src/stores/useKeysStore.js`)
- Add `fetchUsageHistory(keyId, days?)` for chart data
- Add `aggregateStats` computed (total requests, active keys, etc.)

---

## Routing Structure
```
/                    → Redirect to /dashboard
/login               → Login page (no layout)
/signup              → Signup page (no layout)
/verify-email        → Verify email (no layout)
/forgot-password     → Forgot password (no layout)
/reset-password      → Reset password (no layout)
/dashboard           → Dashboard with charts
/api-keys            → API Keys management
/docs                → Documentation
/settings            → User settings (optional)
```

---

## Implementation Tasks

### Phase 1: Theme & Layout Foundation
1. **Configure Tailwind theme** in `index.css` with new colors
2. **Create Layout component** with sidebar state (open/closed, mobile)
3. **Build Sidebar** with nav items, collapse/expand, Lucide icons
4. **Build Navbar** with greeting, user avatar, dropdown menu
5. **Update App.jsx** to use Layout for protected routes
6. **Add Framer Motion** page transitions and sidebar animations

### Phase 2: Dashboard with Charts
1. **Create chart components** using existing usage data
2. **Build StatsCards** - Total keys, total requests this month, active keys
3. **Build UsageChart** - Line chart of requests over last 30 days
4. **Build KeyUsageBreakdown** - Horizontal bar chart per key
5. **Assemble Dashboard page** with responsive grid layout

### Phase 3: API Keys Page
1. **Move existing dashboard content** to `/api-keys` page
2. **Add sidebar navigation link** for API Keys
3. **Preserve all functionality** (create, revoke, view usage)

### Phase 4: Docs Page
1. **Create documentation page** with API reference
3. **Add sidebar navigation link** for Docs

### Phase 5: Polish & Responsive
1. **Mobile sidebar** - slide-in overlay, hamburger menu in navbar
2. **Tablet breakpoint** - collapsible sidebar with icons only
3. **Animations** - page transitions, hover states, loading skeletons
4. **Dark mode polish** - consistent shadows, borders, focus states

---

## Data Flow for Charts

```
KeysStore.fetchKeys() 
  → For each key: KeysStore.fetchUsageHistory(keyId, 30)
  → Aggregate daily totals across all keys
  → Feed into UsageChart (Recharts or custom SVG)
  → Per-key totals feed KeyUsageBreakdown
```

---

## Dependencies (Already Installed)
- ✅ `framer-motion` ^12.43.0
- ✅ `lucide-react` ^1.27.0
- ✅ `react-router-dom` ^7.18.1
- ✅ `zustand` ^5.0.14
- ✅ `tailwindcss` ^4.3.3

---

## Open Questions

1. **Chart Library**: Use Recharts (add dependency) or custom SVG? Recommendation: Recharts for production quality.
2. **Usage History Endpoint**: Backend currently has `/api/keys/:id/usage` returning current month only. Need historical data endpoint or mock for now?
3. **Profile/Settings Page**: Include in scope or defer?
4. **Real-time Updates**: Poll for usage data or manual refresh only?

---

## Validation Checklist
- [ ] Theme colors apply correctly across all components
- [ ] Sidebar collapses/expands smoothly on all breakpoints
- [ ] Navbar shows user greeting with name/email
- [ ] Dashboard displays charts render without auth redirects to login ]
- [ ] Dashboard shows stats cards + charts with real data
- [ ] API Keys page works identically to old dashboard
- [ ] Docs page accessible from sidebar
- [ ] Mobile: hamburger menu opens sidebar overlay
- [ ] Tablet: sidebar shows icons only when collapsed
- [ ] Framer Motion animations don't cause layout shift
- [ ] Lucide icons used consistently
- [ ] Focus states visible for accessibility