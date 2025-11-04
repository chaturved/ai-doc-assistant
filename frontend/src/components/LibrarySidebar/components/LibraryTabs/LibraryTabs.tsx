import { FolderX } from "lucide-react";
import {
  LibrarySection,
  LibrarySectionProps,
} from "./LibrarySection/LibrarySection";

export interface LibraryTabsProps {
  sections: LibrarySectionProps[];
}

export default function LibraryTabs({ sections }: LibraryTabsProps) {
  if (sections.length === 0) {
    return (
      <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md flex flex-col items-center justify-center text-center gap-2">
        <FolderX className="h-8 w-8 text-zinc-600" />
        <div className="text-sm font-medium text-zinc-200">
          No documents available
        </div>
        <div className="text-xs text-zinc-500">
          Upload new documents to see them here.
        </div>
      </div>
    );
  }

  return (
    <nav className="ring-1 ring-white/10 divide-y divide-white/5 bg-zinc-950/40 rounded-xl backdrop-blur-md">
      {sections.map((section, idx) => (
        <LibrarySection key={idx} {...section} />
      ))}
    </nav>
  );
}
