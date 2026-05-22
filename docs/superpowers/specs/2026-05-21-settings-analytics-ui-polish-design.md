# Settings & Analytics UI Polish — Design Spec
**Date:** 2026-05-21  
**Scope:** Settings pages (Profile, Password, Billing) + Analytics page

---

## Approach
Full redesign using polish-first approach. Keep existing routing and API layer untouched. Redesign visual presentation only.

---

## Settings Page

### Layout
- App sidebar (existing, `290px`, `#09090b` background) remains unchanged in structure
- Main content area: full-width glass overlay card (`rgba(17,17,19,0.55)` + `backdrop-filter: blur(24px)`) covering the entire area after the app sidebar
- Gradient background behind the card: exact `bg-hero-gradient` (opacity 0.5, blur 72px) + `bg-amber-glow` from globals.css — same as dashboard
- Settings nav sidebar inside the card on the left (`200px`), plain text nav with rounded highlight on active item — no divider between nav and content
- Content area shifted right with `padding-left: 60px` on the card, `max-width: 520px` on content

### Settings Nav (inside card)
- "Settings" heading: `13px`, `font-weight: 600`, `rgba(255,255,255,0.85)`
- Nav items: `13px`, `font-weight: 500`, `rgba(255,255,255,0.4)` inactive, `#fff` + `rgba(255,255,255,0.1)` background active
- Tabs: Profile, Password, Billing

### Profile Page
- Page title: `22px`, `font-weight: 700`
- Avatar: gradient circle (`linear-gradient(135deg, #f59e0b, #d97706)`) showing initials, with amber ring glow
- Full name field: editable input, glass-style (`rgba(255,255,255,0.06)` bg, `rgba(255,255,255,0.1)` border, `border-radius: 10px`)
- Email field: readonly, dimmed (`rgba(255,255,255,0.28)`), "Verified" badge (emerald)
- Save button: white bg, black text, `border-radius: 10px`, `font-weight: 700`
- Danger Zone: red title, muted description, red-tinted bordered button — separated by a subtle `hr` divider

### Password Page
- Current password, New password, Confirm new password fields
- Password strength indicator (4-step: length, uppercase, number, special char)
- Show/hide toggle on password fields
- Save button same style as Profile

### Billing Page
- Current plan card showing plan name, usage bars (Documents, Queries today, Storage)
- Usage bars: red if >85%, amber otherwise
- Plan comparison: Free vs Pro cards
- Pro card: features list, price, "Coming Soon" state on checkout button (disabled, muted)

---

## Analytics Page

### Layout
- Same glass overlay card pattern as Settings — full main area after app sidebar
- Gradient background identical to Settings and Dashboard

### Changes
- Date range toggle: 7 / 30 / 90 days — pill-style toggle above charts, updates all chart data
- Stat cards: polish spacing, typography, shimmer loading states
- Charts: consistent amber color scheme, better empty states ("No data yet" with subtle icon)
- Answer Quality donut: improved legend layout
- Top Citations chart: consistent styling

---

## App Sidebar Polish
- Background: `#09090b`  
- New Chat: plain icon + text (no background)
- Analytics: plain icon + text
- Library section: collapsible with chevron, count right-aligned
- Upload button: Upload icon + text, muted
- Doc items: file type badge (red for PDF) + truncated name
- Recent section: search input, date group labels, conversation items
- Footer: Free plan upgrade card (amber-tinted, white Upgrade button) + user row (avatar, name, plan dot, settings icon, logout icon)

---

## What Does NOT Change
- All API calls, hooks, and backend integration
- Routing structure (`/settings/profile`, `/settings/password`, `/settings/billing`, `/analytics`)
- Auth context and user state management
- The `ProfileForm` component API surface (just restyled)
