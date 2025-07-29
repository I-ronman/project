import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import logoImage from '../assets/logo.png';
import defaultProfile from '../images/default_profile.jpg';

const MainDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '홍길동',
    profileImage: defaultProfile,
    hasSurvey: true,
    todayRoutine: {
      name: '루틴 A',
      totalTime: '30분',
      steps: ['스트레칭 5분', '스쿼트 10분', '플랭크 15분'],
    },
    unreadNotifications: 2,
  });

  const [calendarData, setCalendarData] = useState([
    { date: '2025-07-26', exercised: true, hasRoutine: false },
    { date: '2025-07-27', exercised: false, hasRoutine: true },
    { date: '2025-07-28', exercised: true, hasRoutine: true },
    { date: '2025-07-29', exercised: false, hasRoutine: false },
    { date: '2025-07-30', exercised: false, hasRoutine: false },
    { date: '2025-07-31', exercised: true, hasRoutine: true },
    { date: '2025-08-01', exercised: false, hasRoutine: false },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLogout = () => {
    navigate('/login');
  };

  const goToRoutineStart = () => {
    if (user.todayRoutine) {
      navigate('/postureanalysis', { state: { routine: user.todayRoutine } });
    }
  };

  const handleDateClick = () => {
    navigate('/schedulepage');
  };

  return (
    <div className="main-container dark-background">
      <div className="header">
        <img src={logoImage} alt="로고" className="logo" onClick={() => navigate('/main')} />
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </div>

      <div className="profile-card dark-card">
        <p className="welcome-text">어서오세요!</p>
        <div className="profile-info">
          <img src={user.profileImage} alt="프로필" className="profile-img" />
          <div>
            <h3>{user.name} 님</h3>
            <button className="edit-btn" onClick={() => navigate('/profile-edit')}>프로필 수정</button>
          </div>
          <div className="notification" onClick={() => alert('알림 기능')}>
            🔔
            {user.unreadNotifications > 0 && (
              <span className="badge">{user.unreadNotifications}</span>
            )}
          </div>
        </div>
      </div>

      <div className="routine-card dark-card">
        <div className="routine-header">
          <span>오늘 루틴시작</span>
          {user.todayRoutine ? (
            <>
              <span>{user.todayRoutine.name}</span>
              <button className="start-btn" onClick={goToRoutineStart}>▶</button>
            </>
          ) : (
            <span>오늘의 루틴이 없습니다. 루틴을 지정/생성해주세요.</span>
          )}
        </div>
        {user.todayRoutine && (
          <div className="routine-detail">
            {user.todayRoutine.steps.map((s, idx) => (
              <p key={idx}>{s}</p>
            ))}
            <p>총 소요 시간: {user.todayRoutine.totalTime}</p>
          </div>
        )}
      </div>

      <div className="dashboard">
        <div className="dashboard-row">
          <div className="dashboard-card dark-card" onClick={() => navigate('/routine')}>
            <p>루틴 짜기/추천받기</p>
            <span>루틴을 직접 짜거나 추천받아 보세요.</span>
          </div>
          {!user.hasSurvey && (
            <div className="dashboard-card dark-card" onClick={() => navigate('/survey')}>
              <p>맞춤 설정</p>
              <span>루틴 추천을 위해 설문을 작성해주세요.</span>
            </div>
          )}
        </div>

        <div className="calendar-card dark-card">
          <div className="calendar-header">
            <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>◀</button>
            <span>주간 목표</span>
            <button onClick={() => setCurrentIndex(currentIndex + 1)}>▶</button>
          </div>
          <div className="calendar-body">
            {calendarData.map((day, idx) => (
              <div
                key={idx}
                className={`calendar-day ${
                  day.exercised ? 'exercised' : day.hasRoutine ? 'has-routine' : ''
                }`}
                onClick={handleDateClick}
              >
                {parseInt(day.date.slice(-2))}일
              </div>
            ))}
          </div>
          <div className="weekly-goal">5/7</div>
        </div>

        <div className="ranking-card dark-card" onClick={() => navigate('/ranking')}>
          <p>🏆 랭킹</p>
          <ol>
            <li>🥇 신라면</li>
            <li>🥈 진라면</li>
            <li>🥉 짜파게티</li>
          </ol>
          <p className="my-rank">255등 / 전체</p>
        </div>
      </div>

      <div className="chatbot-section" onClick={() => navigate('/chatbot')}>
        <div className="chatbot-bubble">💬</div>
        <p>I봇</p>
      </div>
    </div>
  );
};

export default MainDashboardPage;
