import { useMemo } from "react";
import { useAwardsWithSubmissions } from "../../../../../../hooks/useAwardsWithSubmissions.js";
import AwardCard from "./AwardCard.jsx";
import AwardCreateModal from "./AwardCreateModal.jsx";

export default function AwardsIndex({ createOpen, setCreateOpen }) {
  const { awards, setAwards, submissionsById, setSubmissionsById, loading, error } =
    useAwardsWithSubmissions();

  const sorted = useMemo(() => {
    return [...(awards || [])].sort(
      (a, b) => (a?.award_rank ?? 9999) - (b?.award_rank ?? 9999)
    );
  }, [awards]);

  // reçoit (updatedAward, fullSubmission)
  const handleAwardUpdated = (updatedAward, fullSubmission) => {
    const item = updatedAward?.data ?? updatedAward;
    if (!item?.id) return;

    // update award dans la liste
    setAwards((prev) => (prev || []).map((a) => (a.id === item.id ? item : a)));

    // update cache submissions pour afficher titre + créateur
    if (fullSubmission?.id) {
      setSubmissionsById((prev) => ({
        ...(prev || {}),
        [Number(fullSubmission.id)]: fullSubmission,
      }));
    }
  };
  const handleAwardDeleted = (awardId) => {
    setAwards((prev) => (prev || []).filter((a) => a.id !== awardId));
  };

  if (loading) return <div className="p-6 text-zinc-200">Chargement…</div>;
  if (error) return <div className="p-6 text-red-300">Erreur chargement awards</div>;

  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              submission={
                award?.submission_id ? submissionsById[Number(award.submission_id)] : null
              }
              onAwardUpdated={handleAwardUpdated}
              onAwardDeleted={handleAwardDeleted}
            />
          ))}
        </div>

        {/* Modal create */}
        <AwardCreateModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={(createdAward) => {
            // createdAward est déjà l'award complet (POST renvoie fullAward)
            if (!createdAward?.id) {
              console.log("onCreated payload inattendu:", createdAward);
              return;
            }
            setAwards((prev) => [createdAward, ...(prev || [])]);
          }}
        />
      </div>
    </section>
  );
}