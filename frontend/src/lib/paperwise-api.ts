import api from "./api";
import type { Conversation, LibraryData, Message, Usage, User } from "./types";

// Auth
export const getMe = async (): Promise<User> => {
  const res = await api.get("/v1/auth/me");
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const params = new URLSearchParams({ username: email, password });
  const res = await api.post("/v1/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data.user;
};

export const signup = async (email: string, password: string, full_name: string): Promise<User> => {
  const res = await api.post("/v1/auth/signup", { email, password, full_name });
  return res.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post("/v1/auth/logout");
};

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post("/v1/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, new_password: string): Promise<void> => {
  await api.post("/v1/auth/reset-password", { token, new_password });
};

export const sendMagicLink = async (email: string): Promise<void> => {
  await api.post("/v1/auth/magic-link", { email });
};

// Users
export const updateProfile = async (full_name: string): Promise<User> => {
  const res = await api.patch("/v1/users/me", { full_name });
  return res.data;
};

export const changePassword = async (current_password: string, new_password: string): Promise<void> => {
  await api.patch("/v1/users/me/password", { current_password, new_password });
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete("/v1/users/me", { data: { confirmation: "DELETE" } });
};

export const getUsage = async (): Promise<Usage> => {
  const res = await api.get("/v1/users/me/usage");
  return res.data;
};

export const completeOnboarding = async (): Promise<void> => {
  await api.post("/v1/users/me/onboarding-complete");
};

// Conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await api.get("/v1/conversations");
  return res.data;
};

export const createConversation = async (title = "New conversation"): Promise<Conversation> => {
  const res = await api.post("/v1/conversations", { title });
  return res.data;
};

export const renameConversation = async (id: number, title: string): Promise<Conversation> => {
  const res = await api.patch(`/v1/conversations/${id}`, { title });
  return res.data;
};

export const deleteConversation = async (id: number): Promise<void> => {
  await api.delete(`/v1/conversations/${id}`);
};

export const getMessages = async (id: number): Promise<Message[]> => {
  const res = await api.get(`/v1/conversations/${id}/messages`);
  return res.data;
};

// Library
export const getLibrary = async (): Promise<LibraryData> => {
  const res = await api.get("/v1/library");
  return res.data;
};

export const uploadFiles = async (files: File[]): Promise<LibraryData["sections"]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await api.post("/v1/library/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.uploaded;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/v1/library/${id}`);
};

export const clearLibrary = async (): Promise<void> => {
  await api.delete("/v1/library/clear");
};

// Misc
export const joinWaitlist = async (email: string): Promise<void> => {
  await api.post("/v1/waitlist", { email });
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
