import { useState } from "react";
import { uploadFiles } from "@/lib/api/documents";
import type { UploadResult } from "@/types";

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (files: File[]): Promise<UploadResult> => {
    setUploading(true);
    try {
      return await uploadFiles(files);
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
