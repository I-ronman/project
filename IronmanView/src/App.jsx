// src/App.jsx
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoutineProvider } from './context/RoutineContext';

import HomePage               from './pages/HomePage';
import Training               from './components/TrainingCam';
import LoginPage              from './pages/LoginPage';
import SignupPage             from './pages/SignupPage';
import ChatBotPage            from './pages/ChatBotPage';
import OnboardingPage         from './pages/OnboardingPage';
import SchedulePage           from './pages/SchedulePage';
import SurveyPage             from './pages/SurveyPage';
import RoutinePage            from './pages/RoutinePage';
import RoutineDetail          from './pages/RoutineDetail';
import ExerciseSearch         from './pages/ExerciseSearch';
import MyPage                 from './pages/MyPage';
import ProfileEditPage        from './pages/ProfileEditPage';
import EnvironmentSettingPage from './pages/EnvironmentSettingPage';
import PostureAnalysisPage    from './pages/PostureAnalysisPage';
import StatisticsPage         from './pages/StatisticsPage';
import WorkoutResultPage      from './pages/WorkoutResultPage';
import RankingPage            from './pages/RankingPage';
import MainDashboardPage      from './pages/MainDashboardPage';
import AppLayout              from './layouts/AppLayout';
import BoardPage              from './pages/BoardPage';
import PostDetailPage         from './pages/PostDetailPage';
import PostureDetailPage      from './pages/PostureDetailPage';
import PostureFeedbackPage    from './pages/PostureFeedbackPage';
import BoardWritePage         from './pages/BoardWritePage';
import EditPostPage           from './pages/EditPostPage';
import RecordsPage            from './pages/RecordsPage';

import ModalWrapper           from './components/ModalWrapper';
import ExerciseExplore        from './pages/ExerciseExplore';

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin      = !!localStorage.getItem('user');
  const isFirstLogin = localStorage.getItem('firstLogin') === 'true';

  // 첫 로그인 시 온보딩으로 리다이렉트
  useEffect(() => {
    if (location.pathname === '/' && isLogin && isFirstLogin) {
      localStorage.setItem('firstLogin', 'false');
      navigate('/onboarding', { replace: true });
    }
  }, [location, isLogin, isFirstLogin, navigate]);

  // 모달 띄울 때 배경이 되는 location
  const backgroundLocation = location.state && location.state.backgroundLocation;

  return (
    <>
      {/* ● 기본 화면 라우팅 (모달 아닌 경우) */}
      <Routes location={backgroundLocation || location}>
        {/* 비로그인·랜딩 화면 */}
        <Route path="/" element={<HomePage isLoggedIn={isLogin} />} />

        {/* 로그인 후 공통 레이아웃 */}
        <Route path="/" element={<AppLayout />}>
          <Route path="training"           element={<Training />} />
          <Route path="login"              element={<LoginPage />} />
          <Route path="signup"             element={<SignupPage />} />
          <Route path="chatbot"            element={<ChatBotPage />} />
          <Route path="onboarding"         element={<OnboardingPage />} />
          <Route path="schedulepage"       element={<SchedulePage />} />
          <Route path="survey"             element={<SurveyPage />} />
          <Route path="routine"            element={<RoutinePage />} />
          <Route path="routinedetail"      element={<RoutineDetail />} />
          <Route path="search"             element={<ExerciseSearch />} />
          <Route path="mypage"             element={<MyPage />} />
          <Route path="profile-edit"       element={<ProfileEditPage />} />
          <Route path="settings"           element={<EnvironmentSettingPage />} />
          <Route path="statistics"         element={<StatisticsPage />} />
          <Route path="workoutresult"      element={<WorkoutResultPage />} />
          <Route path="ranking"            element={<RankingPage />} />
          <Route path="main"               element={<MainDashboardPage />} />
          <Route path="board"              element={<BoardPage />} />
          <Route path="post/:id"           element={<PostDetailPage />} />
          <Route path="posture-detail"     element={<PostureDetailPage />} />
          <Route path="posture-feedback"   element={<PostureFeedbackPage />} />
          <Route path="write"              element={<BoardWritePage />} />
          <Route path="edit/:id"           element={<EditPostPage />} />
          <Route path="records"            element={<RecordsPage />} />
          <Route path="exercise"           element={<ExerciseExplore/>} />
        </Route>

        {/* 독립 진입 시에도 동작해야 하는 경로 */}
        <Route path="postureanalysis" element={<PostureAnalysisPage />} />
      </Routes>

      {/* ● 모달 전용 라우팅: backgroundLocation 이 있을 때만 */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="posture-feedback"
            element={
              <ModalWrapper>
                <PostureFeedbackPage />
              </ModalWrapper>
            }
          />
        </Routes>
      )}
    </>
  );
};

function App() {
  const isLogin  = !!localStorage.getItem('user');
  const isLanding = window.location.pathname === '/' && !isLogin;

  return (
    <AuthProvider>
      <RoutineProvider>
        <Router>
          {isLanding ? (
            <AppRoutes />
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#000000ff',
            }}>
              <AppRoutes />
            </div>
          )}
        </Router>
      </RoutineProvider>
    </AuthProvider>
  );
}

export default App;
