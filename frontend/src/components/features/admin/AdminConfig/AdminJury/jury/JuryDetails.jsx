import JuryCover from "./JuryCover.jsx";

export default function JuryDetails({ jury, onEdit }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
      <JuryCover
        jury={jury}
        aspect="aspect-video"
        showOverlay={false}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-xs text-zinc-400">Prénom</div>
          <div className="text-sm text-zinc-100">{jury.firstname || "—"}</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-xs text-zinc-400">Nom</div>
          <div className="text-sm text-zinc-100">{jury.lastname || "—"}</div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
        <div className="text-xs text-zinc-400">Activité</div>
        <div className="text-sm text-zinc-100">{jury.job || "—"}</div>
      </div>

      {onEdit && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-900"
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  );
}