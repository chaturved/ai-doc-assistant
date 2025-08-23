"use client";

import LibraryHeader from "./components/LibraryHeader";
import LibraryTabs from "./components/LibraryTabs/LibraryTabs";

export default function SidebarLeft() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeader />
        <LibraryTabs />
      </div>
    </aside>
  );
}
