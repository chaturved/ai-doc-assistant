"use client";

import { Upload, Plus, HelpCircle } from "lucide-react";

export interface Action {
  visible?: boolean;
  onClick?: () => void;
}

export type ActionType = "help" | "upload" | "newSearch";

export type ActionsProps = {
  [key in ActionType]?: Action;
};

export default function Actions({
  help = { visible: false },
  upload = { visible: false },
  newSearch = { visible: false },
}: ActionsProps) {
  return (
    <div className="hidden md:flex items-center gap-2">
      {help.visible && (
        <button
          onClick={help.onClick}
          className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" /> Need Help?
        </button>
      )}
      {upload.visible && (
        <button
          onClick={upload.onClick}
          className="h-9 rounded-md px-3 text-sm text-zinc-100 bg-indigo-600/90 hover:bg-indigo-500 transition inline-flex items-center gap-2"
        >
          <Upload className="h-4 w-4" /> Upload Docs
        </button>
      )}
      {newSearch.visible && (
        <button
          onClick={newSearch.onClick}
          className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Search
        </button>
      )}
    </div>
  );
}
