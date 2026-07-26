# Settings UI Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Settings pages (Profile, Password, Billing) to use a full-width glass card over the dashboard gradient, with a Claude-style settings nav inside the card.

**Architecture:** The settings layout becomes a full-bleed glass overlay (`rgba(17,17,19,0.55)` + `backdrop-blur-2xl`) over the existing `bg-hero-gradient` + `bg-amber-glow` background. The settings nav sits inside the card on the left; content is offset right with `max-w-[520px]`. Page components (Profile, Password, Billing) are restyled — no API or routing changes.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, React Hook Form, Zod, Lucide icons.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `frontend/src/app/(app)/settings/layout.tsx` | Modify | Full glass card, nav inside, padding offsets |
| `frontend/src/components/auth/profile-form.tsx` | Modify | Avatar size/glow, glass inputs, white save btn, polished danger zone |
| `frontend/src/app/(app)/settings/password/page.tsx` | Modify | Glass inputs, white save btn, strength bar |
| `frontend/src/app/(app)/settings/billing/page.tsx` | Modify | Plan comparison cards, Free vs Pro layout, Coming Soon btn |

---

## Task 1: Settings Layout — Glass Card Shell

**Files:**
- Modify: `frontend/src/app/(app)/settings/layout.tsx`

The current layout has a centered `max-w-3xl` wrapper. Replace it with a full-bleed glass card that covers the entire main area. The settings nav moves inside the card.

- [ ] **Step 1: Replace layout.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Profile",  href: "/settings/profile" },
  { label: "Password", href: "/settings/password" },
  { label: "Billing",  href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden relative">
      {/* Gradient background — same as dashboard */}
      <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" style={{ filter: "blur(72px)" }} />
      <div className="absolute inset-0 bg-amber-glow pointer-events-none" />

      {/* Full-bleed glass card */}
      <div
        className="absolute inset-0 flex overflow-hidden"
        style={{ background: "rgba(17,17,19,0.55)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        {/* Settings nav — inside the card */}
        <nav className="w-[200px] flex-shrink-0 pt-10 pl-16 pr-4">
          <p className="text-[13px] font-semibold text-white/85 mb-4">Settings</p>
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition ${
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto thin-scroll py-10 pr-10 pl-16">
          <div className="max-w-[520px]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3001/settings/profile`. You should see:
- Gradient glow (amber/purple) visible behind the card
- Dark semi-transparent glass card fills the whole main area
- "Settings" heading + nav on the left (~200px)
- Content area offset to the right

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(app\)/settings/layout.tsx
git commit -m "Redesign — settings layout as full-bleed glass card with inline nav"
```

---

## Task 2: Profile Form — Avatar, Inputs, Buttons, Danger Zone

**Files:**
- Modify: `frontend/src/components/auth/profile-form.tsx`

- [ ] **Step 1: Replace profile-form.tsx**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount, updateProfile } from "@/lib/api/users";
import { useRouter } from "next/navigation";

const schema = z.object({ full_name: z.string().min(2, "Name must be at least 2 characters") });
type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: user?.full_name || "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data.full_name);
      await refetchUser();
      toast.success("Profile updated");
    } catch { toast.error("Failed to update profile"); }
  };

  const handleDelete = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      await refetchUser();
      router.push("/login");
    } catch { toast.error("Failed to delete account"); setDeleting(false); }
  };

  return (
    <div>
      <h1 className="text-[22px] font-bold text-white mb-8">Profile</h1>

      {/* Avatar */}
      <div className="mb-8">
        <p className="text-[12px] font-medium text-white/40 mb-3">Avatar</p>
        <div
          className="logo-grad h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl"
          style={{ boxShadow: "0 0 0 3px rgba(245,158,11,0.25), 0 4px 20px rgba(245,158,11,0.25)" }}
        >
          {user?.avatar_initials || "??"}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Full name</label>
          <input
            {...register("full_name")}
            className="w-full px-4 py-3 rounded-[10px] text-[14px] text-white outline-none transition"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-2">Email</label>
          <div className="flex items-center gap-3">
            <input
              value={user?.email || ""}
              readOnly
              className="flex-1 px-4 py-3 rounded-[10px] text-[14px] cursor-not-allowed outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.28)" }}
            />
            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-md whitespace-nowrap"
              style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
              Verified
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-[10px] text-[14px] font-bold bg-white text-black disabled:opacity-50 transition hover:opacity-90"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-[16px] font-bold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
          Deleting your account permanently removes all your documents, conversations, and data.
        </p>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-red-400 transition"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-white/40">
              Type <span className="font-mono text-white">DELETE</span> to confirm.
            </p>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full h-10 rounded-[10px] px-4 text-sm text-white outline-none transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.25)" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="h-9 px-4 rounded-lg text-sm text-white/50 hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== "DELETE" || deleting}
                className="h-9 px-4 rounded-lg text-sm text-white bg-red-600 disabled:opacity-40 transition"
              >
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3001/settings/profile`. Check:
- Avatar is 64px with amber ring glow
- Inputs have glass style (semi-transparent, rounded)
- Save button is white with black text
- Danger Zone sits below an `hr`-style divider

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/auth/profile-form.tsx
git commit -m "Redesign — profile form with glass inputs, avatar glow, white save btn"
```

---

## Task 3: Password Page — Glass Inputs + White Button

**Files:**
- Modify: `frontend/src/app/(app)/settings/password/page.tsx`

- [ ] **Step 1: Replace password/page.tsx**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/lib/api/users";

const schema = z.object({
  current_password: z.string().min(1, "Required"),
  new_password: z.string().min(8, "At least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.new_password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
};

export default function PasswordPage() {
  const [show, setShow] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const pw = watch("new_password", "");
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length;
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"];

  const onSubmit = async (data: FormData) => {
    try {
      await changePassword(data.current_password, data.new_password);
      toast.success("Password updated");
      reset();
    } catch { toast.error("Current password is incorrect"); }
  };

  const fields: { id: keyof FormData; label: string }[] = [
    { id: "current_password", label: "Current password" },
    { id: "new_password",     label: "New password" },
    { id: "confirm",          label: "Confirm new password" },
  ];

  return (
    <div>
      <h1 className="text-[22px] font-bold text-white mb-8">Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map((f) => (
          <div key={f.id}>
            <label className="block text-[12px] font-medium text-white/40 mb-2">{f.label}</label>
            <div className="relative">
              <input
                {...register(f.id)}
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-[10px] text-[14px] text-white outline-none transition pr-11"
                style={inputStyle}
              />
              {f.id === "current_password" && (
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
            {errors[f.id] && <p className="mt-1.5 text-xs text-red-400">{errors[f.id]?.message}</p>}
            {f.id === "new_password" && pw && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-[3px] flex-1 rounded-full transition-all ${i <= score ? strengthColors[score] : "bg-white/[0.08]"}`} />
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-[10px] text-[14px] font-bold bg-white text-black disabled:opacity-50 transition hover:opacity-90"
        >
          {isSubmitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3001/settings/password`. Check:
- All three inputs have glass style matching profile page
- Eye toggle works on current password field
- Strength bar appears when typing new password
- Save button is white with black text

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(app\)/settings/password/page.tsx
git commit -m "Redesign — password page with glass inputs and white update button"
```

---

## Task 4: Billing Page — Plan Comparison Cards + Coming Soon

**Files:**
- Modify: `frontend/src/app/(app)/settings/billing/page.tsx`

- [ ] **Step 1: Replace billing/page.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { getUsage } from "@/lib/api/users";
import { useAuth } from "@/context/AuthContext";
import type { Usage } from "@/types";

function UsageBar({ used, limit, label }: { used: number; limit: number | null; label: string }) {
  if (limit === null) return null;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor = pct > 85 ? "#ef4444" : "#f59e0b";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">{label}</span>
        <span className="text-white/25">{used} of {limit}</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function formatStorage(bytes: number, limitBytes: number | null): string {
  if (limitBytes === null) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} of ${(limitBytes / (1024 * 1024)).toFixed(0)} MB`;
}

const PRO_FEATURES = [
  "Unlimited documents",
  "Unlimited queries",
  "50 MB per file",
  "DOCX support",
  "Conversation history forever",
  "Priority support",
];

const FREE_FEATURES = [
  "5 documents",
  "20 queries / day",
  "10 MB storage",
  "PDF support",
];

export default function BillingPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    getUsage().then(setUsage).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-[22px] font-bold text-white mb-8">Plan & Billing</h1>

      {/* Usage */}
      {usage && (
        <div className="mb-10">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Usage this month</p>
          <div className="space-y-4">
            <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
            <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Storage</span>
                <span className="text-white/25">{formatStorage(usage.storage_bytes.used, usage.storage_bytes.limit)}</span>
              </div>
              {usage.storage_bytes.limit && (
                <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (usage.storage_bytes.used / usage.storage_bytes.limit) * 100)}%`,
                      background: (usage.storage_bytes.used / usage.storage_bytes.limit) > 0.85 ? "#ef4444" : "#f59e0b",
                    }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Plans</p>
      <div className="flex gap-4">

        {/* Free plan */}
        <div
          className="flex-1 rounded-[14px] p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: user?.plan === "free" ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-white">Free</span>
            {user?.plan === "free" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                Current
              </span>
            )}
          </div>
          <p className="text-[22px] font-bold text-white mb-4">$0<span className="text-[13px] font-normal text-white/30">/mo</span></p>
          <ul className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-white/50">
                <span className="text-white/25">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro plan */}
        <div
          className="flex-1 rounded-[14px] p-5"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-white">Pro</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
              Coming soon
            </span>
          </div>
          <p className="text-[22px] font-bold text-white mb-4">$12<span className="text-[13px] font-normal text-white/30">/mo</span></p>
          <ul className="space-y-2 mb-5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-white/70">
                <span className="text-emerald-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            disabled
            className="w-full py-2.5 rounded-[10px] text-[13px] font-bold text-white/30 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Coming Soon
          </button>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3001/settings/billing`. Check:
- Usage bars display correctly
- Two plan cards side by side (Free with amber border if current plan, Pro with amber tint)
- "Current" badge on Free card for free users
- Pro card has feature list with emerald checkmarks
- "Coming Soon" button is disabled and visually muted

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\(app\)/settings/billing/page.tsx
git commit -m "Redesign — billing page with plan comparison cards and coming soon Pro"
```

---

## Self-Review Notes

- All API calls unchanged: `updateProfile`, `changePassword`, `getUsage`, `deleteAccount`
- Routing unchanged: `/settings/profile`, `/settings/password`, `/settings/billing`
- `Usage` type from `@/types` — `limit` can be `number | null` for Pro plan; `UsageBar` handles null with early return
- `user?.plan` used on billing page — comes from `useAuth()` context, already available
- No new dependencies required
- `logo-grad` class retained on avatar — defined in globals.css
- `thin-scroll` class retained on content scroll area — defined in globals.css
