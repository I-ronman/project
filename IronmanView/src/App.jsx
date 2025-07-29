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
import OnboardingPage from './pages/OnboardingPage';  // 온보딩 페이지 import
import SchedulePage from './pages/SchedulePage';
import SurveyPage from './pages/SurveyPage';
import RoutinePage from './pages/RoutinePage';
import RoutineDetail from './pages/RoutineDetail';
import ExerciseSearch from './pages/ExerciseSearch';
import { RoutineProvider } from './contexts/RoutineContext';

// 추가된 페이지들
import MyPage from './pages/MyPage';
import ProfileEditPage from './pages/ProfileEditPage';
import EnvironmentSettingPage from './pages/EnvironmentSettingPage';


// 시험 페이지
import PostureAnalysisPage from './pages/PostureAnalysisPage';
import StatisticsPage from './pages/StatisticsPage';
import WorkoutResultPage from './pages/WorkoutResultPage';
import AppLayout from './layouts/AppLayout';
import RankingPage from './pages/RankingPage';

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
      <Route path="/" element={<AppLayout/>}>
        <Route index element={<HomePage isLoggedIn={isLogin} />} />
        <Route path="training" element={<Training />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="chatbot" element={<ChatBotPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="schedulepage" element={<SchedulePage />} />
        <Route path="survey" element={<SurveyPage />} />
        <Route path="routine" element={<RoutinePage />} />
        <Route path="routinedetail" element={<RoutineDetail/>} />
        <Route path="search" element={<ExerciseSearch/>} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="profile-edit" element={<ProfileEditPage />} />
        <Route path="settings" element={<EnvironmentSettingPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="workoutresult" element={<WorkoutResultPage />} />
        <Route path="rankingpage" element={<RankingPage />} />
      </Route>
      <Route path="postureanalysis" element={<PostureAnalysisPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <RoutineProvider>
        <Router>
          {/* 전체 중앙 정렬 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000000ff' // 배경색은 추후 수정
          }}>
            <AppRoutes />
          </div>
        </Router>
      </RoutineProvider>
    </AuthProvider>
  );
}

export default App;
