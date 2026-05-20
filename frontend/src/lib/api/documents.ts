import apiClient from "@/lib/api-client";
import type { LibraryData, LibraryDoc, MessageResponse } from "@/types";

export const getLibrary = async (): Promise<LibraryData> => {
  const res = await apiClient.get("/v1/library");
  return res.data;
};

export const uploadFiles = async (files: File[]): Promise<LibraryDoc[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await apiClient.post("/v1/library/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.uploaded;
};

export const deleteDocument = async (id: number): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/v1/library/${id}`);
  return res.data;
};

export const clearLibrary = async (): Promise<MessageResponse> => {
  const res = await apiClient.delete("/v1/library/clear");
  return res.data;
};
