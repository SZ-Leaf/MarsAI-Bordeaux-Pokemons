import './App.css';
import TestsGraphique from './pages/TestsGraphique';
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';
import { Routes, Route, useLocation } from 'react-router';
import Submit from './pages/Submit.jsx';
import Tags from './components/tags/Tags'
import Sponsors from './components/sponsors/Sponsors.jsx';
import Selector from './components/selector/Selector';
import Register from './pages/Register';
import Login from './pages/Login';
import NewsletterConfirm from './pages/NewsletterConfirm';
import NewsletterUnsubscribe from './pages/NewsletterUnsubscribe';
import AdminGuard from './components/admin/AdminGuard';
import AdminNewslettersList from './pages/admin/AdminNewslettersList';
import AdminNewsletterForm from './pages/admin/AdminNewsletterForm';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Submissions from './pages/Submissions';

function App() {
  const location = useLocation();
  const isSelectorPage = location.pathname === '/selector';

  return (
    <LanguageProvider>
      <AuthProvider>
        {/* Header desktop uniquement sur page selector, sinon toujours visible */}
        {isSelectorPage ? (
          <div className="hidden md:block">
            <Header />
          </div>
        ) : (
          <Header />
        )}
        
        <div className={isSelectorPage ? '' : 'pt-0 md:pt-24'}>
          <Routes>
            <Route path="/" element={<TestsGraphique />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/selector" element={<Selector />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
            <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
            <Route path="/admin/newsletters" element={<AdminGuard><AdminNewslettersList /></AdminGuard>} />
            <Route path="/admin/newsletters/new" element={<AdminGuard><AdminNewsletterForm /></AdminGuard>} />
            <Route path="/admin/newsletters/:id/edit" element={<AdminGuard><AdminNewsletterForm /></AdminGuard>} />
          </Routes>
        </div>
        
        {/* Footer caché en mobile sur la page selector, visible desktop */}
        {isSelectorPage ? (
          <div className="hidden md:block">
            <Footer />
          </div>
        ) : (
          <Footer />
        )}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
