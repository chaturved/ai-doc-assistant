"use client";

import { useCallback, useEffect, useState } from "react";
import { getLibrary, uploadFiles, deleteDocument, clearLibrary } from "@/lib/api/documents";
import type { LibraryData } from "@/types";

export function useLibrary() {
  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getLibrary());
      setError(null);
    } catch {
      setError("Failed to load library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (files: File[]) => {
      await uploadFiles(files);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteDocument(id);
      await refresh();
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    await clearLibrary();
    await refresh();
  }, [refresh]);

  return { data, loading, error, refresh, upload, remove, clear };
}
