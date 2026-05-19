You are an expert Next.js + FastAPI engineer helping build a production-quality teaching project.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction. Every decision should be explainable to a developer learning the codebase.

Think like a senior full-stack engineer. Build like someone who will maintain this in six months.

---

## Project Overview

**Paperwise** — an AI document chat SaaS ("Chat with your documents. Instantly.")

Users can:
- Upload and manage documents (PDF, DOCX)
- Chat with documents via streaming AI responses (SSE)
- Manage conversation history
- Authenticate via email/password and Google OAuth
- Access billing and account settings

This is a resume-quality production project. It must feel like a real product and remain approachable enough to teach.

---

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Radix UI (Dialog, Dropdown, Tabs)
- React Hook Form + Zod
- Lucide React
- react-markdown + remark-gfm + rehype-highlight
- @microsoft/fetch-event-source (SSE)
- sonner (toasts)
- axios + js-cookie

**Backend:**
- FastAPI + Uvicorn
- SQLAlchemy + Alembic (PostgreSQL + pgvector)
- Pydantic Settings (env config)
- PyMuPDF + python-docx
- HuggingFace Inference
- python-jose + passlib (JWT)
- authlib + httpx (Google OAuth)
- boto3 (Supabase Storage / S3)
- slowapi (rate limiting)

Do not introduce new libraries without explaining the reason and asking first.

---

## Core Principles

These apply to every file, every feature, every change.

**1. Separation of concerns is non-negotiable.**
Each layer has one job. A route handler handles HTTP. A service handles business logic. A repository handles data. Nothing bleeds across boundaries.

**2. Dependency flows downward.**
`routes → services → repositories → models`
Services never import routes. Repositories never import services. Models know nothing about any layer above them.

**3. Types and schemas are contracts.**
They define the shape of data crossing layer boundaries. They are not optional. Every function that accepts or returns structured data must be typed.

**4. Server Components by default.**
In Next.js 15, all components are Server Components unless interaction requires otherwise. Add `"use client"` only at the boundary where user interaction or browser APIs begin — not at the top of a large tree.

**5. No secrets in the client.**
All AI calls, token generation, and third-party secrets live in the backend. The frontend only holds a JWT.

**6. Files that change together live together.**
Related components, hooks, and API calls are named and organized consistently so any developer can find what they need without a map.

---

## Backend Architecture

### Directory Structure

```
backend/src/
  core/
    config.py          ← Pydantic Settings — single source of truth for env vars
    security.py        ← JWT encoding/decoding, password hashing
    exceptions.py      ← Custom exception types (NotFoundError, UnauthorizedError, etc.)
    dependencies.py    ← FastAPI Depends() — db session, current_user, rate limiter
  database/
    engine.py          ← SQLAlchemy engine + session factory
    base.py            ← Declarative base
  models/              ← SQLAlchemy ORM models (shared across domains)
  domains/
    auth/
      router.py        ← FastAPI routes (HTTP only — no logic)
      service.py       ← Business logic
      schemas.py       ← Pydantic request + response models
    users/
      router.py
      service.py
      repository.py    ← All DB queries for this domain
      schemas.py
    documents/
      router.py
      service.py
      repository.py
      schemas.py
    conversations/
      router.py
      service.py
      repository.py
      schemas.py
  utils/               ← Truly shared helpers (file parsing, storage, embeddings)
  migrations/          ← Alembic migration files
  main.py              ← App factory + router registration
```

### Layer Rules

**`core/config.py`** — Pydantic `BaseSettings` class. Every environment variable is declared here with a type. Nothing in the app reads `os.environ` directly — everything imports from `core.config`.

**`core/dependencies.py`** — All `Depends()` functions live here: `get_db`, `get_current_user`, `require_admin`. Route handlers import from here and never manage sessions inline.

**`core/exceptions.py`** — Define typed exceptions (`NotFoundError`, `UnauthorizedError`, `ConflictError`). Register exception handlers in `main.py` that map these to consistent JSON error responses: `{ "error": "message", "code": "ERROR_CODE" }`. Route handlers never catch `Exception` broadly — the global handler does it.

**Route handlers** — Handle HTTP and nothing else: extract request data, call a service, return a response. No business logic. No DB queries. No `if/else` beyond input validation.

```python
# ✅ Correct
@router.post("/conversations/{id}/query")
async def query(
    id: UUID,
    body: QueryRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = await conversation_service.query(db, id, user.id, body.message)
    return StreamingResponse(result, media_type="text/event-stream")

# ❌ Wrong — business logic inside a route handler
@router.post("/conversations/{id}/query")
async def query(id: UUID, body: QueryRequest, db: Session = Depends(get_db)):
    conversation = db.query(Conversation).filter_by(id=id).first()
    if not conversation:
        raise HTTPException(404)
    chunks = embed_and_search(body.message)
    ...
```

**Services** — Own all business logic. Accept a `db` session and typed inputs. Never write SQLAlchemy queries directly — delegate to repositories. Never return ORM model instances — always convert to Pydantic response schemas before returning.

**Repositories** — All SQLAlchemy queries live here. One repository per domain. Each method does one focused DB operation. Returns ORM models internally. The service converts them to schemas — repositories do not know about schemas.

**Models** — SQLAlchemy ORM models only. No methods, no business logic, no Pydantic. A model is a table definition.

**Schemas** — Pydantic models for request/response. Use separate `CreateRequest`, `UpdateRequest`, and `Response` schemas. Never reuse the same schema for input and output. Never expose internal fields that shouldn't be public (hashed passwords, raw foreign keys, internal flags).

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
  app/                     ← Routing ONLY (Next.js App Router)
    (auth)/                ← Route group — unauthenticated pages
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx
    (app)/                 ← Route group — authenticated pages, shared layout
      layout.tsx           ← AppShell (sidebar, header)
      dashboard/page.tsx
      settings/
        profile/page.tsx
        billing/page.tsx
    (marketing)/           ← Route group — public pages
      page.tsx             ← Landing
      pricing/page.tsx
    layout.tsx             ← Root layout (fonts, providers)
    error.tsx
    not-found.tsx

  components/              ← All reusable UI components
    ui/                    ← Primitives: Button, Input, Modal, Spinner, Badge, Skeleton
    layout/                ← AppShell, Sidebar, Header, PageHeader
    auth/                  ← LoginForm, SignupForm, GoogleButton
    documents/             ← DocumentCard, UploadZone, LibrarySidebar, EmptyLibrary
    conversations/         ← MessageBubble, SourceCitation, ConversationItem, InputBar

  hooks/                   ← All custom React hooks
    useAuth.ts             ← Wraps AuthContext
    useLibrary.ts
    useUpload.ts
    useConversation.ts
    useSSEStream.ts
    useDebounce.ts

  lib/
    api-client.ts          ← Single typed fetch wrapper — base URL, auth header, error handling
    api/
      auth.ts              ← API calls for auth domain
      documents.ts         ← API calls for documents domain
      conversations.ts     ← API calls for conversations domain

  context/
    AuthContext.tsx        ← Global auth state — user, token, loading

  types/
    index.ts               ← All shared TypeScript types

  config/
    env.ts                 ← Client-side env validation (NEXT_PUBLIC_ vars)

  styles/
    globals.css
```

### Layer Rules

**`app/`** — routing only. Pages compose components and call hooks. A page file should be mostly layout and wiring. If it grows past ~80 lines of JSX, something should be extracted to `components/`.

**`components/`** — organized by domain subdirectory. `components/ui/` holds primitives that know nothing about the app — no API calls, no auth imports, generic props only. `components/auth/`, `components/documents/`, `components/conversations/` hold domain-specific UI. Components receive props and render — they do not call API functions directly.

**`hooks/`** — all custom hooks, named by what they do. A hook owns the stateful logic for a concern: loading state, error state, derived values, side effects. Components stay thin because hooks do the work. Hooks may call `lib/api/` functions.

**`lib/api-client.ts`** — single base client. Handles: base URL, attaching the auth token, parsing responses, and mapping HTTP errors to typed `ApiError` objects. Domain files in `lib/api/` import from it and expose typed functions. Components and hooks only ever import from `lib/api/` — never build their own fetch calls.

```typescript
// lib/api/conversations.ts — domain-specific API functions
import { apiClient } from "@/lib/api-client";
import type { Conversation } from "@/types";

export const conversationsApi = {
  list: () => apiClient.get<Conversation[]>("/conversations"),
  create: (title: string) => apiClient.post<Conversation>("/conversations", { title }),
  delete: (id: string) => apiClient.delete(`/conversations/${id}`),
};

// ❌ Wrong — raw fetch built inside a component or hook
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

**`context/`** — minimal. Only `AuthContext.tsx` for now. Do not add context unless the state is genuinely global and needed across unrelated parts of the tree. Prefer passing props or hooks for everything else.

**`types/index.ts`** — all shared TypeScript types in one file to start. Split by domain (`types/conversations.ts`, etc.) only when the file becomes unwieldy. Frontend types must stay in sync with the backend Pydantic response schemas — when a backend schema changes, update the corresponding frontend type.

---

## Styling Rules

Use Tailwind CSS v4 exclusively. Do not use inline `style={{}}` unless a value is computed at runtime and cannot be expressed as a Tailwind class.

Design system:
- **Background:** white / near-white
- **Accents:** amber only — no purple
- **Borders:** subtle — `border-neutral-200` on light surfaces, `border-white/10` on dark
- **Typography:** clear hierarchy — one weight jump per heading level
- **Radius:** consistent — `rounded-lg` for cards, `rounded-md` for inputs and buttons

When a design reference is provided, match it exactly — layout, spacing, color, font size, proportions. Do not approximate. Do not simplify unless explicitly asked.

Extract repeated Tailwind class clusters into `@layer utilities` in `globals.css` when the same combination appears in three or more places. Use BEM-style naming for utilities.

---

## "use client" Rules

Server Components are the default in Next.js 15. A component should only become a Client Component if it actually needs:
- `useState` or `useReducer`
- `useEffect`
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Third-party hooks that depend on the above

Place `"use client"` as deep in the component tree as possible — not at the page level, not at a layout level. If only one part of a page needs interactivity, extract that part into its own Client Component and keep the page itself a Server Component.

```tsx
// ✅ Correct — page stays a Server Component, only the interactive widget is a Client Component
// app/(app)/dashboard/page.tsx
import { ConversationInput } from "@/components/conversations/ConversationInput"; // "use client" inside

export default async function DashboardPage() {
  return (
    <main>
      <ConversationInput />
    </main>
  );
}

// ❌ Wrong — entire page becomes a Client Component because of one useState
"use client";
export default function DashboardPage() {
  const [value, setValue] = useState("");
  ...
}
```

---

## TypeScript Rules

- Strict mode. No `any`. No `// @ts-ignore` without a comment explaining the specific reason.
- All shared types live in `types/index.ts`.
- Every function that crosses a layer boundary is typed — inputs and outputs.
- Use Zod for all form validation schemas, paired with React Hook Form. Keep the Zod schema co-located with the form component that uses it.
- Frontend types must match backend Pydantic response schemas. When a backend schema changes, update the frontend type.

---

## Error Handling

**Backend:**
- Typed exceptions defined in `core/exceptions.py`
- Global exception handlers in `main.py` return consistent JSON: `{ "error": "Human-readable message", "code": "SNAKE_CASE_CODE" }`
- Route handlers do not `try/except Exception` — the global handler catches what services don't explicitly handle
- Never return a raw `500` with a stack trace in production

**Frontend:**
- `lib/api-client.ts` maps HTTP error responses to typed `ApiError` objects — hooks receive structured errors, not raw exceptions
- Hooks return `{ data, error, loading }` — never silently swallow errors
- User-visible errors use `sonner` toasts
- Page-level failures use `error.tsx` boundaries
- Form errors surface through React Hook Form's field-level error state

---

## Auth Rules

- JWT stored in a cookie, managed by `js-cookie` on the client
- `AuthContext.tsx` provides `user`, `loading`, and `logout` to client components
- `middleware.ts` protects authenticated routes — reads the cookie and redirects unauthenticated requests before the page renders
- The API client reads the token once from the cookie and attaches it as a Bearer header — tokens are never passed as component props
- Do not build a parallel auth system — extend the existing one

---

## SSE / Streaming Rules

- AI responses stream over SSE from the backend via `@microsoft/fetch-event-source`
- All SSE logic lives in `hooks/useSSEStream.ts` — not inline in a component
- The hook exposes `{ content, sources, isStreaming, error, send }`
- The component that consumes the stream is a Client Component
- The backend SSE endpoint lives at `/api/v1/conversations/{id}/query`

---

## Feature Implementation Process

When building any feature:

1. Read this file
2. Identify which layers are affected — route, service, repository, component, hook
3. Define the data contract first — backend Pydantic schemas and frontend TypeScript types before writing logic
4. Build downward on the backend: `schema → repository → service → route`
5. Build inward on the frontend: `types → lib/api/ function → hook → component → page`
6. Ensure the feature works end-to-end before closing
7. Run `npm run lint`, `npm run typecheck`, and `ruff check .` — fix all errors

---

## Component Creation Rule

Before creating a new component, ask:
- Is this used in more than one place? If no — keep it inline for now.
- Does extracting it make the parent meaningfully easier to read? If no — keep it inline.
- Is it a clear UI concept with a stable boundary? (`DocumentCard`, `MessageBubble`, `SourceCitation`) — then extract it.

Never create a component just to give a piece of markup a name.

---

## What Not To Do

- Do not put business logic in route handlers
- Do not put DB queries in services
- Do not return ORM model instances from services or repositories
- Do not make API calls inside `components/ui/` primitives
- Do not add `"use client"` to an entire page because one button needs `onClick`
- Do not build separate fetch logic in components — use `lib/api/`
- Do not read `os.environ` directly in the backend — use `core.config`
- Do not expose internal fields (hashed passwords, raw foreign keys, internal flags) in API responses
- Do not create a second API client file — there is one base client in `lib/api-client.ts`

---

## Dev Environment

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:8000`
- Backend API docs: `http://localhost:8000/docs`

---

## Final Reminder

Before every feature:
- Read this file
- Follow the layer rules strictly
- Define types and contracts first, then implement
- Build the smallest working version
- Clean code over clever code
