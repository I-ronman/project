import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Training from "./components/TrainingCam";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 

const AppRoutes = () => {
  const location = useLocation();
  const isLogin = !!localStorage.getItem('user');
  const isHome = location.pathname === '/';

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLogin} />} />
      <Route path="/training" element={<Training />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
