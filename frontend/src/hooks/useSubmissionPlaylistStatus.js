import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function useSubmissionPlaylistStatus(submissionId) {
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/selector/playlist/status/${submissionId}`, {
        credentials: "include",
      });
      const json = await response.json();
      const data = json?.data ?? json;
      setSelection(data?.selection_list ?? null);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const setStatus = useCallback(async (next) => {
    setSelection(next);
    const response = await fetch(`${API}/api/selector/playlist/status/${submissionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ selection_list: next }),
    });
    const json = await response.json();
    const data = json?.data ?? json;
    setSelection(data?.selection_list ?? next);
  }, [submissionId]);

  const clearStatus = useCallback(async () => {
    setSelection(null);
    await fetch(`${API}/api/selector/playlist/status/${submissionId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setSelection(null);
  }, [submissionId]);

  const toggle = useCallback(async (key) => {
    if (selection === key) return clearStatus();
    return setStatus(key);
  }, [selection, clearStatus, setStatus]);

  return { selection, loading, toggle, refetch: fetchStatus };
}
