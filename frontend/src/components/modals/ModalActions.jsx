const ModalActions = ({
  onCancel,
  onConfirm,
  cancelText = 'Annuler',
  confirmText = 'Confirmer',
  confirmVariant = 'primary',
  isLoading = false,
  disabled = false
}) => {
  // Définir les classes CSS selon le variant
  const getVariantClass = () => {
    if (confirmVariant === 'danger') return 'btn-danger';
    if (confirmVariant === 'success') return 'btn-info';
    return 'btn-primary';
  };

  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="btn btn-secondary"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled || isLoading}
        className={`btn ${getVariantClass()}`}
      >
        {isLoading ? 'Chargement...' : confirmText}
      </button>
    </div>
  );
};

export default ModalActions;
