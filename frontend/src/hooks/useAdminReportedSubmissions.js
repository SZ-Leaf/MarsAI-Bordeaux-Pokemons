import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function useAdminReportedSubmissions({ limit, offset, enabled }) {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API}/api/selector/admin/reported?limit=${limit}&offset=${offset}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        const data = json?.data ?? json ?? [];
        const list = Array.isArray(data) ? data : data?.submissions ?? [];

        const normalizedList = list.map((item) => ({
          ...item,
          id: item.id ?? item.submission_id,
          title: item.title ?? item.submission_title ?? "Sans titre",
          cover: item.cover ?? item.thumbnail_url ?? item.poster ?? null,
          thumbnail_url: item.thumbnail_url ?? item.cover ?? null,
        }));

        setSubmissions(normalizedList);
        setTotal(normalizedList.length);
      } catch (e) {
        console.error("useAdminReportedSubmissions error:", e);
        setSubmissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, offset, enabled]);

  return { submissions, total, loading };
}