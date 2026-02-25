import { useEffect, useState } from "react";
import { Link } from "react-router";
import { juryService } from "../../../../../../services/jury.service";
import JuryCard from "./JuryCard.jsx";

export default function JuryIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setApiError(null);
        const res = await juryService.list();
        const data = res?.data ?? [];
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setApiError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section-container">
      <div className="section-container-wide">
        <div className="mb-5">
          <h1 className="section-title-medium">Jury</h1>
        </div>

        {apiError && (
          <div className="alert alert-error">
            <div className="alert-error-text">
              <div className="font-semibold text-sm">
                Erreur {apiError.httpStatus ? `(HTTP ${apiError.httpStatus})` : ""}
              </div>
              <div className="text-xs opacity-90">
                {apiError.message?.fr || apiError.message?.en || "Une erreur est survenue"}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-sm text-zinc-400">Chargement de la liste…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-400">Aucun membre trouvé.</div>
        ) : (
          <div className="films-grid">
            {items.map((j) => (
              <Link
                key={j.id}
                to={`/jury/${j.id}`}
                className="block"
              >
                <JuryCard jury={j} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}