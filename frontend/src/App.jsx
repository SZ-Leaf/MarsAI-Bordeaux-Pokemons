import './App.css';
import TestsGraphique from './pages/TestsGraphique';
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';
import { Routes, Route, useLocation } from 'react-router';
import Submit from './pages/Submit.jsx';
import Selector from './components/selector/Selector';
import Register from './pages/Register';

function App() {
  const location = useLocation();
  const isSelectorPage = location.pathname === '/selector';

  return (
    <div className="App">
      <Header />
      <div className={isSelectorPage ? '' : 'pt-24'}>
        <Routes>
          <Route path="/" element={<TestsGraphique />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      
      {!isSelectorPage && <Footer />}
    </div>
  );
}

export default App;
