import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import AwardForm from "../../components/awards/AwardForm.jsx";
import { updateAwardService } from "../../services/award.service.js";

export default function AwardEditModal({ isOpen, onClose, award, onUpdated }) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async ({ title, description, award_rank, coverFile }) => {
    setSubmitting(true);
    setApiError(null);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description ?? "");
      if (award_rank != null && award_rank !== "") fd.append("award_rank", String(award_rank));
      if (coverFile) fd.append("cover", coverFile);

      const res = await updateAwardService(award.id, fd);
      const updated = res?.data ?? res;

      onUpdated?.(updated);
      onClose?.();
      return res;
    } catch (e) {
      setApiError(e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un award" size="md">
      <AwardForm
        submitting={submitting}
        apiError={apiError}
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        initialValues={{
          title: award?.title ?? "",
          description: award?.description ?? "",
          award_rank: award?.award_rank ?? null,
        }}
      />
    </Modal>
  );
}