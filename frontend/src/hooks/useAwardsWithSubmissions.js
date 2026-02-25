import { useEffect, useMemo, useState } from "react";
import { getAwardsService } from "../services/award.service.js";
import { getSubmissionsService } from "../services/submission.service.js"; // ✅

export function useAwardsWithSubmissions() {
  const [awards, setAwards] = useState([]);
  const [submissionsById, setSubmissionsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const submissionIds = useMemo(() => {
    const ids = new Set();
    for (const a of awards) {
      const sid = a?.submission_id;
      if (sid != null) ids.add(Number(sid));
    }
    return [...ids].filter((n) => Number.isInteger(n) && n > 0);
  }, [awards]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAwardsService();
        console.log("awards payload", res?.data?.[0]);
        const list = res?.data ?? [];
        if (!alive) return;

        setAwards(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    if (!submissionIds.length) return;

    (async () => {
      try {
        // charge un "gros" batch
        const res = await getSubmissionsService({
          filters: { limit: 50, offset: 0, sortBy: "recent" },
        });

        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : (data?.items ?? data?.submissions ?? []);
        if (!alive) return;

        // build map
        const map = {};
        for (const s of list) {
          const id = Number(s?.id);
          if (Number.isInteger(id) && id > 0) map[id] = s;
        }

        // ne garde que celles utiles (optionnel mais clean)
        setSubmissionsById((prev) => {
          const next = { ...(prev || {}) };
          for (const id of submissionIds) {
            if (map[id]) next[id] = map[id];
          }
          return next;
        });
      } catch (e) {
        // au moins log pour comprendre si ça casse
        console.error("getSubmissionsService failed", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [submissionIds]);

  return { awards, setAwards, submissionsById, setSubmissionsById, loading, error };
}