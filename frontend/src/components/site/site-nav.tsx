"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Product", href: "/#technology" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

interface SiteNavProps {
  showLogin?: boolean;
}

export function SiteNav({ showLogin = true }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const firstName = user?.full_name.trim().split(/\s+/)[0] || "Account";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-bg/95 text-ink backdrop-blur-xl">
      <nav aria-label="Main navigation" className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="font-display text-xl font-medium tracking-[-0.05em]">paperwise<span className="text-accent">.</span></Link>
        <div className="ml-7 hidden items-center gap-1 md:flex lg:ml-12">
          {links.map((link) => <Link key={link.label} href={link.href} className="rounded-sm px-3 py-2 text-[13px] font-medium text-ink/70 transition hover:text-accent">{link.label}</Link>)}
        </div>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {loading ? <span className="h-5 w-16 animate-pulse rounded-full bg-ink/10" aria-label="Checking account status" role="status" /> : user ? (
            <Link href="/settings/profile" className="max-w-36 truncate px-2 text-[13px] font-medium text-ink/75 hover:text-ink">Hi, {firstName}</Link>
          ) : showLogin ? <Link href="/login" className="px-2 text-[13px] font-medium text-ink/75 hover:text-ink">Log in</Link> : null}
          {loading ? <span className="h-9 w-32 animate-pulse rounded-full bg-ink/10" aria-hidden="true" /> : (
            <Link href={user ? "/dashboard" : "/signup"} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-bg transition hover:opacity-80">{user ? "Open workspace" : "Get started"} <ArrowUpRight size={14} /></Link>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 md:hidden"><ThemeToggle /><button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-sm border border-ink/15">{open ? <X size={20} /> : <Menu size={20} />}</button></div>
      </nav>
      {open && <div className="border-t border-ink/10 bg-bg px-5 py-3 md:hidden"><div className="mx-auto flex max-w-[1280px] flex-col">{links.map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-ink/5">{link.label}</Link>)}{!loading && user && <Link href="/settings/profile" onClick={() => setOpen(false)} className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-ink/5">Profile</Link>}{!loading && !user && showLogin && <Link href="/login" onClick={() => setOpen(false)} className="rounded-sm px-3 py-3 text-sm font-medium hover:bg-ink/5">Log in</Link>}{!loading && <Link href={user ? "/dashboard" : "/signup"} onClick={() => setOpen(false)} className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-bg">{user ? "Open workspace" : "Get started"}</Link>}</div></div>}
    </header>
  );
}
