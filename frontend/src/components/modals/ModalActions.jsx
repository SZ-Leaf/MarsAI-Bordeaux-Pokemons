const ModalActions = ({
  onCancel,
  onConfirm,
  cancelText = 'Annuler',
  confirmText = 'Confirmer',
  confirmVariant = 'primary',
  isLoading = false,
  disabled = false
}) => {
  // Définir les couleurs selon le variant
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled || isLoading}
        className={`px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${variantStyles[confirmVariant] || variantStyles.primary}`}
      >
        {isLoading ? 'Chargement...' : confirmText}
      </button>
    </div>
  );
};

export default ModalActions;
