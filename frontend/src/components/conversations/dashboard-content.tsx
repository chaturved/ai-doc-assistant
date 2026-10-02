"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppLayout } from "@/context/AppLayoutContext";
import { useSSEStream } from "@/hooks/useSSEStream";
import { createConversation, getMessages } from "@/lib/api/conversations";
import type { Message } from "@/types";
import { AIMessage } from "./ai-message";
import { InputBox } from "./input-box";
import { DashboardWelcome } from "./dashboard-welcome";
import { UserMessage } from "./user-message";

function DashboardInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setSidebarCallbacks } = useAppLayout();

  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [inputValue, setInputValue]     = useState("");
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [initialQuestion] = useState(() => params.get("q"));

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

  const handleConvDelete = useCallback((id: number) => {
    if (id === activeConvId) {
      setActiveConvId(null);
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    setSidebarCallbacks({
      activeConvId,
      onConvSelect: setActiveConvId,
      onConvDelete: handleConvDelete,
      onNewChat: handleNewChat,
      refreshKey: sidebarRefresh,
    });
  }, [activeConvId, sidebarRefresh, setSidebarCallbacks, handleNewChat, handleConvDelete]);

  const handleSend = useCallback(async (question?: string) => {
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
  }, [activeConvId, inputValue, isStreaming, sendStream]);

  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;
  const hasSentInitialQuestion = useRef(false);

  useEffect(() => {
    if (initialQuestion && !hasSentInitialQuestion.current) {
      hasSentInitialQuestion.current = true;
      router.replace("/dashboard");
      handleSendRef.current(initialQuestion);
    }
  }, [initialQuestion, router]);

  const inChat = messages.length > 0;

  return (
    <main
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-ink/10 bg-bg"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink/10 px-5 text-xs font-medium text-ink/55 sm:px-8"><span>Workspace <span className="mx-2 text-ink/25">/</span> Chat</span><span className="flex items-center gap-2 text-ink/45"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Paperwise</span></div>

      {inChat ? (
        <>
          <div className="thin-scroll relative z-10 mx-auto w-full max-w-[740px] flex-1 space-y-8 overflow-y-auto px-4 py-6 sm:px-10 sm:py-8">
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

          <div className="border-t-system relative z-10 mx-auto w-full max-w-[740px] flex-shrink-0 px-4 pb-5 pt-3 sm:px-10">
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
        <DashboardWelcome
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isStreaming={isStreaming}
          textareaRef={textareaRef}
        />
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
