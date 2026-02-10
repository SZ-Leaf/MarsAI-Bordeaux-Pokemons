import React, { useState, useEffect } from "react";
import "../ui/inputs.css";
import "../ui/buttons.css";
import { registerService } from "../../services/auth.service";
import {useAuth} from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { responseHelper } from "../../helpers/responseHelper";
import {useAlertHelper} from "../../helpers/alertHelper";

const RegisterForm = ({ token, email }) => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const { language } = useLanguage();
   const { getMessageFromResponse, isSuccessResponse } = responseHelper();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const alertHelper = useAlertHelper();

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   const [formData, setFormData] = useState({
      firstname: "",
      lastname: "",
      password: "",
   });

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const { firstname, lastname, password } = formData;
      
      try {
         if (!firstname.trim() || !lastname.trim() || !password.trim()) {
            alertHelper.requiredFields();
            return;
         }
         const response = await registerService(firstname, lastname, password, token);
         if (isSuccessResponse(response)) {
            alertHelper.customMessage(getMessageFromResponse(response));
            navigate("/login");
            return;
         }
         alertHelper.customMessage(getMessageFromResponse(response));
         return;
      } catch (error) {
         alertHelper.customMessage(error?.message);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <div>
            <h1>{language === 'fr' ? 'Inscription' : 'Register'}</h1>
            <p>{language === 'fr' ? 'Veuillez entrer vos informations de registration:' : 'Please enter your registration information:'}</p>
         </div>
         <form onSubmit={handleSubmit}>
            <input type="email" value={email} disabled />
            <input
            placeholder={language === 'fr' ? 'Prénom' : 'Firstname'}
            className="input-light"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            />
            <input
            placeholder={language === 'fr' ? 'Nom' : 'Lastname'}
            className="input-light"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            />
            <input
            placeholder={language === 'fr' ? 'Mot de passe' : 'Password'}
            className="input-light"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            />
            <button type="submit"
            disabled={isSubmitting || !formData.firstname || !formData.lastname || !formData.password}
            >{language === 'fr' ? 'Inscription' : 'Register'}</button>
         </form>
      </>
   );
};

export default RegisterForm;
