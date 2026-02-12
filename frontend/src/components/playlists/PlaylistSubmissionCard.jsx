import React from "react";

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default function PlaylistSubmissionCard({
  submission,
  showSynopsis = false,
  actionLabel = "Ouvrir",
  variant = "default", // 🔥 nouveau
}) {
  const compact = variant === "compact";

  const s = submission;

  const title =
    s.original_title?.trim() ||
    s.english_title?.trim() ||
    `Vidéo #${s.id}`;

  const duration = formatDuration(Number(s.duration_seconds));
  const videoHref = s.video_url || s.youtube_URL || null;

  return (
    <li
      className={`
        rounded-xl border border-zinc-800 bg-zinc-900 flex gap-3
        ${compact ? "p-2" : "p-4"}
      `}
    >
      {/* Cover */}
      <div
        className={`
          aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative
          ${compact ? "w-28" : "w-36"}
        `}
      >
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
          <div
            className={`
              absolute bottom-1 right-1 rounded bg-black/60 text-white
              ${compact ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5"}
            `}
          >
            {duration}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={`
                text-white font-semibold line-clamp-1
                ${compact ? "text-sm" : "text-base"}
              `}
            >
              {title}
            </div>

            {!compact && showSynopsis && (s.original_synopsis || s.english_synopsis) && (
              <div className="text-sm text-gray-400 line-clamp-2 mt-1">
                {s.original_synopsis?.trim() || s.english_synopsis?.trim()}
              </div>
            )}
          </div>

          {videoHref && (
            <a
              href={videoHref}
              target="_blank"
              rel="noreferrer"
              className={`
                shrink-0 rounded bg-zinc-800 text-gray-200 hover:bg-zinc-700
                ${compact ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5"}
              `}
            >
              {actionLabel}
            </a>
          )}
        </div>

        {/* Meta ligne */}
        <div
          className={`
            flex flex-wrap gap-1 text-gray-400 mt-1
            ${compact ? "text-[10px]" : "text-[11px] mt-2"}
          `}
        >
          {s.language && (
            <span className="px-2 py-0.5 rounded bg-zinc-800">{s.language}</span>
          )}
          {s.classification && (
            <span className="px-2 py-0.5 rounded bg-zinc-800">
              {s.classification}
            </span>
          )}
        </div>

        {!compact && (
          <div className="mt-2 text-xs text-gray-500">
            {s.created_at
              ? `Ajoutée le ${new Date(s.created_at).toLocaleString()}`
              : null}
          </div>
        )}
      </div>
    </li>
  );
}
