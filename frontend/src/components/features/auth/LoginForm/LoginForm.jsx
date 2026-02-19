import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginService } from "../../../../services/auth.service";
import { useLanguage } from "../../../../context/LanguageContext";
import { responseHelper } from "../../../../helpers/responseHelper";
import { useAlertHelper } from "../../../../helpers/alertHelper";
import { useAuth } from "../../../../hooks/useAuth";

const LoginForm = () => {
   const alertHelper = useAlertHelper();
   const { user, login } = useAuth();
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
         const response = await login(formData);
         alertHelper.showMessage(getMessageFromResponse(response));
         navigate("/");
      } catch (error) {
         alertHelper.showMessage(getMessageFromResponse(error));
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="login-form">
         <div className="input-group">
            <label className="input-label" htmlFor="email">
               {language === 'fr' ? 'Email' : 'Email'}
            </label>
            <input
               id="email"
               type="email"
               name="email"
               className="login-input"
               value={formData.email}
               onChange={handleChange}
               placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
               autoComplete="email"
            />
         </div>
         <div className="input-group">
            <label className="input-label" htmlFor="password">
               {language === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <input
               id="password"
               type="password"
               name="password"
               className="login-input"
               value={formData.password}
               onChange={handleChange}
               placeholder="••••••••"
               autoComplete="current-password"
            />
         </div>
         <button 
            type="submit" 
            className="login-btn"
            disabled={isSubmitting}
         >
            {isSubmitting 
               ? (language === 'fr' ? 'Connexion en cours...' : 'Logging in...') 
               : (language === 'fr' ? 'Connexion' : 'Login')}
         </button>
      </form>
   );
};

export default LoginForm;
