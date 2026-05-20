"use client";

import AppSidebar from "@/components/AppSidebar";
import { AppLayoutProvider, useAppLayout } from "@/context/AppLayoutContext";

function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCallbacks } = useAppLayout();
  return (
    <div className="flex h-screen text-white p-2.5 gap-2.5 bg-bg">
      <AppSidebar {...sidebarCallbacks} />
      {children}
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
