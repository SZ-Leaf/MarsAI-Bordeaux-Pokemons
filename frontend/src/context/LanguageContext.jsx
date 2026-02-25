import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const STORAGE_KEY = 'lang';
const getBrowserLang = () => (navigator.language.startsWith('fr') ? 'fr' : 'en');

export const LanguageProvider = ({ children }) => {
   const [language, setLanguage] = useState(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') return stored;
      return getBrowserLang();
   });

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, language);
   }, [language]);

   return (
      <LanguageContext.Provider value={{ language, setLanguage }}>
         {children}
      </LanguageContext.Provider>
   )
};

export const useLanguage = () => useContext(LanguageContext);