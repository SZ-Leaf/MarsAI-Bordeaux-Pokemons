import './App.css';
import TestsGraphique from './pages/TestsGraphique';
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';
import { Routes, Route } from 'react-router';
import Submit from './pages/Submit.jsx';

function App() {
  return (
    <div className="App pt-24">
      <Header />
      <Routes>
        <Route path="/" element={<TestsGraphique />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;