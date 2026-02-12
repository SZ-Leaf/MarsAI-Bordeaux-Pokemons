import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { PLAYLISTS } from "../helpers/playlistHelper.js";
import { usePlaylistCounts } from "../hooks/usePlaylistCounts";
import {usePendingSubmissions} from "../hooks/usePendingSubmissions";
import PlaylistCard from "../components/playlists/PlaylistCard.jsx";
import PendingCard from "../components/playlists/PendingCard.jsx";


export default function SelectorDashboard() {
  const navigate = useNavigate();
  const { counts, loading, error } = usePlaylistCounts();

    const {
    total: pendingTotal,
    loading: pendingLoading,
    error: pendingError
  } = usePendingSubmissions({ limit: 1, offset: 0 });

  const total = useMemo(() => {
    if (!counts) return 0;
    return Object.values(counts).reduce((acc, n) => acc + (Number(n) || 0), 0);
  }, [counts]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Selector Dashboard</h1>
          <p className="text-sm text-gray-400">
            Gestion rapide des playlists et accès aux sélections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-gray-300">
            {loading ? "…" : `${total} vidéo(s) au total`}
          </div>
        </div>
      </header>

      {/* Error */}
      {(error || pendingError) && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {error || pendingError}
        </div>
      )}


      {/* Playlists */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Playlists</h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLAYLISTS.map((p) => (
            <PlaylistCard
              key={p.key}
              playlist={p}
              loading={loading}
              count={counts?.[p.key] ?? 0}
              onClick={() => navigate(`/playlist/${p.key}`)}
            />
          ))}
        </div>
      </div>

      {/* (Optionnel) Bloc raccourcis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <PendingCard
          total={pendingTotal}
          loading={pendingLoading}
          onClick={() => navigate("/selector/pending")}
        />
      </div>
    </section>
  );
}

function QuickAction({ title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 transition"
    >
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-gray-400 mt-1">{desc}</div>
    </button>
  );
}
