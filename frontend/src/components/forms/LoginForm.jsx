import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginService } from "../../services/auth.service";
import { useLanguage } from "../../context/LanguageContext";
import { responseHelper } from "../../helpers/responseHelper";
import { useAlertHelper } from "../../helpers/alertHelper";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
   const alertHelper = useAlertHelper();
   const { user } = useAuth();
   const { language } = useLanguage();
   const navigate = useNavigate();
   const { getMessageFromResponse, isSuccessResponse } = responseHelper();
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const { email, password, confirmPassword } = formData;
         if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            alertHelper.requiredFields();
            return;
         }
         if (password !== confirmPassword) {
            alertHelper.passwordsMismatch();
            return;
         }
         const response = await loginService(email, password);
         alertHelper.showMessage(getMessageFromResponse(response));
      } catch (error) {
         alertHelper.showMessage(getMessageFromResponse(error));
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <input
         type="email"
         name="email"
         value={formData.email}
         onChange={handleChange}
         placeholder={language === 'fr' ? 'Email' : 'Email'}
         />
         <input
         type="password"
         name="password"
         value={formData.password}
         onChange={handleChange}
         placeholder={language === 'fr' ? 'Mot de passe' : 'Password'}
         />
         <input
         type="password"
         name="confirmPassword"
         value={formData.confirmPassword}
         onChange={handleChange}
         placeholder={language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
         />
         <button type="submit" disabled={isSubmitting}>{language === 'fr' ? 'Connexion' : 'Login'}</button>
      </form>
   );
};

export default LoginForm;
