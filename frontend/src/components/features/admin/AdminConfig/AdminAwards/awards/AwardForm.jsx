import { useMemo, useRef, useState } from "react";
import { awardCreateSchema, awardUpdateSchema } from "@marsai/schemas";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { zodErrors } from "../../../../../../helpers/zodHelper";

export default function AwardForm({
  submitting,
  apiError,
  onCancel,
  onSubmit,
  initialValues,
  submitLabel = "Créer",
}) {
  const { language } = useLanguage();
  const fileRef = useRef(null);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [awardRank, setAwardRank] = useState(
    initialValues?.award_rank == null ? "" : String(initialValues.award_rank)
  );
  const [coverFile, setCoverFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const preview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);

  const pick = () => fileRef.current?.click();
  const remove = () => setCoverFile(null);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim(),
      award_rank: awardRank === "" ? null : Number(awardRank),
      cover: coverFile ? coverFile.name : null,
    };

    // Choisir le schéma selon création ou édition
    const schema = initialValues ? awardUpdateSchema : awardCreateSchema;

    try {
      schema.parse(payload);
      setFieldErrors({});
    } catch (err) {
      const fe = zodErrors(err, language);
      if (Object.keys(fe).length) setFieldErrors(fe);
      return;
    }

    try {
      await onSubmit?.({
        title: payload.title,
        description: payload.description,
        award_rank: payload.award_rank,
        coverFile,
      });
    } catch (e) {
      const fe = zodErrors(e, language);
      if (Object.keys(fe).length) setFieldErrors(fe);
      throw e;
    }
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
        {fieldErrors.title && (
          <p className="mt-1 text-xs text-red-300">{fieldErrors.title}</p>
        )}
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
        {fieldErrors.award_rank && (
          <p className="mt-1 text-xs text-red-300">{fieldErrors.award_rank}</p>
        )}
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
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-300">{fieldErrors.description}</p>
        )}
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
          {submitting ? "…" : submitLabel}
        </button>
      </div>
    </form>
  );
}