import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";
import LoginForm from "../components/forms/LoginForm";
import "./login.css";

const Login = () => {
   const { language } = useLanguage();

   return (
      <div className="login-page">
         <div className="login-bg-glow"></div>
         <div className="login-container">
            <div className="login-card">
               <div className="login-title-group">
                  <div className="login-label">
                     <span className="line"></span>
                     <span>{language === 'fr' ? 'Accès Membre' : 'Member Access'}</span>
                     <span className="line"></span>
                  </div>
                  <h1 className="login-title">{language === 'fr' ? 'Connexion' : 'Login'}</h1>
               </div>
               
               <LoginForm />

               <div className="login-footer">
                  <p className="login-footer-text">
                     {language === 'fr' ? "Pas encore de compte ?" : "Don't have an account?"}
                  </p>
                  <Link to="/register" className="login-link">
                     {language === 'fr' ? 'Créer un compte' : 'Create an account'}
                  </Link>
               </div>
            </div>

            <Link to="/" className="back-home-link">
               {language === 'fr' ? '← Retour à l\'accueil' : '← Back to home'}
            </Link>
         </div>
      </div>
   )
}

export default Login;