import { useLanguage } from "../context/LanguageContext";

export const useAlertHelper = () => {

   const { language } = useLanguage();

   const requiredFields = () => alert(language === 'fr' ? 'Tous les champs sont requis' : 'All fields are required');

   const passwordsMismatch = () => alert(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');

   // const customMessage = (messageObj) => {
   //    if (!messageObj) return alert('No message provided');
   //    alert(messageObj[language] || messageObj.en || 'No message provided');
   // };

   const showMessage = (message) => {
      alert(message || "No message provided");
   };
   
   const generic = (message) => alert(message);

   return { requiredFields, passwordsMismatch, showMessage, generic };
};