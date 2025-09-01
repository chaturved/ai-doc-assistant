"use client";

import { useState, useEffect } from "react";
import { LibraryAPIResponse } from "@/types/library";
import LibraryHeader from "./components/LibraryHeader";
import LibraryTabs from "./components/LibraryTabs/LibraryTabs";

export default function SidebarLeft() {
  const [library, setLibrary] = useState<LibraryAPIResponse | null>(null);

  const fetchLibrary = async () => {
    const res = await fetch("/api/library");
    const data = await res.json();
    setLibrary(data);
  };

  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    await fetch("/api/library/upload", { method: "POST", body: formData });
    await fetchLibrary();
  };

  const handleClear = async () => {
    await fetch("/api/library/clear", { method: "POST" });
    await fetchLibrary();
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  if (!library) return null;

  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeader
          count={library.count}
          onUpload={handleUpload}
          onClear={handleClear}
        />
        <LibraryTabs sections={library.sections} />
      </div>
    </aside>
  );
}
