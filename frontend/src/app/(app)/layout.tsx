"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AppSidebar from "@/components/app-sidebar";
import { AppLayoutProvider, useAppLayout } from "@/context/AppLayoutContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCallbacks } = useAppLayout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex h-dvh min-w-0 flex-col bg-bg text-ink md:flex-row md:gap-3 md:p-3">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink/10 px-4 md:hidden">
        <span className="text-sm font-semibold tracking-tight">paperwise<span className="text-accent">.</span></span>
        <div className="flex items-center gap-2"><ThemeToggle /><button type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink/15"><Menu size={18} /></button></div>
      </div>
      {mobileMenuOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-50 w-[290px] transition-transform duration-200 md:static md:z-auto md:w-auto md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-ink/60 md:hidden"><X size={18} /></button>
        <AppSidebar {...sidebarCallbacks} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 p-2 md:p-0">{children}</div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayoutProvider>
      <AppShell>{children}</AppShell>
    </AppLayoutProvider>
  );
}
