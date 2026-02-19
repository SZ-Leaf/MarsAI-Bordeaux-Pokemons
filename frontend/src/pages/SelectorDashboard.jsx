import React, { useMemo, useState, useRef, useEffect } from "react";
import { usePlaylists } from "../helpers/playlistHelper.js";
import { usePlaylistCounts } from "../hooks/usePlaylistCounts";
import { usePendingSubmissions } from "../hooks/usePendingSubmissions";
import { PlaylistCard, PlaylistDetail, PendingCard, PendingDetail } from "../components/features/playlists";

export default function SelectorDashboard() {
  const playlists = usePlaylists();
  const { counts, loading, error } = usePlaylistCounts();
  //  un seul état pour ce qui est ouvert en bas (playlists et pending)
  const [openPanel, setOpenPanel] = useState(null);
  const detailRef = useRef(null);

  const {
    total: pendingTotal,
    loading: pendingLoading,
    error: pendingError
  } = usePendingSubmissions({ limit: 1, offset: 0 });

  const total = useMemo(() => {
    if (!counts) return 0;
    return Object.values(counts).reduce((acc, n) => acc + (Number(n) || 0), 0);
  }, [counts]);


  useEffect(() => {
    if (openPanel && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [openPanel]);

  const selectedPlaylist = useMemo(() => {
    if (!openPanel || openPanel.type !== "playlist") return null;
    return playlists.find((p) => p.key === openPanel.key) || null;
  }, [openPanel, playlists]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      {(error || pendingError) && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {error || pendingError}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex items-center justify-between mb-3 gap-6">
            <div>
              <h2 className="text-white text-3xl font-semibold">
                Playlists & Évaluation
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Cliquer sur la playlist correspondante pour afficher le contenu
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-gray-300">
              {loading ? "…" : `${total} vidéo(s) au total`}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {playlists.map((p) => {
              const isActive = openPanel?.type === "playlist" && openPanel.key === p.key;

              return (
                <PlaylistCard
                  key={p.key}
                  playlist={p}
                  loading={loading}
                  count={counts?.[p.key] ?? 0}
                  isActive={isActive}
                  onClick={() =>
                    setOpenPanel((prev) =>
                      prev?.type === "playlist" && prev.key === p.key
                        ? null
                        : { type: "playlist", key: p.key }
                    )
                  }
                />
              );
            })}

            <PendingCard
              total={pendingTotal}
              loading={pendingLoading}
              isActive={openPanel?.type === "pending"}
              onClick={() =>
                setOpenPanel((prev) => (prev?.type === "pending" ? null : { type: "pending" }))
              }
            />
          </div>
        </div>

        {/*  zone détail en bas */}
        {openPanel && (
          <div ref={detailRef} className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-2xl font-semibold">
                {openPanel.type === "pending"
                  ? "À Evaluer"
                  : `Détail : ${
                      selectedPlaylist?.title ?? selectedPlaylist?.name ?? selectedPlaylist?.key
                    }`}
              </h3>

              <button
                type="button"
                onClick={() => setOpenPanel(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-gray-200 hover:border-zinc-600"
              >
                Fermer
              </button>
            </div>

            {openPanel.type === "pending" ? (
              <PendingDetail />
            ) : (
              <PlaylistDetail listKey={openPanel.key} onBack={() => setOpenPanel(null)} />

            )}
          </div>
        )}
      </div>
    </section>
  );
}
