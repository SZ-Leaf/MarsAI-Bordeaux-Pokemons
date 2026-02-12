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
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Submissions from './pages/Submissions';

function App() {
  const location = useLocation();

  return (
    <LanguageProvider>
      <AuthProvider>
      <Header />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<TestsGraphique />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
