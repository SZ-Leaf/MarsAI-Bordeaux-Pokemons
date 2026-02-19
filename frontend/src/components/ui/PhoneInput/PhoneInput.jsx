import { useState, useRef, useEffect } from 'react';
import { phoneCountryCodes } from '../../../constants/phoneCodes';

const getFlagUrl = (countryCode) => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

const PhoneInput = ({ value, onChange, error, placeholder, variant = 'light' }) => {
  const [selectedDialCode, setSelectedDialCode] = useState('+33');
  const [isDialCodeOpen, setIsDialCodeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';

  // Extraire l'indicatif et le numéro du value si présent
  useEffect(() => {
    if (value && typeof value === 'string') {
      // Chercher l'indicatif correspondant dans la valeur
      const matchingCode = phoneCountryCodes.find(code => 
        value.startsWith(code.dialCode) || value.startsWith(code.dialCode.replace('+', ''))
      );
      if (matchingCode) {
        setSelectedDialCode(matchingCode.dialCode);
      }
    }
  }, [value]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDialCodeOpen(false);
        setSearchTerm('');
      }
    };

    if (isDialCodeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDialCodeOpen]);

  const filteredCodes = phoneCountryCodes.filter(code =>
    code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.dialCode.includes(searchTerm)
  );

  // Extraire le numéro sans l'indicatif pour l'affichage
  const getDisplayNumber = () => {
    if (!value) return '';
    const matchingCode = phoneCountryCodes.find(code => 
      value.startsWith(code.dialCode) || value.startsWith(code.dialCode.replace('+', ''))
    );
    if (matchingCode) {
      return value.replace(matchingCode.dialCode, '').replace(/^\+/, '').trim();
    }
    return value.replace(/^\+/, '').trim();
  };

  const displayNumber = getDisplayNumber();

  const handleDialCodeSelect = (code) => {
    const newDialCode = code.dialCode;
    setSelectedDialCode(newDialCode);
    setIsDialCodeOpen(false);
    setSearchTerm('');
    
    const number = displayNumber;
    onChange(newDialCode + (number ? ' ' + number : ''));
  };

  const handleNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, '');
    onChange(selectedDialCode + (number ? ' ' + number : ''));
  };

  return (
    <div className="flex gap-2 items-stretch">
      {/* Sélecteur d'indicatif */}
      <div className="relative w-32 flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDialCodeOpen(!isDialCodeOpen)}
          className={`w-full h-full border rounded p-2 text-left flex items-center justify-between ${
            variant === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-black'
          } ${
            error ? 'border-red-500' : ''
          }`}
          style={{ minHeight: '2.5rem' }}
        >
          <span className="text-sm font-medium">{selectedDialCode}</span>
          <span className={variant === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>▼</span>
        </button>

        {isDialCodeOpen && (
          <div className={`absolute z-50 w-64 mt-1 ${variant === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} border rounded shadow-lg max-h-60 overflow-y-auto left-0`}>
            <div className={`p-2 sticky top-0 ${variant === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} border-b`}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} text-sm`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filteredCodes.map((code) => (
                <button
                  key={code.code}
                  type="button"
                  onClick={() => handleDialCodeSelect(code)}
                  className={`w-full text-left px-3 py-2 ${variant === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'} flex items-center justify-between text-sm ${
                    selectedDialCode === code.dialCode ? (variant === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50') : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getFlagUrl(code.code)}
                      alt={code.name}
                      className="w-4 h-3 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span className="text-xs">{code.name}</span>
                  </div>
                  <span className="text-xs font-medium">{code.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Champ de saisie du numéro */}
      <input
        type="tel"
        value={displayNumber}
        onChange={handleNumberChange}
        placeholder={placeholder || 'Numéro de téléphone'}
        className={`${inputClass} flex-1 h-full ${error ? 'border-red-500' : ''}`}
        style={{ minHeight: '2.5rem' }}
        maxLength={20}
      />
    </div>
  );
};

export default PhoneInput;
