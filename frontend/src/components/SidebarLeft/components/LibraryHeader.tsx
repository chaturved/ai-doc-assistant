import { FilePlus, Folder, Trash2 } from "lucide-react";

export interface LibraryHeaderProps {
  count: number;
  onUpload?: () => void;
  onClear?: () => void;
}

export default function LibraryHeader({
  count,
  onUpload,
  onClear,
}: LibraryHeaderProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-3 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-zinc-200 tracking-tight">
            Library
          </div>
          <div className="text-xs text-zinc-500">Your uploaded documents</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900/60 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10">
          <Folder className="h-3.5 w-3.5 text-zinc-400" />
          <span id="library-count">{count}</span>
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onUpload}
          className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center justify-center gap-2"
        >
          <FilePlus className="h-3.5 w-3.5" />
          Upload New Document
        </button>
        <button
          onClick={onClear}
          className="flex-1 rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-rose-500/40 transition inline-flex items-center justify-center gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Library
        </button>
      </div>
    </div>
  );
}
