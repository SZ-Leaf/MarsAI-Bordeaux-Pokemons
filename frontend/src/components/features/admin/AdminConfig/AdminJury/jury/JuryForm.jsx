import { useEffect, useMemo, useRef, useState } from "react";
import { zodFieldErrors } from "../../../../../../services/jury.service";

export default function JuryForm({
  initialValues = { firstname: "", lastname: "", job: "", coverUrl: null },
  onSubmit,
  submitting = false,
  apiError = null,
  submitLabel = "Enregistrer",
  onCancel,
}) {
  const fileInputRef = useRef(null);

  const [firstname, setFirstname] = useState(initialValues.firstname || "");
  const [lastname, setLastname] = useState(initialValues.lastname || "");
  const [job, setJob] = useState(initialValues.job || "");

  const [coverFile, setCoverFile] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFirstname(initialValues.firstname || "");
    setLastname(initialValues.lastname || "");
    setJob(initialValues.job || "");
    setCoverFile(null);
    setRemoveCover(false);
    setFieldErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [initialValues]);

  const coverPreview = useMemo(() => {
    if (!coverFile) return null;
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleRemoveCover = () => {
    setCoverFile(null);
    setRemoveCover(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePickFile = (file) => {
    setCoverFile(file || null);
    if (file) setRemoveCover(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      await onSubmit?.({ firstname, lastname, job, coverFile, removeCover });
    } catch (err) {
      const fe = zodFieldErrors(err);
      if (Object.keys(fe).length) setFieldErrors(fe);
      throw err;
    }
  };

  // === COMPACT CLASSES ===
  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 " +
    "placeholder:text-zinc-400 outline-none " +
    "focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200/50 " +
    "disabled:bg-zinc-50 disabled:text-zinc-500";

  const labelClass = "mb-0.5 block text-[11px] font-medium text-zinc-200";

  const subtleButton =
    "rounded-xl border border-zinc-200/20 bg-zinc-900/30 px-2.5 py-1.5 text-xs text-zinc-100 " +
    "hover:bg-zinc-900/40 active:bg-zinc-900/50 transition";

  const primaryButton =
    "inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs " +
    "font-semibold text-zinc-900 hover:bg-zinc-100 active:bg-white/90 " +
    "disabled:opacity-60 transition";

  const secondaryButton =
    "inline-flex items-center justify-center rounded-xl border border-zinc-200/20 bg-transparent px-3 py-2 text-xs " +
    "text-zinc-100 hover:bg-zinc-900/30 active:bg-zinc-900/40 transition";

  const hasExistingCover = !!initialValues.coverUrl;
  const shouldShowExistingCover = hasExistingCover && !coverPreview && !removeCover;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-100/10 bg-zinc-800 p-3 shadow-sm"
    >
      {/* Error */}
      {apiError && (
        <div className="mb-3 rounded-2xl border border-red-200/30 bg-red-950/30 p-3 text-red-200">
          <div className="text-xs font-semibold">
            Erreur {apiError.httpStatus ? `(HTTP ${apiError.httpStatus})` : ""}
          </div>
          <div className="mt-0.5 text-xs">
            {apiError.message || "Une erreur est survenue"}
          </div>
        </div>
      )}

      {/* Photo */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-zinc-100">Photo</div>
          <div className="text-[11px] text-zinc-400">PNG ou JPG.</div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => handlePickFile(e.target.files?.[0] || null)}
          />

          {!coverFile ? (
            <button type="button" onClick={openFilePicker} className={subtleButton}>
              {shouldShowExistingCover ? "Changer photo actuelle" : "Ajouter une photo"}
            </button>
          ) : (
            <button type="button" onClick={openFilePicker} className={subtleButton}>
              Changer
            </button>
          )}

          {(coverFile || shouldShowExistingCover) && (
            <button type="button" onClick={handleRemoveCover} className={subtleButton}>
              Retirer
            </button>
          )}
        </div>
      </div>

      {/* Preview (COMPACT) */}
      {coverPreview && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200/20 bg-zinc-950/20">
          <img src={coverPreview} alt="Cover preview" className="h-28 w-full object-cover" />
          <div className="flex items-center justify-between gap-2 border-t border-zinc-200/20 px-2.5 py-1.5 text-[11px] text-zinc-300">
            <span className="truncate">{coverFile?.name}</span>
            <span className="shrink-0">{Math.round((coverFile?.size || 0) / 1024)} Ko</span>
          </div>
        </div>
      )}

      {shouldShowExistingCover && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200/20 bg-zinc-950/20">
          <img
            src={initialValues.coverUrl}
            alt="Cover actuelle"
            className="h-28 w-full object-cover"
          />
          <div className="border-t border-zinc-200/20 px-2.5 py-1.5 text-[11px] text-zinc-300">
            Photo actuelle
          </div>
        </div>
      )}

      {removeCover && !coverPreview && (
        <div className="mb-3 rounded-2xl border border-amber-200/20 bg-amber-950/20 p-2 text-[11px] text-amber-200">
          La photo sera supprimée à l’enregistrement.
        </div>
      )}

      {/* Fields (GRID => moins haut) */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Prénom</label>
          <input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className={inputClass}
            placeholder="Ex : Alice"
          />
          {fieldErrors.firstname && (
            <p className="mt-0.5 text-[11px] text-red-300">{fieldErrors.firstname}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Nom</label>
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={inputClass}
            placeholder="Ex : Dupont"
          />
          {fieldErrors.lastname && (
            <p className="mt-0.5 text-[11px] text-red-300">{fieldErrors.lastname}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Activité</label>
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className={inputClass}
            placeholder="Ex : Réalisateur"
          />
          {fieldErrors.job && (
            <p className="mt-0.5 text-[11px] text-red-300">{fieldErrors.job}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? "Enregistrement…" : submitLabel}
        </button>

        <button type="button" onClick={onCancel} className={secondaryButton}>
          Annuler
        </button>
      </div>
    </form>
  );
}