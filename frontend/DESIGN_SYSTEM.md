# Paperwise design system

Paperwise uses a spacious editorial layout, warm amber accents, and one consistent theme across marketing, auth, and the workspace. Shared tokens and utilities live in `src/styles/globals.css`.

## Color and themes

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-bg` | `#ffffff` | `#191714` | Page background |
| `--color-card` | `#f8f6f2` | `#25211c` | Panels and sidebars |
| `--color-ink` | `#171717` | `#faf7f2` | Main text and primary buttons |
| `--color-accent` | `#b45309` | `#fbbf24` | Links, citations, focus, and emphasis |

Marketing visuals use warm paper surfaces, a restrained amber highlight, and document-inspired details. Product mockups use warm off-white surfaces and orange citations. Red and green remain reserved for error and success states.

The theme control offers System, Light, and Dark. System is the default and follows the device setting as it changes. An explicit choice persists in local storage. The root layout applies the resolved theme before hydration to avoid a flash of the wrong colors.

## Layout and type

- Marketing: `max-w-[1280px]` content, a compact fixed nav with links beside the wordmark, and generous whitespace. The landing page uses a split hero, a three-step document flow, and varied feature panels. Pricing uses a left-aligned introduction and a quiet plan comparison.
- Auth and onboarding: a centered form with a paper-colored editorial panel on wide screens. The panel uses a source citation example from the product; forms remain full width on mobile.
- Workspace: a warm neutral library sidebar and clean document canvas. The empty chat state mirrors the landing page's split composition and shows example questions plus a source preview.
- Typography: Space Grotesk for display headings and IBM Plex Sans for body text, loaded in the root layout.
- Controls: round buttons and inputs; restrained `rounded-md` cards, fine borders, and visible focus states.

Product examples are illustrative. Pricing copy should stay aligned with the limits in `backend/src/services/tier_service.py`.
