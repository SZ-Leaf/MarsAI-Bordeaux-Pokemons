import React from 'react';
import { Search } from 'lucide-react';
import '../../../../../styles.css';

const AdminSearchInput = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <div className={`admin-search-wrapper ${className}`}>
      <Search className="admin-search-icon" size={18} />
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="search-input pl-12 w-full" 
      />
    </div>
  );
};

export default AdminSearchInput;
