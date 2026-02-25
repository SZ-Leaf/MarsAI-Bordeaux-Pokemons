import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router";
import { juryService } from "../../../../../../services/jury.service";
import JuryDetails from "./JuryDetails.jsx";

export default function JuryShow() {
  const { id } = useParams();

  const [jury, setJury] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchJury = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await juryService.getById(id);
      setJury(res?.data ?? null);
    } catch (err) {
      setApiError(err);
      setJury(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJury();
  }, [fetchJury]);

  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <Link to="/jury" className="text-zinc-300 hover:text-zinc-100 text-sm">
            Retour
          </Link>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-red-200">
            <div className="font-semibold text-sm">
              Erreur {apiError.httpStatus ? `(HTTP ${apiError.httpStatus})` : ""}
            </div>
            <div className="text-xs opacity-90">
              {apiError.message?.fr || apiError.message?.en || "Une erreur est survenue"}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-sm text-zinc-400">Chargement…</div>
        ) : !jury ? (
          <div className="text-sm text-zinc-400">Introuvable.</div>
        ) : (
          <JuryDetails jury={jury} />
        )}
      </div>
    </section>
  );
}