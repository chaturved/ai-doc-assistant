"use client";

import { useCallback, useState } from "react";
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

  const send = useCallback(
    async (conversationId: number, question: string) => {
      setState({ content: "", meta: null, isStreaming: true, error: null });

      try {
        await sseClient(`/v1/conversations/${conversationId}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, filters: null, top_k: 5 }),
          onmessage(ev) {
            if (ev.data === "[DONE]") {
              setState((prev) => {
                onDone?.(prev.content, prev.meta);
                return { ...prev, isStreaming: false };
              });
              return;
            }
            if (ev.event === "error") {
              setState((prev) => ({ ...prev, isStreaming: false, error: "AI response failed" }));
              return;
            }
            try {
              const parsed = JSON.parse(ev.data);
              setState((prev) => ({
                ...prev,
                meta: parsed.meta ?? prev.meta,
                content: parsed.token ? prev.content + parsed.token : prev.content,
              }));
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
