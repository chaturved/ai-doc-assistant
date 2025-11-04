"use client";

import { useState, useEffect } from "react";
import { LibraryAPIResponse } from "@/types/library";
import LibraryHeader from "./components/LibraryHeader/LibraryHeader";
import LibraryTabs from "./components/LibraryTabs/LibraryTabs";
import LibrarySidebarSkeleton from "./LibrarySidebarSkeleton";
import api from "@/lib/api";

export default function LibrarySidebar() {
  const [library, setLibrary] = useState<LibraryAPIResponse | null>(null);

  const fetchLibrary = async () => {
    const response = await api.get("/v1/library");
    setLibrary(response.data);
  };

  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    await api.post("/v1/library/upload", formData);
    await fetchLibrary();
  };

  const handleClear = async () => {
    await api.delete("/v1/library/clear");
    await fetchLibrary();
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  if (!library) return <LibrarySidebarSkeleton />;

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
