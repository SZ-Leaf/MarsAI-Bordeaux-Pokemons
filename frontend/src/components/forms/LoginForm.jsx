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
   const { getMessageFromResponse } = responseHelper();
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   const [formData, setFormData] = useState({
      email: "",
      password: ""
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const { email, password } = formData;
         if (!email.trim() || !password.trim()) {
            alertHelper.requiredFields();
            return;
         }
         const response = await loginService(email, password);
         alertHelper.showMessage(getMessageFromResponse(response));
         navigate("/");
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
         <button type="submit" disabled={isSubmitting}>{language === 'fr' ? 'Connexion' : 'Login'}</button>
      </form>
   );
};

export default LoginForm;
