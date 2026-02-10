import React, { useEffect, useState } from "react";
import "./tags.css";
import TagSelectCreatable from "./TagSelectCreate";

const API = import.meta.env.VITE_API_URL;

export default function Tag({
  variant = "dark",
  status = null,
  value = [],
  onChange = () => {},
}) {
  const [allTags, setAllTags] = useState([]);
  // const [selected, setSelected] = useState([]);
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

  // Éventuellement une callback pour mettre à jour les tags quand un nouveau tag est créé
  const onTagCreated = (created) => {
    setAllTags((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      map.set(created.id, created);
      return Array.from(map.values()).sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    });
  };

  if (loading) {
    return <p>Chargement tags…</p>;
  }

  return (
    <div className="tag-input-container flex flex-col gap-4">
      <TagSelectCreatable
        allTags={allTags}
        value={value}
        onChange={onChange}
        onTagCreated={onTagCreated}
      />
      <div className="tag-input-container">
        {/* Affichage du statut (tag spécial) */}
        {status && (
          <div className="status-section">
            <div className={`tag tag-status tag-${variant}`}>{status}</div>
          </div>
        )}

        {/* Message d'erreur / info */}
        {msg && <p>{msg}</p>}

        {/* Affichage des tags récupérés depuis l'API */}
        {allTags.length > 0 && (
          <div className="tags-section">
            <div className="tags-list">
              {allTags.map((tag) => (
                <div key={tag.id} className={`tag tag-${variant}`}>
                  {tag.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
