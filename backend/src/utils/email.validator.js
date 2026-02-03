export const checkEmail = (email) => {
   email = email?.trim();
   
   if (!email || typeof email !== 'string') {
      throw ({ fr: "Email est requis", en: "Email is required" });
   }
  
   // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      throw ({ fr: "Email invalide", en: "Invalid email" });
   }
   
   return true;
}