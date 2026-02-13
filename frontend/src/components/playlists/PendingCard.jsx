import React from "react";

export default function PendingCard({ total = 0, loading = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        text-left w-full rounded-xl border border-yellow-500
        bg-zinc-900/60 hover:bg-zinc-900
        px-5 py-4
        transition
        hover:border-zinc-600
        focus:outline-none focus:ring-2 focus:ring-white/20
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-white font-semibold text-lg truncate">
            À traiter
          </div>
        </div>

        <div className="shrink-0 text-gray-300">
          <i className="pi pi-exclamation-triangle text-xl" />
        </div>
      </div>

      {/* Main metric */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-4xl font-semibold text-white leading-none tracking-tight">
          {loading ? "…" : total}
        </div>

        <div className="text-sm text-gray-400 pb-1">
          vidéo(s)
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 text-sm text-gray-400 line-clamp-2">
        Vidéos non notées, non commentées, non ajoutées à une playlist.
      </div>
    </button>
  );
}
