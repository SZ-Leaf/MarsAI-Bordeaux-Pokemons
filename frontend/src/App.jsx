import './App.css';
import TestsGraphique from './pages/TestsGraphique';
import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';

function App() {
  return (
    <div className="App pt-24" >
      <Header />
      <TestsGraphique />
      <Footer />
    </div>
  );
}

export default App;
