import React, { useState, useEffect } from "react";
import { registerService } from "../../../../services/auth.service";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router";
import { useLanguage } from "../../../../context/LanguageContext";
import { responseHelper } from "../../../../helpers/responseHelper";
import { useAlertHelper } from "../../../../helpers/alertHelper";
import { registerUserSchema } from "@marsai/schemas";
import { zodFieldErrors } from "../../../../utils/validation";

const RegisterForm = ({ token }) => {
   const alertHelper = useAlertHelper();
   const { user } = useAuth();
   const navigate = useNavigate();
   const { language } = useLanguage();
   const { getMessageFromResponse, isSuccessResponse } = responseHelper();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [fieldErrors, setFieldErrors] = useState({});

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   const [formData, setFormData] = useState({
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
   });

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const validateForm = () => {
      const { firstname, lastname, password, confirmPassword } = formData;

      // Vérif rapide client (mot de passe identique)
      if (password !== confirmPassword) {
         alertHelper.passwordsMismatch();
         return false;
      }

      try {
         registerUserSchema.parse({ firstname, lastname, password });
         setFieldErrors({});
         return true;
      } catch (err) {
         const fe = zodFieldErrors(err);
         if (Object.keys(fe).length) setFieldErrors(fe);
         return false;
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      const { firstname, lastname, password } = formData;

      try {
         const response = await registerService(firstname, lastname, password, token);
         if (isSuccessResponse(response)) {
            alertHelper.showMessage(getMessageFromResponse(response));
            navigate("/login");
            return;
         }
         alertHelper.showMessage(getMessageFromResponse(response));
         return;
      } catch (error) {
         const fe = zodFieldErrors(error);
         if (Object.keys(fe).length) {
            setFieldErrors(fe);
         } else {
            alertHelper.showMessage(error?.message);
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="login-form">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
               <label className="input-label" htmlFor="firstname">
                  {language === 'fr' ? 'Prénom' : 'Firstname'}
               </label>
               <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  className="login-input"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder={language === 'fr' ? 'Prénom' : 'Firstname'}
                  autoComplete="given-name"
               />
               {fieldErrors.firstname && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.firstname}</p>
               )}
            </div>
            <div className="input-group">
               <label className="input-label" htmlFor="lastname">
                  {language === 'fr' ? 'Nom' : 'Lastname'}
               </label>
               <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  className="login-input"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder={language === 'fr' ? 'Nom' : 'Lastname'}
                  autoComplete="family-name"
               />
               {fieldErrors.lastname && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.lastname}</p>
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
               <label className="input-label" htmlFor="password">
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
               </label>
               <input
                  id="password"
                  name="password"
                  type="password"
                  className="login-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
               />
               {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>
               )}
            </div>
            <div className="input-group">
               <label className="input-label" htmlFor="confirmPassword">
                  {language === 'fr' ? 'Confirmation' : 'Confirm'}
               </label>
               <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="login-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
               />
            </div>
         </div>

         <button
            type="submit"
            className="login-btn"
            disabled={isSubmitting || !formData.firstname || !formData.lastname || !formData.password || !formData.confirmPassword}
         >
            {isSubmitting
               ? (language === 'fr' ? 'Inscription en cours...' : 'Registering...')
               : (language === 'fr' ? 'Créer mon compte' : 'Create account')}
         </button>
      </form>
   );
};

export default RegisterForm;
