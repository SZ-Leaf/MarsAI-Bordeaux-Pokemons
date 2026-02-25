import { useEffect, useState } from "react";
import {
  deleteAwardService,
  setAwardSubmissionService,
} from "../../../../../../services/award.service.js";
import {
  getSubmissionById,
  getSubmissionsService,
} from "../../../../../../services/submission.service.js";
import AwardEditModal from "./AwardEditModal.jsx";

export default function AwardCard({ award, submission, onAwardUpdated, onAwardDeleted }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedSubId, setSelectedSubId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState(null);

  const coverUrl = award?.cover ? `/${String(award.cover).replace(/^\/+/, "")}` : null;

  // Charge les submissions quand on ouvre le select
  useEffect(() => {
    let alive = true;
    if (!assignOpen) return;

    (async () => {
      setLoadingSubs(true);
      setErr(null);
      try {
        const res = await getSubmissionsService({
          filters: { limit: 200, offset: 0, sortBy: "recent" },
        });

        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : (data?.items ?? data?.submissions ?? []);
        if (alive) setSubmissions(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) setErr(e?.message || "Impossible de charger les soumissions");
      } finally {
        if (alive) setLoadingSubs(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [assignOpen]);

  const assign = async () => {
    setSaving(true);
    setErr(null);
    try {
      const subId = Number(selectedSubId);
      if (!Number.isInteger(subId) || subId <= 0) {
        setErr("Sélectionne une soumission");
        return;
      }

      const res = await setAwardSubmissionService(award.id, subId);
      const updatedAward = res?.data ?? res;

      const subRes = await getSubmissionById(subId);
      const fullSubmission = subRes?.data ?? subRes;

      onAwardUpdated?.(updatedAward, fullSubmission);

      setAssignOpen(false);
      setSelectedSubId("");
    } catch (e) {
      setErr(e?.message || "Erreur assignation");
    } finally {
      setSaving(false);
    }
  };

  const unassign = async () => {
    setSaving(true);
    setErr(null);
    try {
      const res = await setAwardSubmissionService(award.id, null);
      const updated = res?.data ?? res;
      onAwardUpdated?.(updated, null);
    } catch (e) {
      setErr(e?.message || "Erreur désassignation");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const ok = window.confirm(`Supprimer l’award "${award?.title || "—"}" ?`);
    if (!ok) return;

    setDeleting(true);
    setErr(null);
    try {
      await deleteAwardService(award.id);
      onAwardDeleted?.(award.id);
    } catch (e) {
      setErr(e?.message || "Erreur suppression");
    } finally {
      setDeleting(false);
    }
  };

  const assignedId = award?.submission_id ? String(award.submission_id) : "";
  const selectedOrAssigned =
    submissions.find((s) => String(s.id) === assignedId) ||
    submissions.find((s) => String(s.id) === String(selectedSubId)) ||
    null;

  const displayTitle =
    submission?.original_title ||
    submission?.title ||
    submission?.english_title ||
    selectedOrAssigned?.original_title ||
    selectedOrAssigned?.title ||
    selectedOrAssigned?.english_title ||
    null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <div className="relative aspect-[16/9] bg-zinc-800">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={award?.title || "award"}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          #{award?.award_rank ?? "—"}
        </div>
      </div>

      <div className="p-4">
        {/* Titre + actions */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-base font-semibold text-white">
            {award?.title || "—"}
          </h3>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-60"
              onClick={() => setEditOpen(true)}
              disabled={saving || deleting}
            >
              Modifier
            </button>

            <button
              type="button"
              className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-red-200 hover:bg-zinc-800 disabled:opacity-60"
              onClick={remove}
              disabled={saving || deleting}
            >
              Supprimer
            </button>
          </div>
        </div>

        <p className="mt-1 text-sm text-zinc-300 line-clamp-2">{award?.description || "—"}</p>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          {award?.submission_id ? (
            <>
              <div className="text-xs text-zinc-400">Soumission associée</div>
              <div className="mt-1 text-sm text-white">
                {displayTitle ? (
                  <span className="font-medium">{displayTitle}</span>
                ) : (
                  <span className="text-zinc-400 italic">Soumission en cours de chargement…</span>
                )}
              </div>

              <button
                className="mt-3 inline-flex items-center justify-center rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={unassign}
                disabled={saving || deleting}
              >
                Désassigner
              </button>
            </>
          ) : (
            <>
              <div className="text-xs text-zinc-400">Aucune soumission</div>

              {!assignOpen ? (
                <button
                  className="mt-3 inline-flex items-center justify-center rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
                  onClick={() => {
                    setAssignOpen(true);
                    setErr(null);
                  }}
                  disabled={deleting}
                >
                  Assigner une soumission
                </button>
              ) : (
                <div className="mt-3 flex gap-2">
                  <select
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    disabled={loadingSubs || saving || deleting}
                  >
                    <option value="">
                      {loadingSubs ? "Chargement..." : "Sélectionner une soumission"}
                    </option>

                    {submissions.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.title || s.english_title || "Soumission"}
                      </option>
                    ))}
                  </select>

                  <button
                    className="rounded-xl bg-white/90 px-3 py-2 text-sm text-black hover:bg-white disabled:opacity-60"
                    onClick={assign}
                    disabled={saving || loadingSubs || !selectedSubId || deleting}
                  >
                    OK
                  </button>
                </div>
              )}

              {err && <div className="mt-2 text-sm text-red-300">{err}</div>}
            </>
          )}
        </div>

        {err && <div className="mt-3 text-sm text-red-300">{err}</div>}
      </div>

      {/* Modal edit */}
      <AwardEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        award={award}
        onUpdated={(updated) => onAwardUpdated?.(updated, null)}
      />
    </div>
  );
}