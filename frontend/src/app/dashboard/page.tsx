"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import Workspace from "@/components/Workspace/Workspace";
import LibrarySidebar from "@/components/LibrarySidebar/LibrarySidebar";
import InsightsSidebar from "@/components/InsightsSidebar/InsightsSidebar";
import { useState, useRef } from "react";

export default function DashboardPage() {
  const [insightsWidth, setInsightsWidth] = useState(300);
  const [libraryWidth, setLibraryWidth] = useState(280);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(true);

  const prevInsightsWidth = useRef(insightsWidth);
  const prevLibraryWidth = useRef(libraryWidth);

  const toggleInsights = () => {
    if (insightsCollapsed) {
      setInsightsWidth(prevInsightsWidth.current);
      setInsightsCollapsed(false);
    } else {
      prevInsightsWidth.current = insightsWidth;
      setInsightsWidth(0);
      setInsightsCollapsed(true);
    }
  };

  const toggleLibrary = () => {
    if (libraryCollapsed) {
      setLibraryWidth(prevLibraryWidth.current);
      setLibraryCollapsed(false);
    } else {
      prevLibraryWidth.current = libraryWidth;
      setLibraryWidth(0);
      setLibraryCollapsed(true);
    }
  };

  return (
    <>
      <Header
        showStatus
        actions={{ upload: { visible: true }, newSearch: { visible: true } }}
        showUserDropdown
      />

      <div className="flex gap-6 relative py-6 md:py-10 px-4 sm:px-6">
        <div
          className="hidden xl:block relative transition-[width] duration-200 ease-in-out"
          style={{ width: insightsCollapsed ? 0 : insightsWidth }}
        >
          {!insightsCollapsed && <InsightsSidebar />}
        </div>

        <div
          onClick={toggleInsights}
          className="hidden xl:flex items-center justify-center w-2 hover:w-3 bg-zinc-800 hover:bg-zinc-700 rounded cursor-pointer transition-all relative flex-shrink-0"
        >
          <span className="text-zinc-400 text-xs transition-opacity">
            {insightsCollapsed ? "›" : "‹"}
          </span>
        </div>

        <main className="flex-1 min-w-0">
          <Workspace />
        </main>

        <div
          onClick={toggleLibrary}
          className="hidden lg:flex items-center justify-center w-2 hover:w-3 bg-zinc-800 hover:bg-zinc-700 rounded cursor-pointer transition-all relative flex-shrink-0"
        >
          <span className="text-zinc-400 text-xs transition-opacity">
            {libraryCollapsed ? "‹" : "›"}
          </span>
        </div>

        <div
          className="hidden lg:block relative transition-[width] duration-200 ease-in-out"
          style={{ width: libraryCollapsed ? 0 : libraryWidth }}
        >
          {!libraryCollapsed && <LibrarySidebar />}
        </div>
      </div>

      <Footer />
    </>
  );
}
