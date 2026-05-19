"use client";

import { useLibrary } from "@/hooks/useLibrary";
import type { LibraryDoc } from "@/types";
import type { LibrarySectionProps } from "./components/LibraryTabs/LibrarySection/LibrarySection";
import LibraryHeader from "./components/LibraryHeader/LibraryHeader";
import LibraryTabs from "./components/LibraryTabs/LibraryTabs";
import LibrarySidebarSkeleton from "./LibrarySidebarSkeleton";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function groupDocs(docs: LibraryDoc[]): LibrarySectionProps[] {
  const groups: Record<string, LibrarySectionProps> = {};
  for (const doc of docs) {
    const type = doc.type.toLowerCase();
    const icon = type === "pdf" ? "pdf" : type === "md" ? "md" : type === "csv" || type === "xlsx" ? "data" : "folder";
    const key = icon;
    if (!groups[key]) {
      groups[key] = { title: type.toUpperCase(), icon, items: [] };
    }
    groups[key].items.push({ name: doc.name, size: formatBytes(doc.size) });
  }
  return Object.values(groups);
}

export default function LibrarySidebar() {
  const { data, loading, upload, clear } = useLibrary();

  const handleUpload = async (files: FileList) => {
    await upload(Array.from(files));
  };

  if (loading || !data) return <LibrarySidebarSkeleton />;

  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeader
          count={data.count}
          onUpload={handleUpload}
          onClear={clear}
        />
        <LibraryTabs sections={groupDocs(data.sections)} />
      </div>
    </aside>
  );
}
