const Checkbox = ({ id, checked, onChange, label, error, className = '' }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mt-1 mr-3"
      />
      <label htmlFor={id} className="flex-1">
        {label}
        {error && (
          <span className="block text-red-500 text-sm mt-1">
            {error}
          </span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
