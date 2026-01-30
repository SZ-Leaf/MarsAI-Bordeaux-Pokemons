import './App.css'
import { Routes, Route } from 'react-router'
import Submit from './pages/Submit.jsx'

function App() {
  return (
    
      <Routes>
        <Route path="/submit" element={<Submit />} />
      </Routes>
    
  )
}

export default App
