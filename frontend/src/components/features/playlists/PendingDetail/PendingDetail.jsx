import React from "react";
import { usePendingSubmissions } from "../../../../hooks/usePendingSubmissions";
import PlaylistSubmissionCard from "../PlaylistSubmissionCard/PlaylistSubmissionCard.jsx"

export default function PendingDetail() {
  const {
    submissions,
    total,
    loading,
    error
  } = usePendingSubmissions({ limit: 24, offset: 0 });

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 text-gray-300">
        Chargement des vidéos en attente…
      </div>
    );
  }
  //gestion erreurs
  if (error) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/40 p-6 text-red-200">
        {error}
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 text-gray-400">
        Aucune vidéo en attente
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      {/* Header */}
      <header className="mb-4">
        <h4 className="text-white text-xl font-semibold">
          Vidéos en attente d'évaluation
        </h4>
        <p className="text-sm text-gray-400">
          {total} soumission{total > 1 ? "s" : ""} à évaluer
        </p>
      </header>

      {/* liste des cartes des soumissions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {submissions.map((submission) => (
          <PlaylistSubmissionCard
            key={submission.id}
            submission={submission}
            mode="pending"
          />
        ))}
      </div>
    </section>
  );
}
