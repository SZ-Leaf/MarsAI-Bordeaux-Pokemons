import Modal from './Modal.jsx';

const ActionConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Confirmer l\'action',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'primary'
}) => {
  
  // Définir les couleurs selon le variant
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    success: 'bg-green-500 hover:bg-green-600',
    danger: 'bg-red-500 hover:bg-red-600'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="md"
    >
      <div className="space-y-6">
        <p className="text-gray-700">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white transition-colors ${variantStyles[variant] || variantStyles.primary}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmationModal;
