import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function usePlaylistCounts() {
  const [counts, setCounts] = useState({
    favorites: 0,
    watch_later: 0,
    report: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/selector/playlists`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message_fr || "Erreur chargement playlists");
        }

        if (!cancelled) {
          setCounts({
            favorites: Number(data?.data?.favorites ?? 0),
            watch_later: Number(data?.data?.watch_later ?? 0),
            report: Number(data?.data?.report ?? 0),
          });
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
  }, []);

  return { counts, loading, error };
}
