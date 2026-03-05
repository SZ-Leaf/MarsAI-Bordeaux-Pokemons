import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../services/api"; // adapte

export function useAdminReportedCount({ limit = 200, offset = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/api/selector/admin/reported?limit=${limit}&offset=${offset}`);

      // compat sendSuccess: { success, data }
      const data = res?.data?.data ?? res?.data ?? [];
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