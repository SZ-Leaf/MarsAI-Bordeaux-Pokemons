import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

const ALLOWED = new Set(["favorites", "watch_later", "report"]);

export function usePlaylist(listKey) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("listKey:", listKey);
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!ALLOWED.has(listKey)) {
        setLoading(false);
        setError("Playlist inconnue.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API}/api/selector/playlist/${listKey}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message_fr || "Erreur chargement playlist");
        }

        if (!cancelled) {
          setItems(Array.isArray(data?.data) ? data.data : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [listKey]);

  return { items, loading, error };
}
