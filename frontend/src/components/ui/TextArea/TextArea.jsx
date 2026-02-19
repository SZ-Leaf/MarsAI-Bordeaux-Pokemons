const TextArea = ({ 
  value, 
  onChange, 
  error, 
  maxLength, 
  showCounter = false,
  className = '', 
  variant = 'light',
  ...props 
}) => {
  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';
  
  return (
    <>
      <textarea
        value={value}
        onChange={onChange}
        className={`${inputClass} ${error ? 'border-red-500' : ''} ${className}`}
        maxLength={maxLength}
        {...props}
      />
      {showCounter && maxLength && (
        <div className="text-xs text-gray-500 mt-1">
          {value.length}/{maxLength} caractères
        </div>
      )}
    </>
  );
};

export default TextArea;
