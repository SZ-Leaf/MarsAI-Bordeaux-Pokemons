import React from "react";

export default function PendingCard({ total = 0, loading = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border border-zinc-800 bg-zinc-900 
                  p-2 hover:scale-[1.02] transition
                  focus:outline-none focus:ring-2 focus:ring-white/20`}
    >
      <div className="flex items-center gap-2 mb-1">
        <i className="pi pi-clock text-lg" />
        <h2 className="text-white font-semibold text-sm">À traiter</h2>
      </div>

      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
        Vidéos non notées, non commentées, non ajoutées à une playlist.
      </p>

      <div className="text-xs text-gray-300">
        {loading ? "Chargement…" : `${total} vidéo(s)`}
      </div>
    </button>
  );
}
