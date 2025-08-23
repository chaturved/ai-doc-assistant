"use client";

import {
  Search,
  Filter,
  Send,
  Sparkles,
  Bot,
  Shield,
  Waves,
  Copy,
  RefreshCcw,
  FileText,
  FileCode,
  Table,
  ArrowUpRight,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from "lucide-react";

export default function MainContent() {
  return (
    <section className="col-span-12 lg:col-span-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <a href="#" className="hover:text-zinc-300 transition">
          Search
        </a>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <span id="breadcrumb-current" className="text-zinc-400">
          Query #3
        </span>
      </div>

      {/* Main Query Bar */}
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

      {/* Current Question */}
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
                <Shield className="h-3.5 w-3.5 text-zinc-400" /> Private docs
                only
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

      {/* AI Answer Card */}
      <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
        <div className="text-sm text-zinc-300 leading-6">
          • Use the EventSource API to open a unidirectional connection to your
          server. The browser will automatically reconnect on transient
          failures.
          <br />
          • The server should emit text/event-stream with lines prefixed by
          “data:”. Batch tokens or send one per line for real‑time rendering.
          <br />
          • In Node, prefer eventsource-parser to handle fragmented chunks and
          keep your UI responsive.
          <br />• Always close the stream on completion signal (e.g., [DONE])
          and surface citations alongside the generated text.
        </div>
        <div className="hidden mt-3 rounded-md bg-amber-500/10 ring-1 ring-amber-400/20 p-3 text-sm text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" /> No relevant info found
            in your docs. Try uploading more files or broadening the query.
          </div>
        </div>
      </div>

      {/* Snippets */}
      <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl tracking-tight font-semibold text-zinc-100">
            Relevant snippets
          </h3>
          <span className="text-xs text-zinc-400">
            Top matches from your library
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Example snippet card */}
          <SnippetCard
            name="api-reference.md"
            icon={<FileCode className="h-4 w-4 text-indigo-300" />}
            snippet="To stream tokens, set stream: true and use Server‑Sent Events. The server should flush data using “data: {json}\n\n” format..."
          />
          <SnippetCard
            name="Onboarding Guide.pdf"
            icon={<FileText className="h-4 w-4 text-rose-300" />}
            snippet="The client subscribes via EventSource(url). Handle message and error events, and close the connection when “[DONE]” is received..."
          />
          <SnippetCard
            name="endpoints.csv"
            icon={<Table className="h-4 w-4 text-emerald-300" />}
            snippet="/v1/answers — supports stream responses via text/event‑stream and emits token and citation events for UI rendering..."
          />
        </div>
      </div>

      {/* Feedback */}
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
    </section>
  );
}

// Reusable snippet card
function SnippetCard({
  name,
  icon,
  snippet,
}: {
  name: string;
  icon: React.ReactNode;
  snippet: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200 inline-flex items-center gap-2">
          {icon} {name}
        </div>
        <a
          href="#"
          className="text-[11px] text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
        >
          View in doc <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-1 text-sm text-zinc-400 line-clamp-4">{snippet}</p>
    </div>
  );
}
