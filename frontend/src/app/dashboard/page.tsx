"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Plus, Search, Settings, LogOut, Send, FileText,
  ChevronDown, ChevronRight, Copy, ThumbsUp, ThumbsDown,
  Paperclip, Trash2, Upload, MessageSquare,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth } from "@/context/AuthContext";
import {
  createConversation, deleteConversation, deleteDocument,
  getConversations, getLibrary, getMessages,
  logout, renameConversation, uploadFiles,
} from "@/lib/paperwise-api";
import type { Conversation, LibraryDoc, Message, Meta, Source } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BORDER = "rgba(255,255,255,0.08)";

function groupByDate(convs: Conversation[]) {
  const now       = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek  = new Date(today.getTime() - 7 * 86400000);
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Last 7 days", items: [] },
    { label: "Older", items: [] },
  ];
  for (const c of convs) {
    const d = new Date(c.updated_at);
    if (d >= today)      groups[0].items.push(c);
    else if (d >= yesterday) groups[1].items.push(c);
    else if (d >= lastWeek)  groups[2].items.push(c);
    else                     groups[3].items.push(c);
  }
  return groups.filter((g) => g.items.length > 0);
}

function DocIcon({ type }: { type: string }) {
  const color = type === "pdf" ? "#f87171" : type === "docx" ? "#60a5fa" : "rgba(255,255,255,0.35)";
  return <FileText style={{ width: 13, height: 13, color }} />;
}

function SourceBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[10px] font-bold font-mono mx-px"
      style={{ background: "rgba(91,33,182,0.25)", border: "1px solid rgba(91,33,182,0.4)", color: "#a78bfa" }}
    >
      {n}
    </span>
  );
}

// ─── AI Message ───────────────────────────────────────────────────────────────

interface AIMessageProps {
  content: string;
  meta: Meta | null;
  streaming?: boolean;
  timestamp: string;
}

function AIMessage({ content, meta, streaming, timestamp }: AIMessageProps) {
  const handleCopy = () => { navigator.clipboard.writeText(content); toast.success("Copied!"); };
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  return (
    <div className="msg-in card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3 border-b-system">
        <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>Paperwise</span>
        {streaming ? (
          <div className="ml-auto flex items-center gap-1">
            {[0, 180, 360].map((d) => (
              <span key={d} className="inline-block h-1.5 w-1.5 rounded-full shimmer-dot"
                    style={{ background: "#7c3aed", animationDelay: `${d}ms` }} />
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-faint ml-auto">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {streaming && !content ? (
        <div className="px-5 py-4 space-y-3">
          {[100, 83, 91].map((w, i) => (
            <div key={i} className="h-3 rounded-full shimmer-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <div className="px-5 py-4 text-sm leading-relaxed prose prose-invert prose-sm max-w-none" style={{ color: "rgba(255,255,255,0.78)" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              text: ({ children }) => {
                if (!meta?.sources) return <>{children}</>;
                const text = String(children);
                const parts = text.split(/(\[\d+\])/g);
                return (
                  <>
                    {parts.map((p, i) => {
                      const match = p.match(/^\[(\d+)\]$/);
                      if (match) return <SourceBadge key={i} n={Number(match[1])} />;
                      return <span key={i}>{p}</span>;
                    })}
                  </>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {streaming && <span className="cursor-blink inline-block w-0.5 h-4 rounded-sm align-text-bottom ml-0.5" style={{ background: "#a78bfa" }} />}
        </div>
      )}

      {/* Inline sources */}
      {meta?.sources && meta.sources.length > 0 && !streaming && (
        <div className="px-5 pb-4 space-y-2">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-2">Sources</p>
          {meta.sources.map((src: Source, i: number) => (
            <div key={i}
              onClick={() => setExpandedSource(expandedSource === i + 1 ? null : i + 1)}
              className="rounded-[8px] p-2.5 cursor-pointer transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold flex-shrink-0"
                      style={{ background: "rgba(91,33,182,0.2)", color: "#a78bfa" }}>{i + 1}</span>
                <span className="text-[11px] text-muted truncate">{src.name}</span>
              </div>
              <p className={`text-[11px] text-faint leading-relaxed ${expandedSource === i + 1 ? "" : "line-clamp-2"}`}>
                {src.quote}
              </p>
            </div>
          ))}
        </div>
      )}

      {!streaming && (
        <div className="px-5 py-2.5 border-t-system flex items-center gap-1">
          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs text-faint hover:text-muted hover:bg-white/[0.04] transition-all">
            <Copy style={{ width: 13, height: 13 }} /> Copy
          </button>
          <div className="ml-auto flex items-center gap-0.5">
            <button className="p-1.5 rounded-[7px] text-faint hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><ThumbsUp style={{ width: 13, height: 13 }} /></button>
            <button className="p-1.5 rounded-[7px] text-faint hover:text-red-400 hover:bg-red-500/10 transition-all"><ThumbsDown style={{ width: 13, height: 13 }} /></button>
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
      <div className="max-w-[72%]">
        <div className="rounded-[14px] rounded-tr-[5px] px-4 py-3"
             style={{ background: "rgba(91,33,182,0.14)", border: "1px solid rgba(91,33,182,0.2)" }}>
          <p className="text-sm text-white/80">{content}</p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-faint">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Suggestion chip ─────────────────────────────────────────────────────────

function Chip({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[12.5px] text-muted hover:text-white whitespace-nowrap transition-all"
      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }}
    >
      <span className="text-[13px]">{icon}</span>
      {label}
    </button>
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
  const [library, setLibrary] = useState<LibraryDoc[]>([]);
  const [hoveredConv, setHoveredConv] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docsOpen, setDocsOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadConversations = useCallback(async () => {
    try { setConversations(await getConversations()); } catch { /* silent */ }
  }, []);

  const loadLibrary = useCallback(async () => {
    try { const data = await getLibrary(); setLibrary(data.sections); } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadConversations();
    loadLibrary();
    const initConv = params.get("conv");
    if (initConv) setActiveConvId(Number(initConv));
  }, [loadConversations, loadLibrary, params]);

  useEffect(() => {
    if (activeConvId) getMessages(activeConvId).then(setMessages).catch(() => {});
    else setMessages([]);
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
    try { await renameConversation(id, renameValue.trim()); await loadConversations(); } catch { /* silent */ }
    setRenamingId(null);
  };

  const handleSend = async (question?: string) => {
    const q = (question ?? inputValue).trim();
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
                return [...prev, { id: Date.now() + 1, role: "assistant", content: streamingContent, meta: streamingMeta, created_at: new Date().toISOString() }];
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
    try { await deleteDocument(id); await loadLibrary(); } catch { toast.error("Delete failed"); }
  };

  const filteredConvs = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByDate(filteredConvs);
  const inChat = activeConvId !== null || messages.length > 0;

  const SUGGESTIONS = [
    { icon: "📄", label: "Summarize my Q3 report" },
    { icon: "🔍", label: "Find key risks" },
    { icon: "📋", label: "List action items" },
    { icon: "💡", label: "What are the conclusions?" },
    { icon: "⚖️", label: "Compare two documents" },
    { icon: "🔗", label: "Extract all citations" },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-white relative" style={{ background: "#080810" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 140% 110% at 50% 100%, #4c1db0 0%, #2a0e6e 20%, #7a3d00 42%, #080810 72%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(8,8,16,0.75) 100%)" }} />
      <style>{`
        @keyframes cursor-blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes fade-in-up { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.35}50%{opacity:0.7} }
        @keyframes source-glow { 0%{box-shadow:0 0 0 2px rgba(91,33,182,0.8)}100%{box-shadow:0 0 0 2px rgba(91,33,182,0)} }
        .cursor-blink{animation:cursor-blink 1.1s ease-in-out infinite}
        .msg-in{animation:fade-in-up 0.28s ease-out forwards}
        .shimmer-dot{animation:shimmer 1.4s ease-in-out infinite}
        .shimmer-line{background:rgba(255,255,255,0.06);animation:shimmer 1.5s ease-in-out infinite}
        .source-highlighted{animation:source-glow 2s ease-out forwards}
        .conv-row{transition:background 0.12s}
        .conv-row:hover{background:rgba(255,255,255,0.04)}
        .conv-row.active{background:rgba(91,33,182,0.1);border-left:2px solid #7c3aed}
        .thin-scroll::-webkit-scrollbar{width:3px}
        .thin-scroll::-webkit-scrollbar-track{background:transparent}
        .thin-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
        textarea::-webkit-scrollbar{display:none}
        .prose p{margin:0.45em 0}
        .prose ul{margin:0.45em 0;padding-left:1.4em}
        .prose li{margin:0.2em 0}
        .prose strong{color:rgba(255,255,255,0.9)}
        .prose code{background:rgba(255,255,255,0.07);padding:0.1em 0.3em;border-radius:4px;font-size:0.84em}
        .prose pre{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.9em;overflow-x:auto}
      `}</style>

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <aside className="w-[255px] flex-shrink-0 flex flex-col thin-scroll relative z-10"
             style={{ background: "rgba(8,8,16,0.65)", borderRight: `1px solid ${BORDER}` }}>
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-[14px]" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-[15px] font-bold tracking-tight">Paperwise</span>
        </div>

        {/* New chat */}
        <div className="px-3 pt-3 pb-2">
          <button onClick={handleNewChat}
            className="btn-primary w-full !rounded-[9px] !text-[13px] !font-semibold">
            <Plus style={{ width: 14, height: 14 }} /> New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" style={{ width: 13, height: 13 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
              className="w-full h-8 rounded-[8px] pl-8 pr-3 text-xs text-muted placeholder:text-faint outline-none transition"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }} />
          </div>
        </div>

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto thin-scroll px-2 pb-2 space-y-1">

          {/* Documents section */}
          <div>
            <button onClick={() => setDocsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-[7px] text-xs font-semibold text-muted uppercase tracking-wider hover:text-white hover:bg-white/[0.03] transition">
              <span>Documents</span>
              <div className="flex items-center gap-1">
                <span className="text-faint font-normal normal-case tracking-normal">{library.length}</span>
                {docsOpen ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
              </div>
            </button>

            {docsOpen && (
              <div className="mt-0.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDocs}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[7px] text-xs text-muted hover:text-white hover:bg-white/[0.04] transition disabled:opacity-50">
                  {uploadingDocs
                    ? <span className="h-3 w-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />
                    : <Upload style={{ width: 13, height: 13 }} />}
                  Upload document
                </button>
                <input ref={fileInputRef} type="file" multiple accept=".pdf,.txt,.md,.docx" className="hidden" onChange={handleUploadDocs} />

                {library.length === 0 ? (
                  <p className="px-2 py-2 text-[11px] text-faint">No documents yet.</p>
                ) : (
                  library.slice(0, 8).map((doc) => (
                    <div key={doc.id}
                      className="group flex items-center gap-2 px-2 py-1.5 rounded-[7px] hover:bg-white/[0.04] transition cursor-default">
                      <DocIcon type={doc.type} />
                      <span className="flex-1 text-xs text-muted truncate group-hover:text-white transition">{doc.name}</span>
                      <button onClick={() => handleDeleteDoc(doc.id)}
                        className="opacity-0 group-hover:opacity-100 text-faint hover:text-red-400 transition p-0.5 rounded">
                        <Trash2 style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  ))
                )}
                {library.length > 8 && (
                  <p className="px-2 py-1 text-[11px] text-faint">+{library.length - 8} more</p>
                )}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: BORDER, margin: "6px 8px" }} />

          {/* Chat section */}
          <div>
            <button onClick={() => setChatOpen((v) => !v)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-[7px] text-xs font-semibold text-muted uppercase tracking-wider hover:text-white hover:bg-white/[0.03] transition">
              <span>Chat</span>
              {chatOpen ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
            </button>

            {chatOpen && (
              <div className="mt-0.5">
                {grouped.length === 0 ? (
                  <p className="px-2 py-2 text-[11px] text-faint">No conversations yet.</p>
                ) : (
                  grouped.map(({ label, items }) => (
                    <div key={label} className="mb-2">
                      <div className="px-2 py-0.5 text-[10px] text-faint uppercase tracking-widest">{label}</div>
                      {items.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setActiveConvId(conv.id)}
                          onMouseEnter={() => setHoveredConv(conv.id)}
                          onMouseLeave={() => setHoveredConv(null)}
                          className={`conv-row relative flex items-center gap-2 px-2 py-1.5 rounded-[7px] cursor-pointer mb-px ${activeConvId === conv.id ? "active" : ""}`}
                        >
                          <MessageSquare className="text-faint flex-shrink-0" style={{ width: 12, height: 12 }} />
                          {renamingId === conv.id ? (
                            <input
                              autoFocus value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={() => handleRenameSubmit(conv.id)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(conv.id); if (e.key === "Escape") setRenamingId(null); }}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 text-xs bg-transparent text-white outline-none border-b"
                              style={{ borderColor: "#7c3aed" }}
                            />
                          ) : (
                            <span
                              className={`text-xs truncate flex-1 transition ${activeConvId === conv.id ? "text-white" : "text-muted"}`}
                              onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(conv.id); setRenameValue(conv.title); }}
                            >
                              {conv.title}
                            </span>
                          )}
                          {hoveredConv === conv.id && renamingId !== conv.id && (
                            <button onClick={(e) => handleDeleteConv(conv.id, e)} className="flex-shrink-0 text-faint hover:text-red-400 transition p-0.5 rounded">
                              <Trash2 style={{ width: 11, height: 11 }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom — upgrade card + user */}
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          {/* Upgrade nudge */}
          <div className="mx-3 mt-3 mb-2 rounded-[10px] p-3" style={{ background: "rgba(91,33,182,0.12)", border: "1px solid rgba(91,33,182,0.22)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#5b21b6", color: "white" }}>Free</span>
              <span className="text-[11px] text-muted">20 queries / month</span>
            </div>
            <p className="text-[11px] text-faint mb-2 leading-relaxed">Upgrade to Growth for unlimited queries and documents.</p>
            <Link href="/pricing" className="block w-full text-center text-[12px] font-semibold py-1.5 rounded-[7px] transition hover:opacity-85"
                  style={{ background: "white", color: "#080810" }}>
              View Plan
            </Link>
          </div>

          {/* User row */}
          <div className="flex items-center gap-2.5 px-3 py-3">
            <div className="logo-grad h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {user?.avatar_initials || user?.full_name?.slice(0, 2).toUpperCase() || "??"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user?.full_name}</div>
              <div className="text-[10px] text-faint truncate">{user?.email}</div>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => router.push("/settings/profile")} className="p-1.5 rounded-[6px] text-faint hover:text-muted hover:bg-white/[0.05] transition">
                <Settings style={{ width: 13, height: 13 }} />
              </button>
              <button onClick={handleLogout} className="p-1.5 rounded-[6px] text-faint hover:text-red-400 hover:bg-red-500/10 transition">
                <LogOut style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════ MAIN CHAT ══════════ */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10" style={{ background: "rgba(8,8,16,0.65)" }}>

        {/* Active chat messages */}
        {inChat ? (
          <>
            <div className="flex-1 overflow-y-auto thin-scroll px-8 py-7 space-y-5 max-w-[780px] w-full mx-auto">
              {messages.map((msg) =>
                msg.role === "user"
                  ? <UserMessage key={msg.id} content={msg.content} timestamp={msg.created_at} />
                  : <AIMessage key={msg.id} content={msg.content} meta={msg.meta} timestamp={msg.created_at} />
              )}
              {isStreaming && (
                <AIMessage content={streamingContent} meta={streamingMeta} streaming timestamp={new Date().toISOString()} />
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar — fixed to bottom in chat mode */}
            <div className="flex-shrink-0 px-8 py-4 max-w-[780px] w-full mx-auto">
              <InputBox
                value={inputValue}
                onChange={setInputValue}
                onSend={() => handleSend()}
                isStreaming={isStreaming}
                textareaRef={textareaRef}
              />
              <p className="text-center text-[10px] text-faint mt-2">
                Paperwise answers are grounded in your uploaded documents only.
              </p>
            </div>
          </>
        ) : (
          /* ── Welcome / empty state ── */
          <div className="flex-1 flex flex-col justify-center px-8 relative">
            <div className="w-full max-w-[660px] mx-auto relative z-10">
              <h1 className="text-[2.8rem] font-black text-center mb-8 leading-[1.06] tracking-[-0.03em] animate-fu">
                What&apos;s on your mind today?
              </h1>

              {/* Large input */}
              <div className="animate-fu-1">
                <InputBox
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={() => handleSend()}
                  isStreaming={isStreaming}
                  textareaRef={textareaRef}
                  large
                />
              </div>

              {/* Suggestion chips — single scrollable row */}
              <div className="animate-fu-2 flex flex-wrap gap-2 mt-5">
                {SUGGESTIONS.map((s) => (
                  <Chip key={s.label} icon={s.icon} label={s.label} onClick={() => { setInputValue(s.label); handleSend(s.label); }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

// ─── Reusable Input Box ───────────────────────────────────────────────────────

function InputBox({
  value, onChange, onSend, isStreaming, textareaRef, large = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  large?: boolean;
}) {
  const BORDER = "rgba(255,255,255,0.07)";
  return (
    <div className="rounded-[16px] overflow-hidden transition-all"
         style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}>
      <textarea
        ref={textareaRef}
        rows={large ? 3 : 1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
        }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder="Ask anything about your documents…"
        className="w-full bg-transparent px-4 pt-4 pb-2 text-[14px] text-white placeholder:text-faint resize-none outline-none"
        style={{ minHeight: large ? 88 : 52, overflow: "hidden" }}
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-muted hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${BORDER}` }}>
          <Paperclip style={{ width: 12, height: 12 }} /> All docs <ChevronDown style={{ width: 11, height: 11 }} />
        </button>
        <button
          onClick={onSend}
          disabled={isStreaming || !value.trim()}
          className="btn-primary !p-0 rounded-[10px] disabled:opacity-35" style={{ height: 34, width: 34 }}
        >
          {isStreaming
            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            : <Send style={{ width: 14, height: 14 }} />}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
