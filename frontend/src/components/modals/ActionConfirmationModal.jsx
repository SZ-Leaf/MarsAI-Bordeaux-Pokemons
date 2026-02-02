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
  
  // Définir les classes CSS selon le variant
  const getVariantClass = () => {
    if (variant === 'danger') return 'btn-danger';
    if (variant === 'success') return 'btn-info';
    return 'btn-primary';
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
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${getVariantClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmationModal;
