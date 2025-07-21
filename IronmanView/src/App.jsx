import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage' 
import Training from "./components/TrainingCam"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<Training />} />
      </Routes>
    </Router>
  )
}

export default App
