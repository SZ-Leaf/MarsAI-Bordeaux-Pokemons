import { useState, useRef, useEffect } from 'react';
import { countries } from '../../constants/countries';

const getFlagUrl = (countryCode) => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

const CountrySelect = ({ value, onChange, error, variant = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedCountry = countries.find(c => c.name === value);
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded p-2 text-left flex items-center justify-between ${
          variant === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-black'
        } ${
          error ? 'border-red-500' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <img
                src={getFlagUrl(selectedCountry.code)}
                alt={selectedCountry.name}
                className="w-5 h-4 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className={variant === 'dark' ? 'text-white' : 'text-black'}>{selectedCountry.name}</span>
            </>
          ) : (
            <span className={variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Sélectionner un pays</span>
          )}
        </span>
        <span className={variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}>▼</span>
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 ${variant === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} border rounded shadow-lg max-h-60 overflow-y-auto`}>
          <div className={`p-2 sticky top-0 ${variant === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} border-b`}>
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClass}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full text-left px-3 py-2 ${variant === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'} flex items-center gap-2 ${
                  value === country.name ? (variant === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50') : ''
                }`}
              >
                <img
                  src={getFlagUrl(country.code)}
                  alt={country.name}
                  className="w-5 h-4 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
