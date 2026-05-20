"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppLayout } from "@/context/AppLayoutContext";
import { useSSEStream } from "@/hooks/useSSEStream";
import { createConversation, getMessages } from "@/lib/api/conversations";
import type { Message } from "@/types";
import { AIMessage } from "./ai-message";
import { InputBox } from "./input-box";
import { UserMessage } from "./user-message";

const SUGGESTIONS = [
  { icon: "📄", label: "Summarize my Q3 report" },
  { icon: "🔍", label: "Find key risks" },
  { icon: "📋", label: "List action items" },
  { icon: "💡", label: "What are the conclusions?" },
  { icon: "⚖️", label: "Compare two documents" },
  { icon: "🔗", label: "Extract all citations" },
];

function DashboardInner() {
  const params = useSearchParams();
  const { setSidebarCallbacks } = useAppLayout();

  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [inputValue, setInputValue]     = useState("");
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onStreamDone = useCallback((content: string, meta: Message["meta"]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", content, meta, created_at: new Date().toISOString() },
    ]);
    setSidebarRefresh((v) => v + 1);
  }, []);

  const { content: streamingContent, meta: streamingMeta, isStreaming, send: sendStream } = useSSEStream(onStreamDone);

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

  const handleNewChat = useCallback(() => {
    setActiveConvId(null);
    setMessages([]);
  }, []);

  useEffect(() => {
    setSidebarCallbacks({
      activeConvId,
      onConvSelect: setActiveConvId,
      onConvDelete: (id: number) => {
        if (id === activeConvId) {
          setActiveConvId(null);
          setMessages([]);
        }
      },
      onNewChat: handleNewChat,
      refreshKey: sidebarRefresh,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId, sidebarRefresh]);

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
      } catch {
        toast.error("Failed to start conversation");
        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: q, meta: null, created_at: new Date().toISOString() },
    ]);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    await sendStream(convId, q);
  };

  const inChat = messages.length > 0;

  return (
    <main
      className="flex-1 min-w-0 rounded-[18px] flex flex-col overflow-hidden relative"
      style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" style={{ filter: "blur(72px)" }} />

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

          <div className="relative z-10 flex-shrink-0 px-10 pb-5 pt-3 max-w-[740px] w-full mx-auto border-t-system">
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
  );
}

export default function DashboardContent() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  );
}
