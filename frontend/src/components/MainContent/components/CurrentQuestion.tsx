import { Bot, Copy, RefreshCcw, Shield, Waves } from "lucide-react";

export default function CurrentQuestion() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl tracking-tight font-semibold text-zinc-50">
            How do I stream server‑sent events in JavaScript?
          </h1>
          <p className="mt-2 text-sm md:text-base text-zinc-400 max-w-2xl">
            Answered using your indexed documents with citations and snippet
            context.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
              <Bot className="h-3.5 w-3.5 text-zinc-400" /> Synthesized answer
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
              <Shield className="h-3.5 w-3.5 text-zinc-400" /> Private docs only
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
              <Waves className="h-3.5 w-3.5 text-zinc-400" /> Streaming
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button className="rounded-md bg-zinc-900/70 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center gap-2">
            <Copy className="h-4 w-4" /> Copy
          </button>
          <button className="rounded-md bg-zinc-900/70 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-emerald-500/40 transition inline-flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
