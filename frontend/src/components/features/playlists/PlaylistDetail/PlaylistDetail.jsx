import React, { useMemo } from "react";
import { useParams } from "react-router";
import { usePlaylists } from "../../../../helpers/playlistHelper.js";
import { usePlaylist } from "../../../../hooks/usePlaylist.js";
import PlaylistSubmissionCard from "../PlaylistSubmissionCard/PlaylistSubmissionCard.jsx";

export default function PlaylistDetail({ listKey }) {
  const params = useParams();
  const list = listKey ?? params.list;
  const playlists = usePlaylists();

  const meta = useMemo(
    () => (list ? playlists.find((p) => p.key === list) : null),
    [list, playlists]
  );
  const { submissions, loading, error } = usePlaylist(list || "");

  // gestion erreur 
  if (!list) {
    return (
      <section className="space-y-6">
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          Playlist inconnue.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <header className="flex items-start justify-between gap-6 mb-4">
        <div>
          <h1 className="mt-2 text-2xl text-white font-semibold flex items-center gap-2">
            {meta && <i className={meta.icon} />}
            {meta?.title || "Playlist"}
          </h1>

          {meta?.description && (
            <p className="text-sm text-gray-400">{meta.description}</p>
          )}
        </div>

        <div className="text-sm text-gray-300">
          {loading ? "…" : `${submissions.length} vidéo(s)`}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Chargement…</div>
      ) : submissions.length === 0 ? (
        <div className="text-gray-400">Aucune vidéo dans cette playlist.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {submissions.map((s) => (
            <PlaylistSubmissionCard key={s.id} submission={s} />
          ))}
        </div>
      )}
    </section>
  );
}
