import React, { useState, useEffect } from "react";
import { registerService } from "../../../../services/auth.service";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router";
import { useLanguage } from "../../../../context/LanguageContext";
import { responseHelper } from "../../../../helpers/responseHelper";
import { useAlertHelper } from "../../../../helpers/alertHelper";

const RegisterForm = ({ token }) => {
   const alertHelper = useAlertHelper();
   const { user } = useAuth();
   const navigate = useNavigate();
   const { language } = useLanguage();
   const { getMessageFromResponse, isSuccessResponse } = responseHelper();
   const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (!firstname.trim() || !lastname.trim() || !password.trim() || !confirmPassword.trim()) {
         alertHelper.requiredFields();
         return false;
      }
      if (password !== confirmPassword) {
         alertHelper.passwordsMismatch();
         return false;
      }
      return true;
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
         alertHelper.showMessage(error?.message);
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
