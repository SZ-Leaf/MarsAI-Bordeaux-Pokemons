import { useEffect, useState } from "react";
import Modal from "../../../../../../components/ui/Modal/Modal.jsx";
import JuryForm from "./JuryForm.jsx";
import { juryService } from "../../../../../../services/jury.service";

const toPublicUrl = (cover) => {
  if (!cover) return null;
  return `/${String(cover).replace(/^\/+/, "")}`;
};

export default function JuryEditModal({ isOpen, onClose, juryId, onUpdated }) {
  const [initialValues, setInitialValues] = useState({
    firstname: "",
    lastname: "",
    job: "",
    coverUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!isOpen || !juryId) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setApiError(null);

        const res = await juryService.getById(juryId);
        const j = res?.data;

        if (!alive) return;

        setInitialValues({
          firstname: j?.firstname || "",
          lastname: j?.lastname || "",
          job: j?.job || "",
          coverUrl: toPublicUrl(j?.cover),
        });
      } catch (err) {
        if (alive) setApiError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isOpen, juryId]);

  const handleUpdate = async ({ firstname, lastname, job, coverFile, removeCover }) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await juryService.update(juryId, { firstname, lastname, job, coverFile, removeCover });
      onUpdated?.();   // refresh show
      onClose?.();
    } catch (err) {
      setApiError(err);
      throw err; 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le membre du jury" size="md">
      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
          Chargement…
        </div>
      ) : (
        <JuryForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          submitting={submitting}
          apiError={apiError}
          submitLabel="Enregistrer"
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}