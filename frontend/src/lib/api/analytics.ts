import apiClient from "@/lib/api-client";
import type { AnalyticsOverview, CitedDoc, QueryVolumePoint } from "@/types";

export type { AnalyticsOverview, CitedDoc, QueryVolumePoint };

export const getOverview = async (): Promise<AnalyticsOverview> => {
  const res = await apiClient.get("/v1/analytics/overview");
  return res.data;
};

export const getQueryVolume = async (days = 30): Promise<QueryVolumePoint[]> => {
  const res = await apiClient.get("/v1/analytics/queries", { params: { days } });
  return res.data;
};

export const getTopCitations = async (): Promise<CitedDoc[]> => {
  const res = await apiClient.get("/v1/analytics/citations");
  return res.data;
};

export const setFeedback = async (messageId: number, value: "up" | "down"): Promise<void> => {
  await apiClient.post(`/v1/analytics/messages/${messageId}/feedback`, { value });
};

export const getFeedbacks = async (messageIds: number[]): Promise<Record<number, "up" | "down">> => {
  if (messageIds.length === 0) return {};
  const res = await apiClient.get("/v1/analytics/messages/feedbacks", {
    params: { message_ids: messageIds.join(",") },
  });
  return res.data;
};
