"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Plus, Search, Settings, LogOut, Send, FileText,
  ChevronDown, Copy, ThumbsUp, ThumbsDown,
  Paperclip, Trash2, MessageSquare, Upload,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth } from "@/context/AuthContext";
import {
  clearLibrary, createConversation, deleteConversation, deleteDocument,
  formatBytes, getConversations, getLibrary, getMessages,
  logout, renameConversation, uploadFiles,
} from "@/lib/paperwise-api";
import type { Conversation, LibraryDoc, Message, Meta, Source } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function groupByDate(convs: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Last 7 days", items: [] },
    { label: "Older", items: [] },
  ];
  for (const c of convs) {
    const d = new Date(c.updated_at);
    if (d >= today) groups[0].items.push(c);
    else if (d >= yesterday) groups[1].items.push(c);
    else if (d >= lastWeek) groups[2].items.push(c);
    else groups[3].items.push(c);
  }
  return groups.filter((g) => g.items.length > 0);
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-bold text-white">{initials}</span>
    </div>
  );
}

function DocIcon({ type }: { type: string }) {
  const color = type === "pdf" ? "text-rose-400" : type === "docx" ? "text-blue-400" : "text-zinc-400";
  return <FileText className={`h-4 w-4 ${color}`} />;
}

// ─── Source badge (inline clickable [N]) ─────────────────────────────────────

function SourceBadge({ n, onClick }: { n: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono cursor-pointer mx-px hover:bg-indigo-500/35 transition-colors"
    >
      {n}
    </button>
  );
}

// ─── AI Message ──────────────────────────────────────────────────────────────

interface AIMessageProps {
  content: string;
  meta: Meta | null;
  streaming?: boolean;
  onSourceClick?: (n: number) => void;
  timestamp: string;
}

function AIMessage({ content, meta, streaming, onSourceClick, timestamp }: AIMessageProps) {
  const handleCopy = () => { navigator.clipboard.writeText(content); toast.success("Copied!"); };

  return (
    <div className="msg-in rounded-2xl bg-zinc-900/50 ring-1 ring-white/[0.07] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-bold text-white">P</span>
        </div>
        <span className="text-xs font-semibold text-zinc-300">Paperwise</span>
        {streaming ? (
          <div className="ml-auto flex items-center gap-1.5">
            {[0, 200, 400].map((d) => (
              <span key={d} className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 shimmer-line" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-zinc-700 ml-auto">{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        )}
      </div>

      {streaming && !content ? (
        <div className="px-5 py-4 space-y-3">
          {[100, 83, 91].map((w, i) => (
            <div key={i} className={`h-3.5 rounded-full bg-zinc-800/80 shimmer-line`} style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      ) : (
        <div className="px-5 py-4 text-sm text-zinc-300 leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Render [N] source badges
              text: ({ children }) => {
                if (!meta?.sources || !onSourceClick) return <>{children}</>;
                const text = String(children);
                const parts = text.split(/(\[\d+\])/g);
                return (
                  <>
                    {parts.map((p, i) => {
                      const match = p.match(/^\[(\d+)\]$/);
                      if (match) return <SourceBadge key={i} n={Number(match[1])} onClick={() => onSourceClick(Number(match[1]))} />;
                      return <span key={i}>{p}</span>;
                    })}
                  </>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {streaming && <span className="cursor-blink inline-block w-0.5 h-4 bg-indigo-400 rounded-sm align-text-bottom ml-0.5" />}
        </div>
      )}

      {meta?.sources && meta.sources.length > 0 && !streaming && (
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-1">
          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
          <div className="ml-auto flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><ThumbsUp className="h-3.5 w-3.5" /></button>
            <button className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><ThumbsDown className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Message ─────────────────────────────────────────────────────────────

function UserMessage({ content, timestamp }: { content: string; timestamp: string }) {
  return (
    <div className="msg-in flex justify-end">
      <div className="max-w-[70%]">
        <div className="rounded-2xl rounded-tr-sm bg-indigo-600/15 border border-indigo-500/20 px-4 py-3">
          <p className="text-sm text-zinc-200">{content}</p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-zinc-700">{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, refetchUser } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMeta, setStreamingMeta] = useState<Meta | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"sources" | "library">("sources");
  const [library, setLibrary] = useState<LibraryDoc[]>([]);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [hoveredConv, setHoveredConv] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Current conversation's last AI message meta (for right panel sources)
  const lastAIMeta = messages.filter((m) => m.role === "assistant").slice(-1)[0]?.meta ?? streamingMeta;

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch { /* silent */ }
  }, []);

  const loadLibrary = useCallback(async () => {
    try {
      const data = await getLibrary();
      setLibrary(data.sections);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadConversations();
    loadLibrary();
    const initConv = params.get("conv");
    if (initConv) setActiveConvId(Number(initConv));
  }, [loadConversations, loadLibrary, params]);

  useEffect(() => {
    if (activeConvId) {
      getMessages(activeConvId).then(setMessages).catch(() => {});
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      await loadConversations();
      setActiveConvId(conv.id);
      setMessages([]);
      setStreamingContent("");
      setStreamingMeta(null);
    } catch { toast.error("Failed to create conversation"); }
  };

  const handleDeleteConv = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      await loadConversations();
      if (activeConvId === id) { setActiveConvId(null); setMessages([]); }
    } catch { toast.error("Failed to delete conversation"); }
  };

  const handleRenameSubmit = async (id: number) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    try {
      await renameConversation(id, renameValue.trim());
      await loadConversations();
    } catch { /* silent */ }
    setRenamingId(null);
  };

  const handleSourceClick = (n: number) => {
    setActiveTab("sources");
    setHighlightedSource(n);
    setExpandedSource(n);
    setTimeout(() => setHighlightedSource(null), 2000);
  };

  const handleSend = async () => {
    const q = inputValue.trim();
    if (!q || isStreaming) return;

    let convId = activeConvId;
    if (!convId) {
      try {
        const conv = await createConversation();
        convId = conv.id;
        setActiveConvId(conv.id);
        await loadConversations();
      } catch { toast.error("Failed to start conversation"); return; }
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: q, meta: null, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setStreamingContent("");
    setStreamingMeta(null);
    setIsStreaming(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";
      await fetchEventSource(`${backendUrl}/v1/conversations/${convId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: q, filters: null, top_k: 5 }),
        onmessage(ev) {
          if (ev.data === "[DONE]") {
            setIsStreaming(false);
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "user") {
                return [...prev, {
                  id: Date.now() + 1,
                  role: "assistant",
                  content: streamingContent,
                  meta: streamingMeta,
                  created_at: new Date().toISOString(),
                }];
              }
              return prev;
            });
            loadConversations();
            return;
          }
          if (ev.event === "error") { setIsStreaming(false); toast.error("AI response failed"); return; }
          try {
            const parsed = JSON.parse(ev.data);
            if (parsed.meta) setStreamingMeta(parsed.meta);
            if (parsed.token) setStreamingContent((prev) => prev + parsed.token);
          } catch { /* ignore */ }
        },
        onerror() { setIsStreaming(false); },
      });
    } catch { setIsStreaming(false); }
  };

  const handleLogout = async () => {
    await logout();
    await refetchUser();
    router.push("/login");
  };

  const handleUploadDocs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingDocs(true);
    try {
      await uploadFiles(files);
      await loadLibrary();
      toast.success(`Uploaded ${files.length} file(s)`);
    } catch { toast.error("Upload failed"); }
    finally { setUploadingDocs(false); }
  };

  const handleDeleteDoc = async (id: number) => {
    try {
      await deleteDocument(id);
      await loadLibrary();
    } catch { toast.error("Delete failed"); }
  };

  const handleClearLibrary = async () => {
    if (!confirm("Delete all documents? This cannot be undone.")) return;
    try {
      await clearLibrary();
      await loadLibrary();
      toast.success("Library cleared");
    } catch { toast.error("Failed to clear library"); }
  };

  const filteredConvs = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByDate(filteredConvs);

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      <style>{`
        @keyframes cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes fade-in-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes source-glow { 0% { box-shadow:0 0 0 2px rgba(99,102,241,0.8); } 100% { box-shadow:0 0 0 2px rgba(99,102,241,0); } }
        .cursor-blink { animation: cursor-blink 1.1s ease-in-out infinite; }
        .msg-in { animation: fade-in-up 0.3s ease-out forwards; }
        .shimmer-line { animation: shimmer 1.5s ease-in-out infinite; }
        .source-highlighted { animation: source-glow 2s ease-out forwards; }
        .conv-item { transition: background 0.15s ease; }
        .conv-item:hover { background: rgba(255,255,255,0.04); }
        .conv-item.active { background: rgba(99,102,241,0.08); border-left: 2px solid #6366f1; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        textarea::-webkit-scrollbar { display: none; }
        .prose p { margin: 0.5em 0; }
        .prose ul { margin: 0.5em 0; padding-left: 1.5em; }
        .prose li { margin: 0.25em 0; }
        .prose strong { color: #e4e4e7; }
        .prose code { background: rgba(255,255,255,0.08); padding: 0.1em 0.3em; border-radius: 4px; font-size: 0.85em; }
        .prose pre { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1em; overflow-x: auto; }
      `}</style>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0d0d10]">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Paperwise</span>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 transition-colors px-3 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20">
            <Plus className="h-4 w-4" /> New chat
          </button>
        </div>

        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search conversations…" className="w-full rounded-lg bg-zinc-900/60 border border-white/[0.06] pl-8 pr-3 py-1.5 text-xs text-zinc-400 placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-indigo-500/40 transition" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
          {grouped.length === 0 ? (
            <p className="px-2 py-4 text-xs text-zinc-700 text-center">No conversations yet.<br />Start one above.</p>
          ) : (
            grouped.map(({ label, items }) => (
              <div key={label} className="mb-3">
                <div className="px-2 py-1 text-[10px] font-medium text-zinc-700 uppercase tracking-wider">{label}</div>
                {items.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conv-item relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer mb-0.5 ${activeConvId === conv.id ? "active" : ""}`}
                    onClick={() => setActiveConvId(conv.id)}
                    onMouseEnter={() => setHoveredConv(conv.id)}
                    onMouseLeave={() => setHoveredConv(null)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-zinc-700 flex-shrink-0" />
                    {renamingId === conv.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenameSubmit(conv.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(conv.id); if (e.key === "Escape") setRenamingId(null); }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-xs bg-transparent text-zinc-200 outline-none border-b border-indigo-500/50"
                      />
                    ) : (
                      <span className={`text-xs truncate flex-1 ${activeConvId === conv.id ? "text-zinc-200" : "text-zinc-500"}`} onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(conv.id); setRenameValue(conv.title); }}>
                        {conv.title}
                      </span>
                    )}
                    {hoveredConv === conv.id && renamingId !== conv.id && (
                      <button onClick={(e) => handleDeleteConv(conv.id, e)} className="flex-shrink-0 p-0.5 rounded text-zinc-600 hover:text-rose-400 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/[0.06] px-3 py-3">
          <div className="flex items-center gap-2.5">
            <Avatar initials={user?.avatar_initials || user?.full_name?.slice(0, 2).toUpperCase() || "??"} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-zinc-300 truncate">{user?.full_name}</div>
              <div className="text-[10px] text-zinc-600 truncate">{user?.email}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => router.push("/settings/profile")} className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors">
                <Settings className="h-3.5 w-3.5" />
              </button>
              <button onClick={handleLogout} className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ CHAT AREA ═══ */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-6">
          {!activeConvId && messages.length === 0 ? (
            /* Welcome state */
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                <span className="text-white text-lg font-bold">P</span>
              </div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">Chat with your documents</h2>
              <p className="text-sm text-zinc-600 mb-8">Upload documents and ask anything about them.</p>
              {library.length > 0 && (
                <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] px-4 py-3 mb-6 text-sm text-zinc-500">
                  {library.length} document{library.length !== 1 ? "s" : ""} in your library 📄
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
                {["Summarize my Q3 report", "What are the action items?", "Compare docs A and B", "Find the key risks"].map((q) => (
                  <button key={q} onClick={() => setInputValue(q)} className="text-left text-xs text-zinc-500 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] px-3 py-2.5 hover:ring-indigo-500/30 hover:text-zinc-300 hover:bg-indigo-500/5 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserMessage key={msg.id} content={msg.content} timestamp={msg.created_at} />
                ) : (
                  <AIMessage key={msg.id} content={msg.content} meta={msg.meta} timestamp={msg.created_at} onSourceClick={handleSourceClick} />
                )
              )}
              {isStreaming && (
                <AIMessage content={streamingContent} meta={streamingMeta} streaming timestamp={new Date().toISOString()} onSourceClick={handleSourceClick} />
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#09090b] px-6 py-4">
          <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/[0.07] focus-within:ring-indigo-500/30 transition-all overflow-hidden">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask anything about your documents…"
              className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-zinc-200 placeholder:text-zinc-700 resize-none outline-none min-h-[52px]"
              style={{ overflow: "hidden" }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/15 transition-all">
                <Paperclip className="h-3.5 w-3.5" /> All docs <ChevronDown className="h-3 w-3" />
              </button>
              <button
                onClick={handleSend}
                disabled={isStreaming || !inputValue.trim()}
                className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-500/20"
              >
                {isStreaming ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Send className="h-3.5 w-3.5 text-white" />}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-800 mt-2">Paperwise answers from your documents only.</p>
        </div>
      </main>

      {/* ═══ RIGHT PANEL ═══ */}
      <aside className="w-[300px] flex-shrink-0 flex flex-col border-l border-white/[0.06] bg-[#0d0d10]">
        <div className="flex border-b border-white/[0.06] px-4">
          {(["sources", "library"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 text-xs font-medium mr-5 transition-colors border-b-2 ${activeTab === tab ? "text-zinc-200 border-indigo-500" : "text-zinc-600 border-transparent"}`}
            >
              {tab === "sources" ? `Sources${lastAIMeta?.sources?.length ? ` (${lastAIMeta.sources.length})` : ""}` : "Library"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
          {activeTab === "sources" && (
            <div className="space-y-2.5">
              {!lastAIMeta?.sources?.length ? (
                <p className="text-xs text-zinc-700 text-center py-8">Ask a question to see sources here.</p>
              ) : (
                lastAIMeta.sources.map((src: Source, i: number) => (
                  <div
                    key={i}
                    className={`rounded-xl ring-1 overflow-hidden transition-all cursor-pointer ${highlightedSource === i + 1 ? "ring-indigo-500/60 bg-indigo-500/5 source-highlighted" : "ring-white/[0.07] bg-zinc-900/40 hover:ring-white/15"}`}
                    onClick={() => setExpandedSource(expandedSource === i + 1 ? null : i + 1)}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileText className="h-3 w-3 text-rose-400 flex-shrink-0" />
                          <span className="text-xs text-zinc-300 truncate">{src.name}</span>
                        </div>
                      </div>
                      <p className={`text-xs text-zinc-500 leading-relaxed ${expandedSource === i + 1 ? "" : "line-clamp-2"}`}>{src.quote}</p>
                      <button className="mt-1 text-[10px] text-indigo-400 hover:text-indigo-300">
                        {expandedSource === i + 1 ? "Show less ↑" : "View full ↓"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "library" && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-zinc-500">{library.length} document{library.length !== 1 ? "s" : ""}</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDocs}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 transition-colors px-2.5 py-1.5 text-[11px] font-medium text-white disabled:opacity-50"
                >
                  {uploadingDocs ? <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" /> : <Upload className="h-3 w-3" />}
                  Upload
                </button>
                <input ref={fileInputRef} type="file" multiple accept=".pdf,.txt,.md,.docx" className="hidden" onChange={handleUploadDocs} />
              </div>
              {library.length === 0 ? (
                <p className="text-xs text-zinc-700 text-center py-8">No documents yet.</p>
              ) : (
                <div className="space-y-2">
                  {library.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2.5 rounded-xl bg-zinc-900/40 ring-1 ring-white/[0.07] p-3 hover:ring-white/15 transition-all group">
                      <div className="h-8 w-8 rounded-lg bg-zinc-800 ring-1 ring-white/[0.08] flex items-center justify-center flex-shrink-0">
                        <DocIcon type={doc.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-zinc-300 truncate">{doc.name}</div>
                        <div className="text-[10px] text-zinc-600">{formatBytes(doc.size)}</div>
                      </div>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {library.length > 0 && (
                <button onClick={handleClearLibrary} className="mt-4 w-full text-center text-xs text-rose-400/60 hover:text-rose-400 transition-colors py-2 rounded-lg hover:bg-rose-500/5">
                  Clear all documents
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
