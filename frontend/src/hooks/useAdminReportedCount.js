import { useEffect, useState, useMemo, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;

export function useAdminReportedCount({ limit = 200, offset = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API}/api/selector/admin/reported?limit=${limit}&offset=${offset}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      const data = json?.data ?? json ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalVideos = useMemo(() => items.length, [items]);

  const totalReports = useMemo(
    () => items.reduce((acc, r) => acc + (Number(r.report_count) || 0), 0),
    [items]
  );

  return { totalVideos, totalReports, loading, error, refresh: fetchList };
}