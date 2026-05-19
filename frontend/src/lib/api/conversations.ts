import apiClient from "@/lib/api-client";
import type { Conversation, Message } from "@/types";

export const getConversations = async (): Promise<Conversation[]> => {
  const res = await apiClient.get("/v1/conversations");
  return res.data;
};

export const createConversation = async (title = "New conversation"): Promise<Conversation> => {
  const res = await apiClient.post("/v1/conversations", { title });
  return res.data;
};

export const renameConversation = async (id: number, title: string): Promise<Conversation> => {
  const res = await apiClient.patch(`/v1/conversations/${id}`, { title });
  return res.data;
};

export const deleteConversation = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/conversations/${id}`);
};

export const getMessages = async (id: number): Promise<Message[]> => {
  const res = await apiClient.get(`/v1/conversations/${id}/messages`);
  return res.data;
};
