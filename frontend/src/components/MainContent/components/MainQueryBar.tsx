import { Filter, Search, Send, Sparkles } from "lucide-react";

export default function MainQueryBar() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl backdrop-blur-md p-3 md:p-4">
      <div className="flex items-start gap-3">
        <div className="hidden sm:flex">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 ring-1 ring-white/10 grid place-items-center">
            <Sparkles className="h-4.5 w-4.5 text-indigo-300" />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              id="mainQuery"
              type="text"
              placeholder="Ask me anything about your docs…"
              className="w-full rounded-lg bg-zinc-900/80 text-sm md:text-base pl-9 pr-28 h-12 outline-none ring-1 ring-white/10 focus:ring-indigo-500/40 placeholder:text-zinc-500 transition"
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              <button className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white hover:ring-indigo-500/40 transition">
                <Filter className="h-3.5 w-3.5" /> Docs
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600/90 px-3 py-1.5 text-[12px] text-white ring-1 ring-indigo-500/40 hover:bg-indigo-500 transition">
                <Send className="h-3.5 w-3.5" /> Ask
              </button>
            </div>
          </div>

          {/* Dropzone */}
          <div
            id="dropzone"
            className="mt-3 hidden rounded-md border border-dashed border-white/10 bg-zinc-900/40 p-3 text-xs text-zinc-400"
          >
            Drag & drop files here to add to your library
          </div>
        </div>
      </div>
    </div>
  );
}
