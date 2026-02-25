import './styles/main.css';
import Home from './pages/Home';
import { Header, Footer } from './components/layout';
import { Routes, Route, useLocation } from 'react-router';
import Register from './pages/Register';
import Login from './pages/Login';
import NewsletterConfirm from './pages/NewsletterConfirm';
import NewsletterUnsubscribe from './pages/NewsletterUnsubscribe';
import { AuthGuard } from './components/features/admin/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import JuryIndex from './components/jury/JuryIndex.jsx';
import JuryShow from './components/jury/JuryShow.jsx';
import Selection from './pages/Selection';

function App() {
  const location = useLocation();
  const isSelectorPage = location.pathname === '/selector';
  const isAdminPage = location.pathname.startsWith('/dashboard');

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
            <Route path="/events" element={<Events />} />
            <Route path="/selection" element={<Selection />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
            <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path='/jury' element={<JuryIndex/>}/>
            <Route path='/jury/:id' element={<JuryShow/>}/>
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
