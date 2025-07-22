import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Training from "./components/TrainingCam";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import ChatBotPage from './pages/ChatBotPage';

const AppRoutes = () => {
  const location = useLocation();
  const isLogin = !!localStorage.getItem('user');

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLogin} />} />
      <Route path="/training" element={<Training />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/ChatBot" element={<ChatBotPage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      {/*  전체 중앙 정렬 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'  // 배경색은 추후 수정
      }}>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
