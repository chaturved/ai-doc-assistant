"use client";

import { useCallback, useRef, useState } from "react";
import { sseClient } from "@/lib/api-client";
import type { Meta } from "@/types";

interface StreamState {
  content: string;
  meta: Meta | null;
  isStreaming: boolean;
  error: string | null;
}

const INITIAL: StreamState = { content: "", meta: null, isStreaming: false, error: null };

export function useSSEStream(onDone?: (content: string, meta: Meta | null) => void) {
  const [state, setState] = useState<StreamState>(INITIAL);
  const accumulated = useRef({ content: "", meta: null as Meta | null });

  const send = useCallback(
    async (conversationId: number, question: string) => {
      accumulated.current = { content: "", meta: null };
      setState({ content: "", meta: null, isStreaming: true, error: null });

      try {
        await sseClient(`/v1/conversations/${conversationId}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, filters: null, top_k: 5 }),
          onmessage(ev) {
            if (ev.data === "[DONE]") {
              setState((prev) => ({ ...prev, isStreaming: false }));
              onDone?.(accumulated.current.content, accumulated.current.meta);
              return;
            }
            if (ev.event === "error") {
              setState((prev) => ({ ...prev, isStreaming: false, error: "AI response failed" }));
              return;
            }
            try {
              const parsed = JSON.parse(ev.data);
              accumulated.current = {
                meta: parsed.meta ?? accumulated.current.meta,
                content: parsed.token ? accumulated.current.content + parsed.token : accumulated.current.content,
              };
              setState((prev) => ({ ...prev, meta: accumulated.current.meta, content: accumulated.current.content }));
            } catch {
              /* ignore parse errors */
            }
          },
          onerror() {
            setState((prev) => ({ ...prev, isStreaming: false }));
          },
        });
      } catch {
        setState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [onDone]
  );

  const reset = useCallback(() => {
    setState(INITIAL);
  }, []);

  return { ...state, send, reset };
}
