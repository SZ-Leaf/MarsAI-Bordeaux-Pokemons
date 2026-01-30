import { useState } from 'react';

export default function useModal(onConfirm = null) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const handleConfirm = async () => {
    closeModal();
    if (onConfirm) {
      try {
        await onConfirm();
      } catch (error) {
        // Erreur déjà gérée dans onConfirm
      }
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    ...(onConfirm && {
      handleConfirm,
      handleCancel: closeModal
    })
  };
}
