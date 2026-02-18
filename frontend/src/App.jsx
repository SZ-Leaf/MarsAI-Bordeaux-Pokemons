import './App.css';
import Home from './pages/Home';
import TestsGraphique from './pages/TestsGraphique';
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';
import { Routes, Route, useLocation } from 'react-router';
import Submit from './pages/Submit.jsx';
import Register from './pages/Register';
import Login from './pages/Login';
import NewsletterConfirm from './pages/NewsletterConfirm';
import NewsletterUnsubscribe from './pages/NewsletterUnsubscribe';
import AuthGuard from './components/admin/AuthGuard.jsx';
import AdminNewslettersList from './pages/AdminNewslettersList';
import AdminNewsletterForm from './pages/AdminNewsletterForm';
import AdminNewsletterView from './pages/AdminNewsletterView';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import SelectorDashboard from './pages/SelectorDashboard.jsx';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const isSelectorPage = location.pathname === '/selector';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <AuthProvider>
        {/* Header desktop uniquement sur page selector, sinon toujours visible. Caché sur l'admin. */}
        {!isAdminPage && (isSelectorPage ? (
          <div className="hidden md:block">
            <Header />
          </div>
        ) : (
          <Header />
        ))}
        
        <div className={isSelectorPage || isAdminPage ? '' : 'pt-0 md:pt-24'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ui-kit" element={<TestsGraphique />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
            <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
            <Route path='/selector/dashboard' element={<SelectorDashboard/>}/>
            {/* <Route path='/selector/pending' element={<}/> */}
            <Route path="/admin/newsletters" element={<AuthGuard><AdminNewslettersList /></AuthGuard>} />
            <Route path="/admin/newsletters/new" element={<AuthGuard><AdminNewsletterForm /></AuthGuard>} />
            <Route path="/admin/newsletters/:id/edit" element={<AuthGuard><AdminNewsletterForm /></AuthGuard>} />
            <Route path="/admin/newsletters/:id/view" element={<AuthGuard><AdminNewsletterView /></AuthGuard>} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
        
        {/* Footer caché en mobile sur la page selector, visible desktop. Caché sur l'admin. */}
        {!isAdminPage && (isSelectorPage ? (
          <div className="hidden md:block">
            <Footer />
          </div>
        ) : (
          <Footer />
        ))}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
