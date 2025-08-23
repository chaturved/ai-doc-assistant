import { FileCode, FileText, Folder, Table } from "lucide-react";
import LibrarySection from "./LibrarySection";

export default function LibraryTabs() {
  return (
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
  );
}
