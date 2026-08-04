# Theme Migration & Bug Fix Plan

## Step 1: Create TODO.md tracker (current)

## Step 2: Fix backend issues
- [ ] Fix `client/src/stores/useAuthStore.js` — add named export for Navbar compatibility
- [ ] Fix `client/src/components/layout/Layout.jsx` — missing imports (useLocation, Outlet, NavLink)
- [ ] Fix `client/src/components/layout/Navbar.jsx` — useAuthStore import (default vs named)

## Step 3: Migrate auth pages to new dark theme
- [ ] `client/src/App.jsx` — change bg to `bg-bg`
- [ ] `client/src/pages/login.jsx` — full color migration
- [ ] `client/src/pages/signUp.jsx` — full color migration
- [ ] `client/src/pages/forgotPassword.jsx` — full color migration
- [ ] `client/src/pages/resetPassword.jsx` — full color migration
- [ ] `client/src/pages/verifyEmail.jsx` — full color migration

## Step 4: Migrate components to new dark theme
- [ ] `client/src/components/CreateApiKeyModal.jsx` — full color migration
- [ ] `client/src/components/ApiKeyCard.jsx` — full color migration
- [ ] `client/src/components/googleAuth.jsx` — full color migration

## Step 5: Verify
- [ ] Start dev server and verify no errors

