import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function Feedback() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-zinc-200">
          Was this answer helpful?
        </div>
        <div className="text-xs text-zinc-500">
          Your feedback improves responses and retrieval.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:ring-emerald-400/40 transition inline-flex items-center gap-2">
          <ThumbsUp className="h-4 w-4" /> Yes
        </button>
        <button className="rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:ring-rose-400/40 transition inline-flex items-center gap-2">
          <ThumbsDown className="h-4 w-4" /> No
        </button>
      </div>
    </div>
  );
}
