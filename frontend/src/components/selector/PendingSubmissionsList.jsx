import React from "react";
import SubmissionCard from "../playlists/SubmissionCard.jsx";

export default function PendingSubmissionsList({ items, loading, error }) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-200">
        {error}
      </div>
    );
  }

  if (loading) {
    return <div className="text-gray-400">Chargement…</div>;
  }

  if (!items || items.length === 0) {
    return <div className="text-gray-400">🎉 Tout est traité !</div>;
  }

  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <SubmissionCard key={s.id} submission={s} />
      ))}
    </ul>
  );
}
