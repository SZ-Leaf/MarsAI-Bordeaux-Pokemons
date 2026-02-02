const TextInput = ({ 
  value, 
  onChange, 
  error, 
  className = '', 
  variant = 'light',
  ...props 
}) => {
  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';
  
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${inputClass} ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
  );
};

export default TextInput;
