/**
 * Modale de confirmation pour la soumission
 */
const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Confirmer la soumission</h2>
          <p className="text-gray-700 mb-6">
            Êtes-vous sûr de vouloir soumettre votre film ? Cette action est définitive.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
