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
    unreadNotifications: 1,
  });

  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [calendarData, setCalendarData] = useState([
    { date: '2025-07-21', exercised: false, hasRoutine: false },
    { date: '2025-07-22', exercised: true, hasRoutine: true },
    { date: '2025-07-23', exercised: false, hasRoutine: true },
    { date: '2025-07-24', exercised: true, hasRoutine: true },
    { date: '2025-07-25', exercised: false, hasRoutine: false },
    { date: '2025-07-26', exercised: true, hasRoutine: false },
    { date: '2025-07-27', exercised: false, hasRoutine: true },
    { date: '2025-07-28', exercised: true, hasRoutine: true },
    { date: '2025-07-29', exercised: false, hasRoutine: false },
    { date: '2025-07-30', exercised: false, hasRoutine: false },
    { date: '2025-07-31', exercised: true, hasRoutine: true },
    { date: '2025-08-01', exercised: false, hasRoutine: false },
  ]);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [posts, setPosts] = useState([
    {
      title: "오늘 첫 운동 완료했어요!",
      content: "스트레칭부터 유산소까지 알차게 했습니다. 여러분도 힘내세요!",
    },
    {
      title: "질문이 있어요",
      content: "하체 루틴을 바꿔보려고 하는데 추천 있을까요?",
    },
  ]);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayRoutine = calendarData.find((d) => d.date === todayStr && d.hasRoutine);
    if (todayRoutine) {
      setNotifications([
        {
          time: '07:00',
          message: `${todayStr}에 오늘의 루틴이 있습니다.`,
          read: false,
        },
      ]);
    }
  }, []);

  const handleLogout = () => navigate('/login');
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setUser((prev) => ({ ...prev, unreadNotifications: 0 }));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const goToRoutineStart = () => {
    if (user.todayRoutine) {
      navigate('/postureanalysis', { state: { routine: user.todayRoutine } });
    }
  };

  const handleDateClick = () => navigate('/schedulepage');

  const changeWeek = (offset) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + offset * 7);
    setCurrentWeekStart(getWeekStart(newStart));
  };

  function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  const getWeekDates = () => {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      weekDates.push(d);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const weekData = weekDates.map((d) => {
    const dateStr = d.toISOString().split('T')[0];
    return {
      ...calendarData.find((c) => c.date === dateStr) || { date: dateStr, exercised: false, hasRoutine: false },
      dayLabel: `${d.getDate()}일`
    };
  });

  const completedDays = weekData.filter((d) => d.exercised).length;
  const totalDays = weekData.length;
  const percentage = Math.round((completedDays / totalDays) * 100);
  const yearMonthLabel = `${currentWeekStart.getFullYear()}년 ${currentWeekStart.getMonth() + 1}월`;

  return (
    <div className="main-container dark-background">
      
      <div className="profile-card dark-card clickable-card" onClick={() => navigate('/mypage')}>
        <div className="profile-info">
          <img src={user.profileImage} alt="프로필" className="profile-img" />
          <div className="profile-texts">
            <p className="welcome-text">어서오세요!</p>
            <p className="username-text">{user.name} 님</p>
          </div>
        </div>
        <div className="notification-icon" onClick={(e) => { e.stopPropagation(); handleNotificationClick(); }}>
          🔔
          {user.unreadNotifications > 0 && (
            <span className="badge">{user.unreadNotifications}</span>
          )}
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? (
                <p>알림 없음</p>
              ) : (
                notifications.map((n, idx) => (
                  <p key={idx}>⏰ {n.time} - {n.message}</p>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="routine-card dark-card clickable-card" onClick={goToRoutineStart}>
        <div className="routine-header">
          <strong className="routine-title">오늘 루틴시작</strong>
          {user.todayRoutine && <span className="routine-name">{user.todayRoutine.name}</span>}
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
          <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/routine')}>
            <p>루틴 짜기/추천받기</p>
            <span>루틴을 직접 짜거나 추천받아 보세요.</span>
          </div>
          {!user.hasSurvey && (
            <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/survey')}>
              <p>맞춤 설정</p>
              <span>루틴 추천을 위해 설문을 작성해주세요.</span>
            </div>
          )}
        </div>

        <div className="calendar-card dark-card">
          <div className="calendar-header">
            <span className="arrow" onClick={() => changeWeek(-1)}>◀</span>
            <span>{yearMonthLabel} 주간 목표</span>
            <span className="arrow" onClick={() => changeWeek(1)}>▶</span>
          </div>
          <div className="weekly-goal">{completedDays}/{totalDays}</div>
          <div
            className="circular-progress"
            style={{
              background: `conic-gradient(#a5eb47 0% ${percentage}%, #333 ${percentage}% 100%)`
            }}
          >
            <div className="circular-progress-text">{percentage}%</div>
          </div>
          <div className="calendar-body">
            {weekData.map((day, idx) => (
              <div
                key={idx}
                className={`calendar-day ${day.exercised ? 'exercised' : day.hasRoutine ? 'has-routine' : ''}`}
                onClick={handleDateClick}
              >
                {day.dayLabel}
              </div>
            ))}
          </div>
          <div className="legend">
            <div><span className="legend-box green" /> 운동 완료</div>
            <div><span className="legend-box blue" /> 루틴 있음</div>
            <div><span className="legend-box gray" /> 루틴 없음</div>
          </div>
        </div>

        <div className="ranking-card dark-card clickable-card" onClick={() => navigate('/ranking')}>
          <p>🏆 랭킹</p>
          <ol>
            <li>🥇 신라면</li>
            <li>🥈 진라면</li>
            <li>🥉 짜파게티</li>
          </ol>
          <p className="my-rank">255등 / 전체</p>
        </div>

        {/* 게시판 카드 추가 */}
        <div className="board-card dark-card clickable-card" onClick={() => navigate('/board')}>
          <p className="board-title">📌 커뮤니티 게시판</p>
          {posts.length === 0 ? (
            <div className="board-empty">
              <p>아직 게시글이 없습니다.</p>
              <p><strong>첫 게시글</strong>을 올려보세요!</p>
            </div>
          ) : (
            <div className="board-preview">
              {posts.slice(0, 2).map((post, index) => (
                <div key={index} className="post-preview">
                  <h4>{post.title}</h4>
                  <p>{post.content.slice(0, 40)}...</p>
                </div>
              ))}
              <p className="view-more">더보기 →</p>
            </div>
          )}
        </div>
      </div>

      <div className="chatbot-section clickable-card" onClick={() => navigate('/chatbot')}>
        <div className="chatbot-bubble">💬</div>
        <p>I봇</p>
      </div>
    </div>
  );
};

export default MainDashboardPage;
