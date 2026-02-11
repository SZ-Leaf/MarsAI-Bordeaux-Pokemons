import React from "react";

export default function PlaylistCard({ playlist, count = 0, loading = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border ${playlist.borderClass} bg-zinc-900 
                  p-2 hover:scale-[1.02] transition
                  focus:outline-none focus:ring-2 focus:ring-white/20`}
    >
      <div className="flex items-center gap-2 mb-1">
        <i className={`${playlist.icon} text-lg`} />
        <h2 className="text-white font-semibold text-sm">{playlist.title}</h2>
      </div>

      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
        {playlist.description}
      </p>

      <div className="text-xs text-gray-300">
        {loading ? "Chargement…" : `${count} vidéo(s)`}
      </div>
    </button>
  );
}
