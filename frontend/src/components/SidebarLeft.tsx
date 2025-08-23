"use client";

import {
  FileText,
  FileCode,
  Table,
  Folder,
  FilePlus,
  Trash2,
} from "lucide-react";

export default function SidebarLeft() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        {/* Library Header */}
        <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-200 tracking-tight">
                Library
              </div>
              <div className="text-xs text-zinc-500">
                Your uploaded documents
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900/60 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10">
              <Folder className="h-3.5 w-3.5 text-zinc-400" />
              <span id="library-count">12</span>
            </span>
          </div>

          {/* Upload / Clear */}
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center justify-center gap-2">
              <FilePlus className="h-3.5 w-3.5" />
              Upload New Document
            </button>
            <button className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-rose-500/40 transition inline-flex items-center justify-center gap-2">
              <Trash2 className="h-3.5 w-3.5" />
              Clear Library
            </button>
            <input id="fileInput" type="file" multiple className="hidden" />
          </div>
        </div>

        {/* Library Tabs */}
        <nav className="ring-1 ring-white/10 divide-y divide-white/5 bg-zinc-950/40 rounded-xl backdrop-blur-md">
          {/* PDFs */}
          <LibrarySection
            title="PDFs"
            icon={<FileText className="h-4 w-4 text-rose-300" />}
            items={[
              { name: "Product Handbook.pdf", size: "1.2 MB" },
              { name: "Onboarding Guide.pdf", size: "860 KB" },
            ]}
          />

          {/* Markdown */}
          <LibrarySection
            title="Markdown"
            icon={<FileCode className="h-4 w-4 text-indigo-300" />}
            items={[
              { name: "api-reference.md", size: "24 KB" },
              { name: "rate-limits.md", size: "11 KB" },
            ]}
          />

          {/* Data */}
          <LibrarySection
            title="Data"
            icon={<Table className="h-4 w-4 text-emerald-300" />}
            items={[{ name: "endpoints.csv", size: "6 KB" }]}
          />

          {/* Folders */}
          <LibrarySection
            title="Folders"
            icon={<Folder className="h-4 w-4 text-zinc-400" />}
            items={[
              { name: "Guides/", size: "7 files" },
              { name: "SDKs/", size: "4 files" },
            ]}
          />
        </nav>
      </div>
    </aside>
  );
}

function LibrarySection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { name: string; size: string }[];
}) {
  return (
    <div className="p-3">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <a
            key={idx}
            className="group flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              {icon} {item.name}
            </span>
            <span className="text-[10px] text-zinc-500">{item.size}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
