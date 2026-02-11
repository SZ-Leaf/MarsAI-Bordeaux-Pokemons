import React, { useMemo } from "react";
import { Link, useParams } from "react-router";
import { PLAYLISTS } from "../helpers/playlistHelper";
import { usePlaylist } from "../hooks/usePlaylist";

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);

  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

export default function PlaylistDetail() {
  const { list } = useParams(); // favorites | watch_later | report
  const meta = useMemo(() => PLAYLISTS.find((p) => p.key === list), [list]);

  const { items, loading, error } = usePlaylist(list);

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <Link to="/playlists" className="text-sm text-gray-400 hover:text-white">
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
          {items.map((s) => {
            const title =
              s.original_title?.trim() ||
              s.english_title?.trim() ||
              `Vidéo #${s.id}`;

            const duration = formatDuration(s.duration_seconds);

            // Tu as potentiellement video_url (local) ou youtube_URL
            const videoHref = s.video_url || s.youtube_URL || null;

            return (
              <li
                key={s.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex gap-4"
              >
                {/* Cover */}
                <div className="w-36 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {s.cover ? (
                    <img
                      src={s.cover}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <i className="pi pi-image" />
                    </div>
                  )}

                  {duration && (
                    <div className="absolute bottom-2 right-2 text-[11px] px-2 py-0.5 rounded bg-black/60 text-white">
                      {duration}
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-white font-semibold line-clamp-1">
                        {title}
                      </div>

                    </div>

                    {videoHref && (
                      <a
                        href={videoHref}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-xs px-3 py-1.5 rounded bg-zinc-800 text-gray-200 hover:bg-zinc-700"
                      >
                        Ouvrir
                      </a>
                    )}
                  </div>

                  {/* Meta ligne */}
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-400">
                    {s.language && (
                      <span className="px-2 py-0.5 rounded bg-zinc-800">
                        {s.language}
                      </span>
                    )}
                    {s.classification && (
                      <span className="px-2 py-0.5 rounded bg-zinc-800">
                        {s.classification}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="mt-2 text-xs text-gray-500">
                    {s.created_at
                      ? `Ajoutée le ${new Date(s.created_at).toLocaleString()}`
                      : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
