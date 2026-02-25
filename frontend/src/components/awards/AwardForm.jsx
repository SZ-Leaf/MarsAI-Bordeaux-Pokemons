import { useMemo, useRef, useState } from "react";

export default function AwardCreateForm({ submitting, apiError, onCancel, onSubmit }) {
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [awardRank, setAwardRank] = useState("");
  const [coverFile, setCoverFile] = useState(null);

  const preview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);

  const pick = () => fileRef.current?.click();
  const remove = () => setCoverFile(null);

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      award_rank: awardRank === "" ? null : Number(awardRank),
      coverFile,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm text-zinc-200">Titre</label>
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Grand Prix"
          required
          disabled={submitting}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-200">Rang (optionnel)</label>
        <input
          type="number"
          min="1"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
          value={awardRank}
          onChange={(e) => setAwardRank(e.target.value)}
          placeholder="1"
          disabled={submitting}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-200">Description (optionnel)</label>
        <textarea
          className="w-full min-h-[96px] rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Prix décerné par le jury…"
          disabled={submitting}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-200">Cover (optionnel)</label>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          disabled={submitting}
        />

        {preview ? (
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="preview"
              className="h-16 w-28 rounded-lg object-cover border border-zinc-700"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
                onClick={pick}
                disabled={submitting}
              >
                Changer
              </button>
              <button
                type="button"
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
                onClick={remove}
                disabled={submitting}
              >
                Retirer
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
            onClick={pick}
            disabled={submitting}
          >
            Ajouter une image
          </button>
        )}
      </div>

      {apiError && (
        <div className="text-sm text-red-300">{apiError?.message || "Erreur API"}</div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-xl bg-white/90 px-3 py-2 text-sm text-black hover:bg-white disabled:opacity-60"
          disabled={submitting || !title.trim()}
        >
          {submitting ? "…" : "Créer"}
        </button>
      </div>
    </form>
  );
}