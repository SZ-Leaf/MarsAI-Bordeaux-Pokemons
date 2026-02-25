import { useEffect, useState } from "react";
import { setAwardSubmissionService } from "../../services/award.service.js";
import { getSubmissionById, getSubmissionsService } from "../../services/submission.service.js";

export default function AwardCard({ award, submission, onAwardUpdated }) {
  const [assignOpen, setAssignOpen] = useState(false);

  const [selectedSubId, setSelectedSubId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [saving, setSaving] = useState(false);
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
          filters: {
            limit: 200, 
            offset: 0,
            sortBy: "recent"
          }
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

            //assignation
            const res = await setAwardSubmissionService(award.id, subId);
            const updatedAward = res?.data ?? res;

            //récupération de la submission complète
            const subRes = await getSubmissionById(subId);
            const fullSubmission = subRes?.data ?? subRes;

            //remonter les deux
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
        <h3 className="text-base font-semibold text-white">{award?.title || "—"}</h3>
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
                className="mt-3 inline-flex items-center justify-center rounded-xl border border-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800"
                onClick={unassign}
                disabled={saving}
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
                >
                  Assigner une soumission
                </button>
              ) : (
                <div className="mt-3 flex gap-2">
                  <select
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    disabled={loadingSubs || saving}
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
                    disabled={saving || loadingSubs || !selectedSubId}
                  >
                    OK
                  </button>
                </div>
              )}

              {err && <div className="mt-2 text-sm text-red-300">{err}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}