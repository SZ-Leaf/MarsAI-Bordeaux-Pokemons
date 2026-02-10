import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
   const defaultLang = localStorage.getItem('lang') || (navigator.language.startsWith('fr') ? 'fr' : 'en');
   const [language, setLanguage] = useState(defaultLang);

   useEffect(() => {
      localStorage.setItem('lang', language);
   }, [language]);

   return (
      <LanguageContext.Provider value={{ language, setLanguage }}>
         {children}
      </LanguageContext.Provider>
   )
};

export const useLanguage = () => useContext(LanguageContext);