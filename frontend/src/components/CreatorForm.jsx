import { useState, useRef, useEffect } from 'react';
import { validateEmail, validateName } from '../utils/validation.js';

/**
 * Fonction pour obtenir l'URL de l'image du drapeau depuis un CDN
 */
const getFlagUrl = (countryCode) => {
  // Utilisation de flagcdn.com (gratuit et fiable)
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

/**
 * Liste des pays avec leurs drapeaux
 */
const countries = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'AL', name: 'Albanie', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'AD', name: 'Andorre', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua-et-Barbuda', flag: '🇦🇬' },
  { code: 'SA', name: 'Arabie saoudite', flag: '🇸🇦' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷' },
  { code: 'AM', name: 'Arménie', flag: '🇦🇲' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahreïn', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbade', flag: '🇧🇧' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhoutan', flag: '🇧🇹' },
  { code: 'BY', name: 'Biélorussie', flag: '🇧🇾' },
  { code: 'MM', name: 'Birmanie', flag: '🇲🇲' },
  { code: 'BO', name: 'Bolivie', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnie-Herzégovine', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgarie', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'KH', name: 'Cambodge', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻' },
  { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫' },
  { code: 'CL', name: 'Chili', flag: '🇨🇱' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳' },
  { code: 'CY', name: 'Chypre', flag: '🇨🇾' },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'KP', name: 'Corée du Nord', flag: '🇰🇵' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominique', flag: '🇩🇲' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬' },
  { code: 'AE', name: 'Émirats arabes unis', flag: '🇦🇪' },
  { code: 'EC', name: 'Équateur', flag: '🇪🇨' },
  { code: 'ER', name: 'Érythrée', flag: '🇪🇷' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'EE', name: 'Estonie', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fidji', flag: '🇫🇯' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲' },
  { code: 'GE', name: 'Géorgie', flag: '🇬🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenade', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', name: 'Haïti', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪' },
  { code: 'IS', name: 'Islande', flag: '🇮🇸' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaïque', flag: '🇯🇲' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordanie', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KG', name: 'Kirghizistan', flag: '🇰🇬' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LV', name: 'Lettonie', flag: '🇱🇻' },
  { code: 'LB', name: 'Liban', flag: '🇱🇧' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Lituanie', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MK', name: 'Macédoine du Nord', flag: '🇲🇰' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malte', flag: '🇲🇹' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'MH', name: 'Îles Marshall', flag: '🇲🇭' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronésie', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldavie', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolie', flag: '🇲🇳' },
  { code: 'ME', name: 'Monténégro', flag: '🇲🇪' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', name: 'Népal', flag: '🇳🇵' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬' },
  { code: 'UZ', name: 'Ouzbékistan', flag: '🇺🇿' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', name: 'Palaos', flag: '🇵🇼' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'PE', name: 'Pérou', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint-Kitts-et-Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Sainte-Lucie', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines', flag: '🇻🇨' },
  { code: 'SM', name: 'Saint-Marin', flag: '🇸🇲' },
  { code: 'ST', name: 'São Tomé-et-Príncipe', flag: '🇸🇹' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbie', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovaquie', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovénie', flag: '🇸🇮' },
  { code: 'SO', name: 'Somalie', flag: '🇸🇴' },
  { code: 'SD', name: 'Soudan', flag: '🇸🇩' },
  { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SY', name: 'Syrie', flag: '🇸🇾' },
  { code: 'TJ', name: 'Tadjikistan', flag: '🇹🇯' },
  { code: 'TW', name: 'Taïwan', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
  { code: 'CZ', name: 'République tchèque', flag: '🇨🇿' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor oriental', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinité-et-Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'TM', name: 'Turkménistan', flag: '🇹🇲' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VA', name: 'Vatican', flag: '🇻🇦' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Viêt Nam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yémen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Liste des indicatifs téléphoniques par pays
 * Format: { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' }
 */
const phoneCountryCodes = [
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'US', name: 'États-Unis', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49' },
  { code: 'IT', name: 'Italie', dialCode: '+39' },
  { code: 'ES', name: 'Espagne', dialCode: '+34' },
  { code: 'BE', name: 'Belgique', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', dialCode: '+41' },
  { code: 'NL', name: 'Pays-Bas', dialCode: '+31' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'AT', name: 'Autriche', dialCode: '+43' },
  { code: 'GR', name: 'Grèce', dialCode: '+30' },
  { code: 'SE', name: 'Suède', dialCode: '+46' },
  { code: 'NO', name: 'Norvège', dialCode: '+47' },
  { code: 'DK', name: 'Danemark', dialCode: '+45' },
  { code: 'FI', name: 'Finlande', dialCode: '+358' },
  { code: 'PL', name: 'Pologne', dialCode: '+48' },
  { code: 'CZ', name: 'République tchèque', dialCode: '+420' },
  { code: 'RO', name: 'Roumanie', dialCode: '+40' },
  { code: 'HU', name: 'Hongrie', dialCode: '+36' },
  { code: 'IE', name: 'Irlande', dialCode: '+353' },
  { code: 'MA', name: 'Maroc', dialCode: '+212' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237' },
  { code: 'CD', name: 'République démocratique du Congo', dialCode: '+243' },
  { code: 'ZA', name: 'Afrique du Sud', dialCode: '+27' },
  { code: 'EG', name: 'Égypte', dialCode: '+20' },
  { code: 'CN', name: 'Chine', dialCode: '+86' },
  { code: 'JP', name: 'Japon', dialCode: '+81' },
  { code: 'IN', name: 'Inde', dialCode: '+91' },
  { code: 'KR', name: 'Corée du Sud', dialCode: '+82' },
  { code: 'AU', name: 'Australie', dialCode: '+61' },
  { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64' },
  { code: 'BR', name: 'Brésil', dialCode: '+55' },
  { code: 'MX', name: 'Mexique', dialCode: '+52' },
  { code: 'AR', name: 'Argentine', dialCode: '+54' },
  { code: 'CL', name: 'Chili', dialCode: '+56' },
  { code: 'CO', name: 'Colombie', dialCode: '+57' },
  { code: 'PE', name: 'Pérou', dialCode: '+51' },
  { code: 'RU', name: 'Russie', dialCode: '+7' },
  { code: 'TR', name: 'Turquie', dialCode: '+90' },
  { code: 'SA', name: 'Arabie saoudite', dialCode: '+966' },
  { code: 'AE', name: 'Émirats arabes unis', dialCode: '+971' },
  { code: 'IL', name: 'Israël', dialCode: '+972' },
  { code: 'TH', name: 'Thaïlande', dialCode: '+66' },
  { code: 'VN', name: 'Viêt Nam', dialCode: '+84' },
  { code: 'ID', name: 'Indonésie', dialCode: '+62' },
  { code: 'MY', name: 'Malaisie', dialCode: '+60' },
  { code: 'SG', name: 'Singapour', dialCode: '+65' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' }
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Composant de sélection de pays avec drapeaux
 */
const CountrySelect = ({ value, onChange, error, countries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

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
                  // Fallback si l'image ne charge pas
                  e.target.style.display = 'none';
                }}
              />
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Sélectionner un pays</span>
          )}
        </span>
        <span className="text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b">
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded p-2"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                  value === country.name ? 'bg-blue-50' : ''
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

/**
 * Composant de saisie téléphone avec sélecteur d'indicatif
 */
const PhoneInput = ({ value, onChange, error, placeholder, fieldName }) => {
  const [selectedDialCode, setSelectedDialCode] = useState('+33'); // Par défaut France
  const [isDialCodeOpen, setIsDialCodeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

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

  const selectedCountry = phoneCountryCodes.find(c => c.dialCode === selectedDialCode);
  const filteredCodes = phoneCountryCodes.filter(code =>
    code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.dialCode.includes(searchTerm)
  );

  // Extraire le numéro sans l'indicatif pour l'affichage
  const getDisplayNumber = () => {
    if (!value) return '';
    // Chercher l'indicatif dans la valeur
    const matchingCode = phoneCountryCodes.find(code => 
      value.startsWith(code.dialCode) || value.startsWith(code.dialCode.replace('+', ''))
    );
    if (matchingCode) {
      return value.replace(matchingCode.dialCode, '').replace(/^\+/, '').trim();
    }
    // Si pas d'indicatif trouvé, retourner la valeur telle quelle
    return value.replace(/^\+/, '').trim();
  };

  const displayNumber = getDisplayNumber();

  const handleDialCodeSelect = (code) => {
    const newDialCode = code.dialCode;
    setSelectedDialCode(newDialCode);
    setIsDialCodeOpen(false);
    setSearchTerm('');
    
    // Reconstruire la valeur avec le nouvel indicatif et le numéro actuel
    const number = displayNumber;
    onChange(newDialCode + (number ? ' ' + number : ''));
  };

  const handleNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, ''); // Garder uniquement les chiffres
    // Reconstruire avec l'indicatif sélectionné
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
            error ? 'border-red-500' : ''
          }`}
          style={{ minHeight: '2.5rem' }}
        >
          <span className="text-sm font-medium">{selectedDialCode}</span>
          <span className="text-gray-500 text-sm">▼</span>
        </button>

        {isDialCodeOpen && (
          <div className="absolute z-50 w-64 mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto left-0">
            <div className="p-2 sticky top-0 bg-white border-b">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filteredCodes.map((code) => (
                <button
                  key={code.code}
                  type="button"
                  onClick={() => handleDialCodeSelect(code)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between text-sm ${
                    selectedDialCode === code.dialCode ? 'bg-blue-50' : ''
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
        className={`flex-1 border rounded p-2 h-full ${error ? 'border-red-500' : ''}`}
        style={{ minHeight: '2.5rem' }}
        maxLength={20}
      />
    </div>
  );
};

/**
 * Formulaire infos réalisateur (Partie 3)
 * Design épuré et simple
 */
const CreatorForm = ({ formData, errors, updateField }) => {
  const handleEmailBlur = (e) => {
    const email = e.target.value.trim();
    if (email && !validateEmail(email)) {
      // L'erreur sera gérée par la validation globale
      // On peut aussi ajouter une validation locale ici si nécessaire
    }
  };

  // Handler pour bloquer les caractères non autorisés dans les champs nom/prénom
  const handleNameChange = (field, value) => {
    // Filtrer les caractères : uniquement lettres (avec accents), espaces, tirets et apostrophes
    const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    updateField(field, filteredValue);
  };
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Informations du réalisateur</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.creator_firstname}
            onChange={(e) => handleNameChange('creator_firstname', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_firstname ? 'border-red-500' : ''}`}
          />
          {errors.creator_firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_firstname}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.creator_lastname}
            onChange={(e) => handleNameChange('creator_lastname', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_lastname ? 'border-red-500' : ''}`}
          />
          {errors.creator_lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_lastname}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.creator_email}
            onChange={(e) => {
              const value = e.target.value;
              updateField('creator_email', value);
              // Validation en temps réel si l'email n'est pas vide
              if (value.trim() && !validateEmail(value.trim())) {
                // L'erreur sera affichée via la validation globale
              }
            }}
            onBlur={handleEmailBlur}
            className={`w-full border rounded p-2 ${errors.creator_email ? 'border-red-500' : ''}`}
          />
          {errors.creator_email && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Téléphone
          </label>
          <PhoneInput
            value={formData.creator_phone || ''}
            onChange={(value) => updateField('creator_phone', value)}
            error={errors.creator_phone}
            placeholder="Numéro de téléphone"
            fieldName="creator_phone"
          />
          {errors.creator_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            value={formData.creator_mobile || ''}
            onChange={(value) => updateField('creator_mobile', value)}
            error={errors.creator_mobile}
            placeholder="Numéro de mobile"
            fieldName="creator_mobile"
          />
          {errors.creator_mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_mobile}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.creator_gender}
            onChange={(e) => updateField('creator_gender', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_gender ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner</option>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
            <option value="Other">Autre</option>
          </select>
          {errors.creator_gender && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_gender}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Pays <span className="text-red-500">*</span>
          </label>
          <CountrySelect
            value={formData.creator_country}
            onChange={(value) => updateField('creator_country', value)}
            error={errors.creator_country}
            countries={countries}
          />
          {errors.creator_country && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_country}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Source de référence <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.referral_source}
            onChange={(e) => updateField('referral_source', e.target.value)}
            className={`w-full border rounded p-2 ${errors.referral_source ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Sélectionner une source</option>
            <option value="Réseaux sociaux">Réseaux sociaux</option>
            <option value="Recommandation d'un ami">Recommandation d'un ami</option>
            <option value="Média (presse, radio, TV)">Média (presse, radio, TV)</option>
            <option value="École / Université">École / Université</option>
            <option value="Partenaire / Sponsor">Partenaire / Sponsor</option>
            <option value="Événement précédent">Événement précédent</option>
            <option value="Moteur de recherche">Moteur de recherche</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.referral_source && (
            <p className="text-red-500 text-sm mt-1">{errors.referral_source}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.creator_address}
          onChange={(e) => updateField('creator_address', e.target.value)}
          className={`w-full border rounded p-2 ${errors.creator_address ? 'border-red-500' : ''}`}
        />
        {errors.creator_address && (
          <p className="text-red-500 text-sm mt-1">{errors.creator_address}</p>
        )}
      </div>
    </div>
  );
};

export default CreatorForm;
