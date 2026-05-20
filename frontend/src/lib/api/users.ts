import apiClient from "@/lib/api-client";
import type { MessageResponse, Usage, User } from "@/types";

export const updateProfile = async (full_name: string): Promise<User> => {
  const res = await apiClient.patch("/v1/users/me", { full_name });
  return res.data;
};

export const changePassword = async (current_password: string, new_password: string): Promise<MessageResponse> => {
  const res = await apiClient.patch("/v1/users/me/password", { current_password, new_password });
  return res.data;
};

export const deleteAccount = async (): Promise<MessageResponse> => {
  const res = await apiClient.delete("/v1/users/me", { data: { confirmation: "DELETE" } });
  return res.data;
};

export const getUsage = async (): Promise<Usage> => {
  const res = await apiClient.get("/v1/users/me/usage");
  return res.data;
};

export const completeOnboarding = async (): Promise<MessageResponse> => {
  const res = await apiClient.post("/v1/users/me/onboarding-complete");
  return res.data;
};
