"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Send, Copy, ThumbsUp, ThumbsDown, Paperclip,
  Bot, Shield, Waves, Sparkles, Star, Zap, BookOpen, Link2,
  Check, AlertTriangle, ChevronRight,
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sseClient } from "@/lib/api-client";
import { createConversation, getMessages } from "@/lib/api/conversations";
import { setFeedback } from "@/lib/api/analytics";
import type { Message, Meta, Source, Badge, Snippet } from "@/types";

// ─── Inline citation badge ────────────────────────────────────────────────────

function SourceBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center h-[14px] min-w-[14px] px-1 rounded-[3px] text-[9px] font-bold font-mono mx-px bg-amber-500/15 text-amber-400 relative top-[-1px]">
      {n}
    </span>
  );
}

// ─── Badge icons ──────────────────────────────────────────────────────────────

const BADGE_ICONS: Record<string, React.ReactNode> = {
  bot:       <Bot size={10} />,
  shield:    <Shield size={10} />,
  waves:     <Waves size={10} />,
  sparkles:  <Sparkles size={10} />,
  star:      <Star size={10} />,
  lightning: <Zap size={10} />,
  book:      <BookOpen size={10} />,
  link:      <Link2 size={10} />,
  check:     <Check size={10} />,
  warning:   <AlertTriangle size={10} />,
};

function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-medium bg-white/[0.06] text-white/40 whitespace-nowrap">
      <span className="opacity-50">{BADGE_ICONS[badge.icon] ?? <Sparkles size={10} />}</span>
      {badge.label}
    </span>
  );
}

// ─── Snippet ─────────────────────────────────────────────────────────────────

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((v) => !v)} className="w-full text-left group/snip">
      <div className="flex items-center gap-1.5">
        <ChevronRight size={10} className={`text-white/20 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
        <span className="text-[11.5px] text-white/32 group-hover/snip:text-white/52 truncate transition-colors">{snippet.name}</span>
      </div>
      {open && <p className="mt-1.5 pl-4 text-[11px] text-white/22 leading-relaxed">{snippet.snippet}</p>}
    </button>
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

  const hasContext = !streaming && ((meta?.snippets && meta.snippets.length > 0) || (meta?.sources && meta.sources.length > 0));
  const hasMeta    = !streaming && (meta?.description || (meta?.badges && meta.badges.length > 0));

  return (
    <div className="msg-in group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[12px] font-semibold text-white/75">Paperwise</span>
          {streaming ? (
            <div className="flex items-center gap-[3px]">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-[4px] w-[4px] rounded-full bg-white/25 shimmer-dot" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-white/30 tabular-nums">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {hasMeta && (
          <div className="mb-3 space-y-1.5">
            {meta?.description && <p className="text-[12.5px] leading-relaxed text-white/30 italic">{meta.description}</p>}
            {meta?.badges && meta.badges.length > 0 && (
              <div className="flex flex-wrap gap-1">{meta.badges.map((b, i) => <BadgeChip key={i} badge={b} />)}</div>
            )}
          </div>
        )}

        {streaming && !content ? (
          <div className="space-y-2.5 py-1">
            {[84, 68, 76].map((w, i) => (
              <div key={i} className="h-[11px] rounded-[3px] shimmer-line" style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : (
          <div className="text-[14px] leading-[1.78] prose prose-invert prose-sm max-w-none text-white/90">
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
            {streaming && (
              <span className="cursor-blink inline-block w-[2px] h-[13px] rounded-sm align-text-bottom ml-0.5 bg-white/50" />
            )}
          </div>
        )}

        {hasContext && (
          <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-2.5">
            <span className="text-[10px] font-semibold tracking-[0.09em] uppercase text-white/20">Context used</span>
            {meta?.snippets && meta.snippets.length > 0 && (
              <div className="space-y-1.5 pl-1">{meta.snippets.map((s, i) => <SnippetCard key={i} snippet={s} />)}</div>
            )}
            {meta?.sources && meta.sources.length > 0 && (
              <div className="space-y-1.5 pl-1">
                {meta.snippets && meta.snippets.length > 0 && (
                  <div className="text-[10px] font-semibold tracking-[0.09em] uppercase text-white/20 pt-1">Documents</div>
                )}
                {meta.sources.map((src: Source, i: number) => (
                  <button key={i} onClick={() => setExpandedSource(expandedSource === i + 1 ? null : i + 1)} className="w-full text-left group/src">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[9px] font-bold text-amber-500/60 flex-shrink-0 mt-[2px]">[{i + 1}]</span>
                      <div className="min-w-0">
                        <span className="text-[11.5px] text-white/30 group-hover/src:text-white/50 transition-colors truncate block">{src.name}</span>
                        <p className={`text-[11px] text-white/20 leading-relaxed mt-0.5 ${expandedSource === i + 1 ? "" : "line-clamp-2"}`}>{src.quote}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!streaming && (
          <div className="flex items-center gap-0.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-[5px] px-1.5 py-1 text-[11px] text-white/20 hover:text-white/45 hover:bg-white/[0.05] transition-all"
            >
              <Copy size={11} /> Copy
            </button>
            <button onClick={() => handleFeedback("up")} className={`p-1 rounded-[5px] transition-all ${feedback === "up" ? "text-emerald-400" : "text-white/18 hover:text-emerald-400"}`}>
              <ThumbsUp size={11} />
            </button>
            <button onClick={() => handleFeedback("down")} className={`p-1 rounded-[5px] transition-all ${feedback === "down" ? "text-red-400" : "text-white/18 hover:text-red-400"}`}>
              <ThumbsDown size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── User Message ─────────────────────────────────────────────────────────────

function UserMessage({ content, timestamp }: { content: string; timestamp: string }) {
  return (
    <div className="msg-in flex justify-end">
      <div className="max-w-[72%]">
        <div className="rounded-[20px] rounded-br-[6px] px-4 py-3 bg-white/[0.07] border border-white/[0.08]">
          <p className="text-[14px] leading-relaxed text-white">{content}</p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-white/30 tabular-nums">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
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
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div
      className="rounded-[16px] transition-all duration-150 bg-white/[0.04]"
      style={{ border: `1px solid ${active ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.08)"}` }}
    >
      {large && (
        <textarea
          ref={textareaRef}
          rows={3}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
          }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Ask anything about your documents…"
          className="w-full bg-transparent px-5 pt-4 pb-2 text-[14px] text-white placeholder:text-white/35 resize-none outline-none overflow-hidden min-h-[72px]"
        />
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <button className="text-white/30 hover:text-white/55 transition-colors flex-shrink-0">
          <Paperclip size={17} />
        </button>
        {!large && (
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Ask anything about your documents…"
            className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/35 resize-none outline-none overflow-hidden min-h-[24px]"
          />
        )}
        {large && <div className="flex-1" />}
        <button
          onClick={onSend}
          disabled={isStreaming || !value.trim()}
          className={`h-[32px] w-[32px] rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            value.trim() && !isStreaming
              ? "bg-amber-500 text-black hover:opacity-85"
              : "bg-white/[0.08] text-white/25 cursor-not-allowed"
          }`}
        >
          {isStreaming
            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            : <Send size={13} />}
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

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setStreamingContent("");
    setStreamingMeta(null);
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

  const inChat = messages.length > 0;

  const SUGGESTIONS = [
    { icon: "📄", label: "Summarize my Q3 report" },
    { icon: "🔍", label: "Find key risks" },
    { icon: "📋", label: "List action items" },
    { icon: "💡", label: "What are the conclusions?" },
    { icon: "⚖️", label: "Compare two documents" },
    { icon: "🔗", label: "Extract all citations" },
  ];

  return (
    <div className="flex h-screen text-white p-2.5 gap-2.5 bg-black">

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <AppSidebar
        activeConvId={activeConvId}
        onConvSelect={setActiveConvId}
        onConvDelete={(id) => { if (id === activeConvId) { setActiveConvId(null); setMessages([]); setStreamingContent(""); setStreamingMeta(null); } }}
        onNewChat={handleNewChat}
        refreshKey={sidebarRefresh}
      />

      {/* ══════════ MAIN PANEL ══════════ */}
      <main
        className="flex-1 min-w-0 rounded-[18px] flex flex-col overflow-hidden relative"
        style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" style={{ filter: "blur(72px)" }} />

        {/* Content */}
        {inChat ? (
          <>
            <div className="relative z-10 flex-1 overflow-y-auto thin-scroll px-10 py-8 space-y-8 max-w-[740px] w-full mx-auto">
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

            <div className="relative z-10 flex-shrink-0 px-10 pb-5 pt-3 max-w-[740px] w-full mx-auto border-t border-white/[0.06]">
              <InputBox
                value={inputValue}
                onChange={setInputValue}
                onSend={() => handleSend()}
                isStreaming={isStreaming}
                textareaRef={textareaRef}
              />
            </div>
          </>
        ) : (
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
            <div className="w-full max-w-[600px] mx-auto">
              <div className="mb-8 animate-fu">
                <h1 className="text-[2.4rem] font-black text-white leading-[1.07] tracking-[-0.03em] mb-2.5">
                  What&apos;s on your mind today?
                </h1>
                <p className="text-[14px] text-white/75">
                  Ask anything — Paperwise searches your documents to find the answer.
                </p>
              </div>

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
                  <button
                    key={s.label}
                    onClick={() => { setInputValue(s.label); handleSend(s.label); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] text-white/85 border border-white/[0.15] hover:text-white hover:border-white/[0.28] hover:bg-white/[0.06] transition-all whitespace-nowrap"
                  >
                    <span className="text-[11px]">{s.icon}</span>
                    {s.label}
                  </button>
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
