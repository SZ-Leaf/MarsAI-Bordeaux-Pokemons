import React from 'react';
import { Search } from 'lucide-react';

const AdminSearchInput = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
