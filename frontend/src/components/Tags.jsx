import { useEffect, useMemo, useState } from "react";
import TagSelectCreate from "./TagSelectCreate";

const API = import.meta.env.VITE_API_URL; // ex: http://localhost:3000/api

export default function TagPickerContainer() {
  const [allTags, setAllTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(`${API}/api/tags/popular?limit=6`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message?.fr || "Erreur");
        setAllTags(json.data || []);
      } catch (e) {
        setMsg(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onTagCreated = (created) => {
    setAllTags((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      map.set(created.id, created);
      return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
    });
};


  if (loading) return <p>Chargement tags…</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Tags</h2>

      <TagSelectCreate
        allTags={allTags}
        value={selected}
        onChange={setSelected}
        onTagCreated={onTagCreated}
      />

      {msg && <p>{msg}</p>}

    </div>
  );
}
