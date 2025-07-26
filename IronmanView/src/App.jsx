import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Context 추가
import { AuthProvider } from './context/AuthContext';

// 기존 페이지들
import HomePage from './pages/HomePage';
import Training from './components/TrainingCam';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatBotPage from './pages/ChatBotPage';
import OnboardingPage from './pages/OnboardingPage';
import SchedulePage from './pages/SchedulePage';
import SurveyPage from './pages/SurveyPage';
import RoutinePage from './pages/RoutinePage';

// 추가된 페이지들
import MyPage from './pages/MyPage';
import ProfileEditPage from './pages/ProfileEditPage';
import EnvironmentSettingPage from './pages/EnvironmentSettingPage';

// 시험 페이지
import FontTest from './pages/FontTest';

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem('user');
  const isFirstLogin = localStorage.getItem('firstLogin') === 'true';

  useEffect(() => {
    if (location.pathname === '/' && isLogin && isFirstLogin) {
      localStorage.setItem('firstLogin', 'false');
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
      <Route path="/schedulepage" element={<SchedulePage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/routine" element={<RoutinePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/profile-edit" element={<ProfileEditPage />} />
      <Route path="/settings" element={<EnvironmentSettingPage />} />
      <Route path="/font" element={<FontTest />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
