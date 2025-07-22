import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Training from './components/TrainingCam';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatBotPage from './pages/ChatBotPage';
import OnboardingPage from './pages/OnboardingPage';  // 온보딩 페이지 import

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem('user');
  const isFirstLogin = localStorage.getItem('firstLogin') === 'true';

  useEffect(() => {
    // 홈 경로에 있을 때만 온보딩 체크
    if (location.pathname === '/' && isLogin && isFirstLogin) {
      localStorage.setItem('firstLogin', 'false'); // 이후부터는 다시 안 뜨게 설정
      navigate('/onboarding');
    }
  }, [location, isLogin, isFirstLogin, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLogin} />} />
      <Route path="/training" element={<Training />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/chatbot" element={<ChatBotPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      {/* 전체 중앙 정렬 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5' // 배경색은 추후 수정
      }}>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
