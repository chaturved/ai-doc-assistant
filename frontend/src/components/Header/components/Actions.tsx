import { Upload, Plus } from "lucide-react";

interface ActionsProps {
  onUpload?: () => void;
  onNewSearch?: () => void;
}

export default function Actions({ onUpload, onNewSearch }: ActionsProps) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <button
        onClick={onUpload}
        className="h-9 rounded-md px-3 text-sm text-zinc-100 bg-indigo-600/90 hover:bg-indigo-500 transition inline-flex items-center gap-2"
      >
        <Upload className="h-4 w-4" /> Upload Docs
      </button>
      <button
        onClick={onNewSearch}
        className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> New Search
      </button>
    </div>
  );
}
