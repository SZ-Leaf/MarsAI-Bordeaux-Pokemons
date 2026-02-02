const Select = ({ 
  value, 
  onChange, 
  error, 
  options, 
  className = '', 
  placeholder = 'Sélectionner',
  variant = 'light',
  ...props 
}) => {
  const selectClass = variant === 'dark' ? 'select-dark' : 'select-light';
  const optionClass = variant === 'dark' ? 'select-dark-option' : 'select-light-option';
  
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${selectClass} ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    >
      {placeholder && <option className={optionClass} value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value} className={optionClass}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
