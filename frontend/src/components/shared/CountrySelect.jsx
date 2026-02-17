import { useState, useRef, useEffect, useMemo } from 'react';
// import { countries } from '../../constants/countries';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useLanguage } from '../../context/LanguageContext';

const getFlagEmoji = (countryValue) =>
  countryValue
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );


const CountrySelect = ({ value, onChange, error, variant = 'light' }) => {
  const countries = useMemo(() => countryList().getData());
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';
  const { language } = useLanguage();

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

  const selectedCountry = countries.find(c => c.value === value);
  const filteredCountries = useMemo(() => {
    return countries.filter(country => 
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [countries, searchTerm]);

  const handleSelect = (country) => {
    onChange(country.value);
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
              <span
                className="text-lg country-flag"
              >
                {getFlagEmoji(selectedCountry.value)}
              </span>
              <span className={variant === 'dark' ? 'text-white' : 'text-black'}>{selectedCountry.label}</span>
            </>
          ) : (
            <span className={variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{language === 'fr' ? 'Sélectionner un pays' : 'Select a country'}</span>
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
                key={country.value}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full text-left px-3 py-2 ${variant === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'} flex items-center gap-2 ${
                  value === country.value ? (variant === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50') : ''
                }`}
              >
                <span 
                  className="text-lg country-flag"
                >
                  {getFlagEmoji(country.value)}
                </span>
                <span>{country.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
