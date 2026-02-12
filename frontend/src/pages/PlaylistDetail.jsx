import React, { useMemo } from "react";
import { Link, useParams } from "react-router";
import { PLAYLISTS } from "../helpers/playlistHelper";
import { usePlaylist } from "../hooks/usePlaylist";
import PlaylistSubmissionCard from "../components/playlists/PlaylistSubmissionCard.jsx";

export default function PlaylistDetail() {
  const { list } = useParams();
  const meta = useMemo(() => PLAYLISTS.find((p) => p.key === list), [list]);

  const { items, loading, error } = usePlaylist(list);

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <Link to="/selector/dashboard" className="text-sm text-gray-400 hover:text-white">
            Retour
          </Link>

          <h1 className="mt-2 text-2xl text-white font-semibold flex items-center gap-2">
            {meta && <i className={meta.icon} />}
            {meta?.title || "Playlist"}
          </h1>

          {meta?.description && (
            <p className="text-sm text-gray-400">{meta.description}</p>
          )}
        </div>

        <div className="text-sm text-gray-300">
          {loading ? "…" : `${items.length} vidéo(s)`}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-400">Aucune vidéo dans cette playlist.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <PlaylistSubmissionCard key={s.id} submission={s} />
          ))}
        </ul>
      )}
    </section>
  );
}
