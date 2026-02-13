import React from "react";

export default function PlaylistCard({
  playlist,
  count = 0,
  loading = false,
  onClick,
  isActive = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        cursor-pointer
        text-left w-full rounded-xl border
        bg-zinc-950/40
        px-5 py-4
        transition
        focus:outline-none focus:ring-2 focus:ring-white/20
        ${playlist.hoverClass}
        ${playlist.borderClass}
        ${
          isActive
            ? `ring-2 ring-white/10 shadow-lg ${playlist.glowClass}`
            : "hover:border-zinc-600"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-white font-semibold text-lg truncate">
            {playlist.title}
          </div>
        </div>

        {/* icône en accent */}
        <div className={`shrink-0 ${playlist.accentClass ?? "text-gray-300"}`}>
          <i className={`${playlist.icon} text-xl`} />
        </div>
      </div>

      {/* Main metric */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-4xl font-semibold text-white leading-none tracking-tight">
          {loading ? "…" : count}
        </div>

        <div className="text-sm text-gray-400 pb-1">vidéo(s)</div>
      </div>

      {/* Description */}
      <div className="mt-3 text-sm text-gray-400 line-clamp-2">
        {playlist.description}
      </div>

      {/* petit accent en bas (optionnel mais très joli) */}
      <div
        className={`mt-4 h-1 w-12 rounded-full opacity-40 ${
          playlist.accentBarClass ?? "bg-white/10"
        }`}
      />
    </button>
  );
}
