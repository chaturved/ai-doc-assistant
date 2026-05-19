"use client";

import { useCallback, useState } from "react";
import {
  getConversations,
  createConversation,
  deleteConversation,
  renameConversation,
  getMessages,
} from "@/lib/api/conversations";
import type { Conversation, Message } from "@/types";

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await getConversations());
    } catch {
      /* silent */
    }
  }, []);

  const loadMessages = useCallback(async (id: number) => {
    try {
      setMessages(await getMessages(id));
    } catch {
      setMessages([]);
    }
  }, []);

  const selectConversation = useCallback(
    async (id: number | null) => {
      setActiveId(id);
      if (id) await loadMessages(id);
      else setMessages([]);
    },
    [loadMessages]
  );

  const newConversation = useCallback(async () => {
    const conv = await createConversation();
    await loadConversations();
    setActiveId(conv.id);
    setMessages([]);
    return conv;
  }, [loadConversations]);

  const removeConversation = useCallback(
    async (id: number) => {
      await deleteConversation(id);
      await loadConversations();
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
    },
    [activeId, loadConversations]
  );

  const rename = useCallback(
    async (id: number, title: string) => {
      await renameConversation(id, title);
      await loadConversations();
    },
    [loadConversations]
  );

  return {
    conversations,
    messages,
    activeId,
    setActiveId,
    setMessages,
    loadConversations,
    selectConversation,
    newConversation,
    removeConversation,
    rename,
  };
}
