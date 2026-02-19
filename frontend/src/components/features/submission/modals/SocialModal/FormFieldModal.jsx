const FormFieldModal = ({
  label,
  name,
  value,
  onChange,
  error,
  externalError,
  type = 'text',
  placeholder = '',
  required = false,
  maxLength,
  rows,
  options = [],
  children,
  helpText,
  showCharCount = false
}) => {
  const hasError = error || externalError;
  const errorMessage = error || externalError;

  // Rendu du champ selon le type
  const renderInput = () => {
    if (children) {
      return children;
    }

    const baseClassName = `${type === 'select' ? 'select-dark' : 'input-dark'} ${hasError ? 'border-red-500' : ''}`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClassName}
            placeholder={placeholder}
            rows={rows || 3}
            maxLength={maxLength}
          />
        );
      
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClassName}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value} className="select-dark-option">
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClassName}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {errorMessage}
        </p>
      )}
      
      {!hasError && helpText && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      
      {showCharCount && maxLength && (
        <div className="text-xs text-gray-500 mt-1">
          {value.length}/{maxLength} caractères
        </div>
      )}
    </div>
  );
};

export default FormFieldModal;
