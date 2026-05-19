"use client";

import { useState } from "react";
import {
  Plus, Search, Settings, LogOut, Send, FileText,
  ChevronDown, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Paperclip, MoreHorizontal, Trash2,
  MessageSquare,
} from "lucide-react";

const conversations: Record<string, { id: number; title: string; active?: boolean }[]> = {
  today: [
    { id: 1, title: "Q3 financial report analysis", active: true },
    { id: 2, title: "Onboarding guide review" },
  ],
  yesterday: [
    { id: 3, title: "Legal contract comparison" },
    { id: 4, title: "Product roadmap questions" },
  ],
  lastWeek: [
    { id: 5, title: "HR policy summary" },
    { id: 6, title: "Investor deck Q&A" },
    { id: 7, title: "Board meeting minutes" },
  ],
};

const sources = [
  {
    n: 1,
    doc: "Q3-financial-report.pdf",
    section: "Section 2.1 — Revenue",
    snippet: "Revenue grew by 23% year-over-year in Q3, reaching $47.2M compared to $38.4M in Q3 of the prior year. This exceeded analyst consensus estimates of $44.8M.",
  },
  {
    n: 2,
    doc: "Q3-financial-report.pdf",
    section: "Section 3.4 — Enterprise",
    snippet: "Enterprise segment added 47 new accounts in Q3, representing a 40% increase over Q2. Average contract value increased from $28K to $36K ARR.",
  },
  {
    n: 3,
    doc: "board-deck-q3.pdf",
    section: "Slide 12 — Outlook",
    snippet: "Management projects Q4 revenue of $52–54M, representing continued 20–25% YoY growth. Key risk factors include supply chain and FX headwinds.",
  },
];

const libraryDocs = [
  { name: "Q3-financial-report.pdf", type: "pdf", size: "2.4 MB" },
  { name: "board-deck-q3.pdf", type: "pdf", size: "890 KB" },
  { name: "onboarding-guide.docx", type: "docx", size: "45 KB" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"sources" | "library">("sources");
  const [hoveredConv, setHoveredConv] = useState<number | null>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSourceClick = (n: number) => {
    setActiveTab("sources");
    setHighlightedSource(n);
    setExpandedSource(n);
    setTimeout(() => setHighlightedSource(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes source-highlight {
          0% { box-shadow: 0 0 0 2px rgba(99,102,241,0.8); }
          100% { box-shadow: 0 0 0 2px rgba(99,102,241,0); }
        }
        .cursor-blink { animation: cursor-blink 1.1s ease-in-out infinite; }
        .msg-in { animation: fade-in-up 0.4s ease-out forwards; }
        .shimmer-line { animation: shimmer-pulse 1.5s ease-in-out infinite; }
        .source-highlighted { animation: source-highlight 2s ease-out forwards; }
        .conv-item { transition: background 0.15s ease; }
        .conv-item:hover { background: rgba(255,255,255,0.04); }
        .conv-item.active { background: rgba(99,102,241,0.08); border-left: 2px solid #6366f1; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .source-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 16px;
          min-width: 16px;
          padding: 0 4px;
          border-radius: 4px;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 10px;
          font-weight: 600;
          font-family: monospace;
          cursor: pointer;
          vertical-align: middle;
          margin: 0 1px;
          transition: background 0.15s ease;
        }
        .source-badge:hover { background: rgba(99,102,241,0.35); }
        .tab-active {
          color: #e4e4e7;
          border-bottom: 2px solid #6366f1;
        }
        .tab-inactive {
          color: #71717a;
          border-bottom: 2px solid transparent;
        }
        textarea::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0d0d10]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Paperwise</span>
        </div>

        {/* New chat */}
        <div className="px-3 pt-3 pb-2">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 transition-colors px-3 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search conversations…"
              className="w-full rounded-lg bg-zinc-900/60 border border-white/[0.06] pl-8 pr-3 py-1.5 text-xs text-zinc-400 placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-indigo-500/40 transition"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
          {(
            [
              { label: "Today", items: conversations.today },
              { label: "Yesterday", items: conversations.yesterday },
              { label: "Last 7 days", items: conversations.lastWeek },
            ]
          ).map(({ label, items }) => (
            <div key={label} className="mb-3">
              <div className="px-2 py-1 text-[10px] font-medium text-zinc-700 uppercase tracking-wider">
                {label}
              </div>
              {items.map((conv) => (
                <div
                  key={conv.id}
                  className={`conv-item relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer mb-0.5 ${conv.active ? "active" : ""}`}
                  onMouseEnter={() => setHoveredConv(conv.id)}
                  onMouseLeave={() => setHoveredConv(null)}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-700 flex-shrink-0" />
                  <span className={`text-xs truncate flex-1 ${conv.active ? "text-zinc-200" : "text-zinc-500"}`}>
                    {conv.title}
                  </span>
                  {hoveredConv === conv.id && (
                    <button className="flex-shrink-0 p-0.5 rounded text-zinc-600 hover:text-zinc-300 transition-colors">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* User section */}
        <div className="border-t border-white/[0.06] px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-zinc-300 truncate">John Doe</div>
              <div className="text-[10px] text-zinc-600 truncate">john@example.com</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors">
                <Settings className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════ MAIN CHAT AREA ═══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Conversation thread */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-6">

          {/* User message 1 */}
          <div className="msg-in flex justify-end">
            <div className="max-w-[70%]">
              <div className="rounded-2xl rounded-tr-sm bg-indigo-600/15 border border-indigo-500/20 px-4 py-3">
                <p className="text-sm text-zinc-200">
                  What are the main findings of the Q3 financial report?
                </p>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-zinc-700">2:34 pm</span>
              </div>
            </div>
          </div>

          {/* AI response 1 */}
          <div className="msg-in">
            <div className="rounded-2xl bg-zinc-900/50 ring-1 ring-white/[0.07] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-white">P</span>
                </div>
                <span className="text-xs font-semibold text-zinc-300">Paperwise</span>
                <span className="text-[10px] text-zinc-700 ml-auto">2:34 pm</span>
              </div>

              {/* Body */}
              <div className="px-5 py-4 text-sm text-zinc-300 leading-relaxed">
                <p className="mb-3">
                  Based on your documents{" "}
                  <button onClick={() => handleSourceClick(1)} className="source-badge">1</button>
                  <button onClick={() => handleSourceClick(2)} className="source-badge">2</button>
                  , here are the main Q3 findings:
                </p>

                <p className="mb-2 font-semibold text-zinc-100">Revenue Performance</p>
                <ul className="mb-3 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 flex-shrink-0">·</span>
                    <span>Revenue grew <strong className="text-zinc-100">23% year-over-year</strong>, reaching $47.2M — exceeding analyst expectations of $44.8M</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 flex-shrink-0">·</span>
                    <span>Gross margins improved from <strong className="text-zinc-100">68% to 71%</strong></span>
                  </li>
                </ul>

                <p className="mb-2 font-semibold text-zinc-100">Key Growth Drivers</p>
                <ul className="mb-3 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 flex-shrink-0">·</span>
                    <span>Enterprise customer acquisition increased by <strong className="text-zinc-100">40%</strong> with 47 new accounts{" "}
                      <button onClick={() => handleSourceClick(2)} className="source-badge">2</button>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 flex-shrink-0">·</span>
                    <span>EMEA expansion contributed <strong className="text-zinc-100">18%</strong> of new revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 flex-shrink-0">·</span>
                    <span>Customer churn reduced from 8.2% to <strong className="text-zinc-100">4.9%</strong></span>
                  </li>
                </ul>

                <p className="text-zinc-400">
                  Management projects Q4 revenue of <strong className="text-zinc-200">$52–54M</strong>, continuing 20–25% YoY growth{" "}
                  <button onClick={() => handleSourceClick(3)} className="source-badge">3</button>.
                </p>
              </div>

              {/* Related questions */}
              <div className="px-5 py-3 border-t border-white/[0.06]">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-2">Related</p>
                <div className="flex flex-wrap gap-2">
                  {["What drove EMEA growth?", "How does this compare to Q2?", "What are the Q4 targets?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInputValue(q)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400 hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-1">
                <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
                <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
                <div className="ml-auto flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User message 2 */}
          <div className="msg-in flex justify-end">
            <div className="max-w-[70%]">
              <div className="rounded-2xl rounded-tr-sm bg-indigo-600/15 border border-indigo-500/20 px-4 py-3">
                <p className="text-sm text-zinc-200">
                  What drove the enterprise customer growth?
                </p>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-zinc-700">2:36 pm</span>
              </div>
            </div>
          </div>

          {/* AI response 2 — Streaming state */}
          <div className="msg-in">
            <div className="rounded-2xl bg-zinc-900/50 ring-1 ring-white/[0.07] overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-white">P</span>
                </div>
                <span className="text-xs font-semibold text-zinc-300">Paperwise</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 shimmer-line" style={{ animationDelay: "0ms" }} />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 shimmer-line" style={{ animationDelay: "200ms" }} />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 shimmer-line" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
              <div className="px-5 py-4">
                {/* Skeleton lines */}
                <div className="space-y-3 mb-4">
                  <div className="h-3.5 rounded-full bg-zinc-800/80 w-full shimmer-line" style={{ animationDelay: "0ms" }} />
                  <div className="h-3.5 rounded-full bg-zinc-800/80 w-5/6 shimmer-line" style={{ animationDelay: "150ms" }} />
                  <div className="h-3.5 rounded-full bg-zinc-800/80 w-4/5 shimmer-line" style={{ animationDelay: "300ms" }} />
                </div>
                {/* Partial text with cursor */}
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Enterprise growth was primarily driven by an aggressive outbound sales strategy targeting mid-market companies with 200–1000 employees
                  <span className="cursor-blink inline-block w-0.5 h-4 bg-indigo-400 rounded-sm align-text-bottom ml-0.5" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#09090b] px-6 py-4">
          <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/[0.07] focus-within:ring-indigo-500/30 transition-all overflow-hidden">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your documents…"
              className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-zinc-200 placeholder:text-zinc-700 resize-none outline-none min-h-[52px] max-h-[160px]"
              style={{ overflow: "hidden" }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              {/* Left: doc filter */}
              <button className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/15 transition-all">
                <Paperclip className="h-3.5 w-3.5" />
                All docs
                <ChevronDown className="h-3 w-3" />
              </button>
              {/* Right: send */}
              <button className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/20 flex-shrink-0">
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-800 mt-2">
            Paperwise answers from your documents only — not the internet.
          </p>
        </div>
      </main>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <aside className="w-[300px] flex-shrink-0 flex flex-col border-l border-white/[0.06] bg-[#0d0d10]">
        {/* Tabs */}
        <div className="flex border-b border-white/[0.06] px-4">
          <button
            onClick={() => setActiveTab("sources")}
            className={`py-3.5 text-xs font-medium mr-5 transition-colors ${activeTab === "sources" ? "tab-active" : "tab-inactive"}`}
          >
            Sources (3)
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`py-3.5 text-xs font-medium transition-colors ${activeTab === "library" ? "tab-active" : "tab-inactive"}`}
          >
            Library
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
          {activeTab === "sources" && (
            <div className="space-y-2.5">
              {sources.map((src) => (
                <div
                  key={src.n}
                  className={`rounded-xl ring-1 overflow-hidden transition-all cursor-pointer ${
                    highlightedSource === src.n
                      ? "ring-indigo-500/60 bg-indigo-500/5 source-highlighted"
                      : "ring-white/[0.07] bg-zinc-900/40 hover:ring-white/15"
                  }`}
                  onClick={() => setExpandedSource(expandedSource === src.n ? null : src.n)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex-shrink-0">
                        {src.n}
                      </span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="h-3 w-3 text-rose-400 flex-shrink-0" />
                        <span className="text-xs text-zinc-300 truncate">{src.doc}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-600 mb-2">{src.section}</p>
                    <p className={`text-xs text-zinc-500 leading-relaxed ${expandedSource === src.n ? "" : "line-clamp-2"}`}>
                      {src.snippet}
                    </p>
                    {src.snippet.length > 100 && (
                      <button className="mt-1 text-[10px] text-indigo-400 hover:text-indigo-300">
                        {expandedSource === src.n ? "Show less ↑" : "View full ↓"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "library" && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-zinc-500">{libraryDocs.length} documents</span>
                <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 transition-colors px-2.5 py-1.5 text-[11px] font-medium text-white">
                  <Plus className="h-3 w-3" /> Upload
                </button>
              </div>
              <div className="space-y-2">
                {libraryDocs.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl bg-zinc-900/40 ring-1 ring-white/[0.07] p-3 hover:ring-white/15 transition-all group">
                    <div className="h-8 w-8 rounded-lg bg-zinc-800 ring-1 ring-white/8 flex items-center justify-center flex-shrink-0">
                      <FileText className={`h-4 w-4 ${doc.type === "pdf" ? "text-rose-400" : "text-blue-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 truncate">{doc.name}</div>
                      <div className="text-[10px] text-zinc-600">{doc.size}</div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-center text-xs text-rose-400/60 hover:text-rose-400 transition-colors py-2 rounded-lg hover:bg-rose-500/5">
                Clear all documents
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
