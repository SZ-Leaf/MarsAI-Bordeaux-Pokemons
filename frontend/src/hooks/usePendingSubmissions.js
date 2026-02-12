import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function usePendingSubmissions({ limit = 24, offset = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${API}/api/selector/submissions/pending?limit=${limit}&offset=${offset}`;
        const res = await fetch(url, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          // au cas où le backend renvoie du HTML
        }

        if (!res.ok) {
          throw new Error(
            json?.message?.fr || json?.message_fr || json?.message || `HTTP ${res.status}`
          );
        }

        if (!cancelled) {
          const payload = json?.data; // ✅ { data: [...], total: 12 }
          setItems(Array.isArray(payload?.data) ? payload.data : []);
          setTotal(Number(payload?.total) || 0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit, offset]);

  return { items, total, loading, error };
}
