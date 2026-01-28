import './App.css'
import { Routes, Route } from 'react-router'
import Submit from './pages/Submit.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/submit" element={<Submit />} />
        <Route path="/" element={
          <div className="max-w-4xl mx-auto p-6 pl-8">
            <h1 className="text-3xl font-bold mb-4">MarsAI Festival</h1>
            <p className="mb-4">Bienvenue sur la plateforme de soumission de films.</p>
            <a href="/submit" className="text-blue-500 underline">
              Soumettre un film
            </a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
