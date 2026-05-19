# Paperwise Design System

Design tokens, utilities, and patterns used across all pages. The source of truth is `src/styles/globals.css` — this doc explains usage.

---

## Color Tokens

Defined in `@theme` in `globals.css`. Available as Tailwind utility classes (`bg-*`, `text-*`, `border-*`).

| Token | Value | Tailwind class |
|---|---|---|
| `--color-bg` | `#080810` | `bg-bg` |
| `--color-card` | `rgba(28,28,30,0.85)` | `bg-card` |
| `--color-primary` | `#ffffff` | `bg-primary`, `text-primary` |
| `--color-accent` | `#f59e0b` | `bg-accent`, `text-accent` |

For SVG `fill`/`stroke`/`color` props and dynamic colors computed in JS, use a local `T` constant. Keep `T` minimal — only values that cannot be expressed as Tailwind classes:

```tsx
const T = {
  accent:  "#f59e0b",              // for Lucide color= prop, SVG stop colors
  primary: "#ffffff",              // for SVG gradients only
  border:  "rgba(255,255,255,0.08)", // for SVG stroke only
  muted:   "rgba(255,255,255,0.5)", // for SVG text only
};
```

`T.grad` (the radial logo gradient) is now the `bg-grad` utility class. Use `bg-grad` in JSX instead of an inline style.

---

## Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `--radius-btn` | `8px` | All buttons |
| `--radius-btn-md` | `10px` | Larger buttons |
| `--radius-card` | `14px` | Standard cards |
| `--radius-card-lg` | `18px` | Hero/feature cards |

---

## Component Utilities (`@utility`)

Use these class names directly in JSX — no import needed.

### Cards

```tsx
<div className="card">…</div>      {/* standard card */}
<div className="card-lg">…</div>   {/* larger radius */}
```

Both include: `background: var(--color-card)`, `border: 1px solid rgba(255,255,255,0.08)`, `overflow: hidden`, and the respective border-radius.

Add `shadow-[0_8px_40px_rgba(0,0,0,0.45)]` for elevated cards.

### Buttons

```tsx
<button className="btn-primary">Get started</button>
<button className="btn-secondary">Learn more</button>
```

- `btn-primary` — **white** background, dark (`#080810`) text
- `btn-secondary` — transparent background, white text, system border
- Both: `inline-flex`, `items-center`, `justify-center`, `font-semibold`, `text-sm`, hover fades to 88% opacity

### Typography

| Class | Size | Weight | Notes |
|---|---|---|---|
| `heading-hero` | `clamp(2.2rem, 5vw, 4.2rem)` | 900 | Main hero H1 |
| `heading-section` | `clamp(1.8rem, 4vw, 3rem)` | 800 | Section H2s |
| `heading-md` | `clamp(1.5rem, 3vw, 2.2rem)` | 800 | Sub-section H2/H3 |
| `heading-cta` | `clamp(1.6rem, 3.5vw, 2.4rem)` | 800 | CTA headlines |
| `section-label` | `0.75rem` | 700 | Amber eyebrow labels |

```tsx
<p className="section-label">How It Works</p>
<h2 className="heading-section">From upload to answer in seconds</h2>
```

### Text colors

```tsx
<p className="text-muted">…</p>   {/* rgba(255,255,255,0.5) */}
<p className="text-faint">…</p>   {/* rgba(255,255,255,0.22) */}
<p className="text-soft">…</p>    {/* rgba(255,255,255,0.78) — AI response body */}
```

### Borders

```tsx
<div className="border-system">…</div>    {/* all sides */}
<div className="border-t-system">…</div>  {/* top */}
<div className="border-b-system">…</div>  {/* bottom */}
<div className="border-r-system">…</div>  {/* right */}
```

All use `1px solid rgba(255,255,255,0.08)`.

### Divider

```tsx
<div className="divider" />   {/* 1px horizontal rule */}
```

### Section padding

```tsx
<section className="section-padding">…</section>  {/* 6rem 2.25rem */}
```

### Link accent

```tsx
<a className="link-accent">Read docs <ChevronRight /></a>
```

Amber color, `0.8125rem`, semibold, inline-flex with 4px gap.

### Logo gradient

```tsx
<div className="logo-grad h-8 w-8 rounded-full flex items-center justify-center">
  {initials}
</div>
```

`logo-grad` — `linear-gradient(135deg, #ffffff 0%, #f59e0b 100%)`. Used for avatar circles and the progress bar fill on the login page. For the radial accent gradient (onboarding steps, etc.) use `bg-grad` instead.

### Responsive sizes

```tsx
<div className="pt-hero">…</div>        {/* padding-top: clamp(120px, 16vh, 180px) */}
<p  className="text-hero-sub">…</p>     {/* font-size: clamp(0.95rem, 1.4vw, 1.1rem) */}
<div className="text-stat">…</div>      {/* font-size: clamp(2rem, 4vw, 3rem) — stat numbers */}
```

---

## Background Utilities

### Page backgrounds

```tsx
<div className="bg-bg">…</div>          {/* #080810 — full-page dark bg */}
<div className="bg-sidebar">…</div>     {/* rgba(8,8,16,0.65) — glass sidebar/panel */}
```

### Gradients

| Class | Usage |
|---|---|
| `bg-hero-gradient` | Hero section bottom-anchored radial (purple → amber → bg) |
| `bg-vignette` | Radial center-vignette overlay over hero |
| `bg-footer-gradient` | Footer top-anchored radial (purple → amber → bg) |
| `bg-login-gradient` | Login left-panel bottom-anchored radial |
| `bg-pricing-hero` | Pricing hero top-anchored subtle purple glow |
| `bg-pricing-cta` | Pricing footer top-anchored subtle purple glow |
| `bg-hero-fade` | Gradient-to-top fade for hero bleed (bg → transparent) |
| `bg-shimmer-bar` | Amber shimmer line on highlighted card borders |
| `bg-grad` | Logo/accent radial gradient (violet → purple → amber) |

```tsx
<div className="absolute inset-0 pointer-events-none bg-hero-gradient" />
<div className="absolute inset-0 pointer-events-none bg-vignette" />
<footer className="bg-footer-gradient">…</footer>
<div className="absolute top-0 inset-x-0 h-px bg-shimmer-bar" />
<div className="h-full rounded-full bg-grad" style={{ width: `${pct}%` }} />
```

### Opacity guidelines

Use the Tailwind slash modifier for all color opacity. For values < 10%, use decimal bracket form to match existing code:

```tsx
{/* < 10% — bracket form */}
<div className="bg-white/[0.04]">…</div>
<div className="bg-amber-500/[0.08]">…</div>

{/* ≥ 10% — integer form */}
<div className="bg-emerald-400/10">…</div>
<div className="bg-amber-500/20">…</div>
<div className="border border-amber-500/35">…</div>
```

---

## Animations

| Class | Effect |
|---|---|
| `animate-fu` | fadeUp, 0.7s, no delay |
| `animate-fu-1` | fadeUp, 0.10s delay |
| `animate-fu-2` | fadeUp, 0.22s delay |
| `animate-fu-3` | fadeUp, 0.34s delay |
| `animate-blink` | opacity blink, 1.1s loop |

Stagger children by using `animate-fu`, `animate-fu-1`, `animate-fu-2`, `animate-fu-3` in sequence.

---

## Gradient Patterns

All gradients are now `@utility` classes in `globals.css` — see **Background Utilities** above. Do not use inline `style={{ background: "..." }}` for any named gradient.

---

## Layout Patterns

### Nav

- Fixed, `h-[60px]`, `z-50`
- Transparent at top; adds `bg-bg/90 backdrop-blur-xl border-b-system` on scroll
- Logo: word mark only (`text-[15px] font-bold`) — no icon circle on nav
- Links: anchor-based `href="#section-id"` — no router navigation on the landing page

### Sections

Each section gets an `id` matching the nav anchor:

```tsx
<section id="features" …>
<section id="how-it-works" …>
<section id="pricing" …>
<section id="faq" …>
```

### Full-width footer

No card, no rounded corners — the `<footer>` itself carries the gradient. Structure:

```
<footer> (gradient background)
  CTA area (text + buttons)
  <div class="border-t-system">
    Logo + tagline | Nav links | Social icons
    <div class="border-t-system">
      Copyright | Legal links
    </div>
  </div>
</footer>
```

### Dashboard layout

The dashboard is a full-viewport flex layout with a fixed-width left sidebar and a fluid main panel. Both panels use `bg-sidebar` (glass) over the page-level `bg-hero-gradient` + `bg-vignette`.

```
<div class="flex h-screen overflow-hidden bg-bg">
  <div class="absolute inset-0 bg-hero-gradient pointer-events-none" />
  <div class="absolute inset-0 bg-vignette pointer-events-none" />

  <aside class="w-[255px] flex-shrink-0 bg-sidebar border-r-system z-10">
    …sidebar…
  </aside>

  <main class="flex-1 flex flex-col min-w-0 bg-sidebar z-10">
    …chat area…
  </main>
</div>
```

**Dashboard-specific CSS** is injected inline via a `<style>` tag inside the component (not in globals.css) because it uses pseudo-selectors and compound rules that `@utility` can't express:

| Class | Description |
|---|---|
| `thin-scroll` | 3px custom scrollbar (webkit only) |
| `msg-in` | `fade-in-up` animation on new messages |
| `shimmer-dot` | Pulsing typing indicator dots |
| `shimmer-line` | Pulsing skeleton loading lines |
| `conv-row` | Conversation list row — hover bg `rgba(255,255,255,0.04)` |
| `conv-row.active` | Active conversation — amber left border + amber tint bg |
| `cursor-blink` | Blinking cursor at end of streaming text |
| `prose` overrides | Tightened `p`, `ul`, `li` margins; code/pre styles |

**Highlighted card borders** (Pro plan, active conversation rename input):

```tsx
{/* Amber card highlight */}
<div className="card border-amber-500/35">
  <div className="absolute top-0 inset-x-0 h-px bg-shimmer-bar" />
</div>

{/* Rename input with amber bottom border */}
<input className="border-b border-accent" />
```

**Icon sizing** — always use the Lucide `size` prop, not `style={{ width, height }}`:

```tsx
<Plus size={14} />
<Search size={13} />
<Trash2 size={11} />
```

---

## Shared Components (page.tsx)

These are defined in `page.tsx` but should be extracted to `src/components/` when reused:

### `<Card>`

```tsx
<Card className="…extra classes…">…children…</Card>
```

Wraps `<div className="card shadow-[0_8px_40px_rgba(0,0,0,0.45)] {className}">`.

### `<CardHeader>`

```tsx
<CardHeader dot="#f59e0b" title="Document Summary" />
<CardHeader dot="rgba(255,255,255,0.35)" title="Less prominent" />
```

A mini header bar with a dot indicator and info icon. Used inside dashboard-style cards. The `dot` prop accepts any CSS color string — pass `T.accent` or a literal color. Defaults to amber (`#f59e0b`).

---

## Font

Inter via `next/font/google`, loaded in `layout.tsx`:

```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
```

Applied via `--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif` in `@theme`.

---

## VS Code

`/.vscode/settings.json` suppresses false Tailwind v4 lint errors:

```json
{
  "css.lint.unknownAtRules": "ignore",
  "css.validate": false
}
```
