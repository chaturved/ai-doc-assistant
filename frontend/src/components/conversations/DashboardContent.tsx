"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Copy, ThumbsUp, ThumbsDown, Paperclip, ChevronDown } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sseClient } from "@/lib/api-client";
import { createConversation, getMessages } from "@/lib/api/conversations";
import { setFeedback } from "@/lib/api/analytics";
import type { Message, Meta, Source } from "@/types";


function SourceBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[10px] font-bold font-mono mx-px bg-amber-500/20 border border-amber-500/40 text-accent"
    >
      {n}
    </span>
  );
}

// ─── AI Message ───────────────────────────────────────────────────────────────

interface AIMessageProps {
  messageId?: number;
  content: string;
  meta: Meta | null;
  streaming?: boolean;
  timestamp: string;
}

function AIMessage({ messageId, content, meta, streaming, timestamp }: AIMessageProps) {
  const handleCopy = () => { navigator.clipboard.writeText(content); toast.success("Copied!"); };
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [feedback, setFeedbackState] = useState<"up" | "down" | null>(null);

  const handleFeedback = async (value: "up" | "down") => {
    if (!messageId) return;
    const next = feedback === value ? null : value;
    setFeedbackState(next);
    if (next) {
      try { await setFeedback(messageId, next); } catch { setFeedbackState(feedback); }
    }
  };

  return (
    <div className="msg-in card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3 border-b-system">
        <span className="text-xs font-bold text-accent">Paperwise</span>
        {streaming ? (
          <div className="ml-auto flex items-center gap-1">
            {[0, 180, 360].map((d) => (
              <span key={d} className="inline-block h-1.5 w-1.5 rounded-full shimmer-dot bg-accent"
                    style={{ animationDelay: `${d}ms` }} />
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
        <div className="px-5 py-4 text-sm leading-relaxed prose prose-invert prose-sm max-w-none text-soft">
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
          {streaming && <span className="cursor-blink inline-block w-0.5 h-4 rounded-sm align-text-bottom ml-0.5 bg-accent" />}
        </div>
      )}

      {meta?.sources && meta.sources.length > 0 && !streaming && (
        <div className="px-5 pb-4 space-y-2">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-2">Sources</p>
          {meta.sources.map((src: Source, i: number) => (
            <div key={i}
              onClick={() => setExpandedSource(expandedSource === i + 1 ? null : i + 1)}
              className="rounded-[8px] p-2.5 cursor-pointer transition-all bg-white/[0.03] border border-white/[0.07]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold flex-shrink-0 bg-amber-500/[0.15] text-accent">{i + 1}</span>
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
            <Copy size={13} /> Copy
          </button>
          <div className="ml-auto flex items-center gap-0.5">
            <button onClick={() => handleFeedback("up")}
              className={`p-1.5 rounded-[7px] transition-all hover:bg-emerald-500/10 ${feedback === "up" ? "text-emerald-400" : "text-faint hover:text-emerald-400"}`}>
              <ThumbsUp size={13} />
            </button>
            <button onClick={() => handleFeedback("down")}
              className={`p-1.5 rounded-[7px] transition-all hover:bg-red-500/10 ${feedback === "down" ? "text-red-400" : "text-faint hover:text-red-400"}`}>
              <ThumbsDown size={13} />
            </button>
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
        <div className="rounded-[14px] rounded-tr-[5px] px-4 py-3 bg-white/[0.06] border border-amber-500/[0.15]">
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
      className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[12.5px] text-muted hover:text-white whitespace-nowrap transition-all bg-white/[0.05] border-system"
    >
      <span className="text-[13px]">{icon}</span>
      {label}
    </button>
  );
}

// ─── Input Box ────────────────────────────────────────────────────────────────

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
  return (
    <div className="rounded-[16px] overflow-hidden transition-all bg-white/[0.04] border border-white/[0.07]">
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
        className={`w-full bg-transparent px-4 pt-4 pb-2 text-[14px] text-white placeholder:text-faint resize-none outline-none overflow-hidden ${large ? "min-h-[88px]" : "min-h-[52px]"}`}
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-muted hover:text-white transition bg-white/[0.06] border border-white/[0.07]">
          <Paperclip size={12} /> All docs <ChevronDown size={11} />
        </button>
        <button
          onClick={onSend}
          disabled={isStreaming || !value.trim()}
          className="btn-primary !p-0 rounded-[10px] disabled:opacity-35 h-[34px] w-[34px]"
        >
          {isStreaming
            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardInner() {
  const params = useSearchParams();

  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMeta, setStreamingMeta]       = useState<Meta | null>(null);
  const [isStreaming, setIsStreaming]   = useState(false);
  const [inputValue, setInputValue]     = useState("");
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const initConv = params.get("conv");
    if (initConv) setActiveConvId(Number(initConv));
  }, [params]);

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
      setSidebarRefresh((v) => v + 1);
      setActiveConvId(conv.id);
      setMessages([]);
      setStreamingContent("");
      setStreamingMeta(null);
    } catch { toast.error("Failed to create conversation"); }
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
        setSidebarRefresh((v) => v + 1);
      } catch { toast.error("Failed to start conversation"); return; }
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: q, meta: null, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setStreamingContent("");
    setStreamingMeta(null);
    setIsStreaming(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    let localContent = "";
    let localMeta: Meta | null = null;

    try {
      await sseClient(`/v1/conversations/${convId}/ask`, {
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
                return [...prev, { id: Date.now() + 1, role: "assistant", content: localContent, meta: localMeta, created_at: new Date().toISOString() }];
              }
              return prev;
            });
            setSidebarRefresh((v) => v + 1);
            return;
          }
          if (ev.event === "error") { setIsStreaming(false); toast.error("AI response failed"); return; }
          try {
            const parsed = JSON.parse(ev.data);
            if (parsed.meta) { localMeta = parsed.meta; setStreamingMeta(parsed.meta); }
            if (parsed.token) { localContent += parsed.token; setStreamingContent((prev) => prev + parsed.token); }
          } catch { /* ignore */ }
        },
        onerror() { setIsStreaming(false); },
      });
    } catch { setIsStreaming(false); }
  };

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
    <div className="flex h-screen overflow-hidden text-white relative bg-bg">
      <div className="absolute inset-0 pointer-events-none bg-hero-gradient" />
      <div className="absolute inset-0 pointer-events-none bg-vignette" />

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <AppSidebar
        activeConvId={activeConvId}
        onConvSelect={setActiveConvId}
        onConvDelete={(id) => { if (id === activeConvId) { setActiveConvId(null); setMessages([]); setStreamingContent(""); setStreamingMeta(null); } }}
        onNewChat={handleNewChat}
        refreshKey={sidebarRefresh}
      />

      {/* ══════════ MAIN CHAT ══════════ */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-sidebar">
        <div className="absolute inset-0 pointer-events-none bg-amber-glow z-0" />
        {inChat ? (
          <>
            <div className="flex-1 overflow-y-auto thin-scroll px-8 py-7 space-y-5 max-w-[780px] w-full mx-auto">
              {messages.map((msg) =>
                msg.role === "user"
                  ? <UserMessage key={msg.id} content={msg.content} timestamp={msg.created_at} />
                  : <AIMessage key={msg.id} messageId={msg.id} content={msg.content} meta={msg.meta} timestamp={msg.created_at} />
              )}
              {isStreaming && (
                <AIMessage content={streamingContent} meta={streamingMeta} streaming timestamp={new Date().toISOString()} />
              )}
              <div ref={chatEndRef} />
            </div>

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
          <div className="flex-1 flex flex-col justify-center px-8 relative">
            <div className="w-full max-w-[660px] mx-auto relative z-10">
              <h1 className="text-[2.8rem] font-black text-center mb-8 leading-[1.06] tracking-[-0.03em] animate-fu">
                What&apos;s on your mind today?
              </h1>

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

export default function DashboardContent() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  );
}
