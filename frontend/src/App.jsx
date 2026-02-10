// import { Routes, Route } from 'react-router-dom'
import "./App.css";
import TestsGraphique from "./pages/TestsGraphique";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import { Routes, Route } from "react-router";
import Submit from "./pages/Submit.jsx";
import Tags from "./components/tags/Tags";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App pt-24">
          <Header />
          <Tags />
          <Routes>
            <Route path="/" element={<TestsGraphique />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
