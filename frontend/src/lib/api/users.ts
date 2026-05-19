import apiClient from "@/lib/api-client";
import type { Usage, User } from "@/types";

export const updateProfile = async (full_name: string): Promise<User> => {
  const res = await apiClient.patch("/v1/users/me", { full_name });
  return res.data;
};

export const changePassword = async (current_password: string, new_password: string): Promise<void> => {
  await apiClient.patch("/v1/users/me/password", { current_password, new_password });
};

export const deleteAccount = async (): Promise<void> => {
  await apiClient.delete("/v1/users/me", { data: { confirmation: "DELETE" } });
};

export const getUsage = async (): Promise<Usage> => {
  const res = await apiClient.get("/v1/users/me/usage");
  return res.data;
};

export const completeOnboarding = async (): Promise<void> => {
  await apiClient.post("/v1/users/me/onboarding-complete");
};
