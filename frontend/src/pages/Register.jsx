import React from "react";
import { RegisterForm } from "../components/features/auth";
import { useLocation, Navigate, Link } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import "../styles/main.css";

const Register = () => {
   const { language } = useLanguage();
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const token = searchParams.get('token') || "";
   const email = searchParams.get('email') || "";

   if (!token || !email) {
      return <Navigate to="/" />;
   }

   return (
      <div className="login-page">
         <div className="login-bg-glow"></div>
         <div className="login-container">
            <div className="login-card">
               <div className="login-title-group">
                  <div className="login-label">
                     <span className="line"></span>
                     <span>{language === 'fr' ? 'Création de Compte' : 'Create Account'}</span>
                     <span className="line"></span>
                  </div>
                  <h1 className="login-title">{language === 'fr' ? 'Inscription' : 'Register'}</h1>
               </div>

               <RegisterForm token={token} email={email} />

               <div className="login-footer">
                  <p className="login-footer-text">
                     {language === 'fr' ? "Déjà un compte ?" : "Already have an account?"}
                  </p>
                  <Link to="/login" className="login-link">
                     {language === 'fr' ? 'Se connecter' : 'Login'}
                  </Link>
               </div>
            </div>

            <Link to="/" className="back-home-link">
               {language === 'fr' ? '← Retour à l\'accueil' : '← Back to home'}
            </Link>
         </div>
      </div>
   );
};

export default Register;