"use client";

import { createContext, useContext, useState } from "react";

interface SidebarCallbacks {
  activeConvId?: number | null;
  onConvSelect?: (id: number) => void;
  onConvDelete?: (id: number) => void;
  onNewChat?: () => void;
  refreshKey?: number;
}

interface AppLayoutContextValue {
  sidebarCallbacks: SidebarCallbacks;
  setSidebarCallbacks: (cb: SidebarCallbacks) => void;
}

const AppLayoutContext = createContext<AppLayoutContextValue>({
  sidebarCallbacks: {},
  setSidebarCallbacks: () => {},
});

export function useAppLayout() {
  return useContext(AppLayoutContext);
}

export function AppLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCallbacks, setSidebarCallbacks] = useState<SidebarCallbacks>({});
  return (
    <AppLayoutContext.Provider value={{ sidebarCallbacks, setSidebarCallbacks }}>
      {children}
    </AppLayoutContext.Provider>
  );
}
