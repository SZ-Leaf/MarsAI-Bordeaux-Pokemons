import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import AwardForm from "../awards/AwardForm.jsx";
import { createAwardService } from "../../services/award.service.js";

export default function AwardCreateModal({ isOpen, onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async ({ title, description, award_rank, coverFile }) => {
    setSubmitting(true);
    setApiError(null);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description ?? "");

      if (award_rank != null && award_rank !== "") {
        fd.append("award_rank", String(award_rank));
      }
      if (coverFile) fd.append("cover", coverFile);

      const res = await createAwardService(fd);

      const created = res?.data;

      if (!created?.id) {
        throw new Error("Réponse API invalide: award non retourné");
      }

      onCreated?.(created);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un award" size="md">
      <AwardForm
        submitting={submitting}
        apiError={apiError}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}