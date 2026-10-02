# Paperwise design system

Paperwise uses a spacious editorial layout, warm amber accents, and one consistent theme across marketing, auth, and the workspace. Shared tokens and utilities live in `src/styles/globals.css`.

## Color and themes

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-bg` | `#ffffff` | `#0f0f0f` | Page background |
| `--color-card` | `#f7f7f5` | `#1b1b1b` | Panels and cards |
| `--color-ink` | `#171717` | `#f5f5f4` | Main text and primary buttons |
| `--color-accent` | `#b45309` | `#fbbf24` | Links, citations, focus, and emphasis |
| `--color-workspace` | `#ffffff` | `#0f0f0f` | Authenticated content canvas |
| `--color-rail` | `#f7f7f5` | `#171717` | Authenticated navigation rail |
| `--color-composer` | `#f3f3f1` | `#252525` | Chat input surface |

All routes use the same neutral canvas and restrained amber accent. Marketing can use larger editorial type and document-inspired details, while product pages favor compact type and flat surfaces. Red and green remain reserved for error and success states.

The theme control offers System, Light, and Dark. System is the default and follows the device setting as it changes. An explicit choice persists in local storage. The root layout applies the resolved theme before hydration to avoid a flash of the wrong colors.

## Layout and type

- Marketing: `max-w-[1280px]` content, a compact fixed nav with links beside the wordmark, and generous whitespace. The landing page uses a split hero, a three-step document flow, and varied feature panels. Pricing uses a left-aligned introduction and a quiet plan comparison.
- Auth and onboarding: a flat form beside a neutral product-introduction panel on wide screens; forms remain full width on mobile.
- Workspace: a quiet full-height chat canvas with a narrow navigation rail, recent conversations, an expandable document library, and a centered composer. The account menu sits at the bottom of the rail. Settings use a dedicated rail with a clear route back to chat.
- Analytics: a dedicated usage rail and wide report canvas. The activity chart supports seven and thirty days; citations and answer feedback use the same restrained bordered sections.
- Typography: Space Grotesk for the wordmark and editorial marketing headings; IBM Plex Sans for product and form headings, body text, and controls.
- Controls: round buttons and inputs; restrained `rounded-md` cards, fine borders, and visible focus states.

Product examples are illustrative. Pricing copy should stay aligned with the limits in `backend/src/services/tier_service.py`.
