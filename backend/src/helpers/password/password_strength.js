const checkPasswordStrength = (password) => {
   password = password?.trim();
   if (!password) throw new Error({ fr: "Mot de passe est requis", en: "Password is required" });
   const length = password?.length;
   if (length < 8) throw new Error({ fr: "Mot de passe doit contenir au moins 8 caractères", en: "Password must be at least 8 characters long" });
   if (length > 32) throw new Error({ fr: "Mot de passe doit contenir moins de 32 caractères", en: "Password must be less than 32 characters long" });
   if (!/[A-Z]/.test(password)) throw new Error("Password must contain at least one uppercase letter");
   if (!/[a-z]/.test(password)) throw new Error({ fr: "Mot de passe doit contenir au moins une lettre majuscule", en: "Password must contain at least one uppercase letter" });
   if (!/[0-9]/.test(password)) throw new Error({ fr: "Mot de passe doit contenir au moins un chiffre", en: "Password must contain at least one number" });
   return true;
}

export { checkPasswordStrength };