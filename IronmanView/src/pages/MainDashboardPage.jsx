import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import defaultProfile from '../images/default_profile.jpg'; // 필요 시 경로 수정

// ✅ useState 위에 위치
const getWeekStart = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const MainDashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [calendarData, setCalendarData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
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
    axios.get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email, preferences = [], todayRoutine, hasSurvey, unreadNotifications = 0 } = res.data;
        setUser(prev => ({ ...prev, name, email, preferences, todayRoutine, hasSurvey, unreadNotifications }));
      })
      .catch(() => navigate('/login'));
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCalendarData([
      { date: today, exercised: true, hasRoutine: true },
    ]);
  }, []);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRoutine = calendarData.find(d => d.date === todayStr && d.hasRoutine);
    if (todayRoutine) {
      setNotifications([{ time: '07:00', message: `${todayStr}에 오늘의 루틴이 있습니다.`, read: false }]);
    }
  }, [calendarData]);

  const handleNotificationClick = () => {
    setShowNotifications(prev => !prev);
    setUser(prev => ({ ...prev, unreadNotifications: 0 }));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const changeWeek = (offset) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + offset * 7);
    setCurrentWeekStart(getWeekStart(newStart));
  };

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
      dayLabel: `${d.getDate()}일`,
    };
  });

  const completedDays = weekData.filter(d => d.exercised).length;
  const totalDays = weekData.length;
  const percentage = Math.round((completedDays / totalDays) * 100);
  const yearMonthLabel = `${currentWeekStart.getFullYear()}년 ${currentWeekStart.getMonth() + 1}월`;

  const DASHBOARD_COMPONENTS = {
    '운동 루틴 추천': (
      <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/routine')} key="routine">
        <p>루틴 짜기/추천받기</p>
        <span>루틴을 직접 짜거나 추천받아 보세요.</span>
      </div>
    ),
    '실시간 자세 교정': (
      <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/postureanalysis')} key="posture">
        <p>실시간 자세 교정</p>
        <span>카메라를 통해 자세를 분석하고 피드백을 드려요.</span>
      </div>
    ),
    '챗봇 서비스': (
      <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/chatbot')} key="chatbot">
        <p>AI 챗봇</p>
        <span>운동 및 건강 관련 질문을 도와드려요.</span>
      </div>
    ),
    '통계 보기': (
      <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/statistics')} key="statistics">
        <p>📊 통계 보기</p>
        <span>이번 주 운동 결과를 확인해보세요.</span>
      </div>
    )
  };

  const orderedComponents = [];
  const fallbackComponents = [];

  Object.entries(DASHBOARD_COMPONENTS).forEach(([key, comp]) => {
    if (user?.preferences?.includes(key)) {
      orderedComponents.push(comp);
    } else if (key === '통계 보기') {
      orderedComponents.push(comp);
    } else {
      fallbackComponents.push(comp);
    }
  });

  return (
    <div className="main-container dark-background">
      <div className="profile-card dark-card clickable-card" onClick={() => navigate('/mypage')}>
        <div className="profile-info">
          <img src={user?.profileImage || defaultProfile} alt="프로필" className="profile-img" />
          <div className="profile-texts">
            <p className="welcome-text">어서오세요!</p>
            <p className="username-text">{user?.name || '홍길동'} 님</p>
          </div>
        </div>
        <div className="notification-icon" onClick={(e) => { e.stopPropagation(); handleNotificationClick(); }}>
          🔔
          {user?.unreadNotifications > 0 && <span className="badge">{user.unreadNotifications}</span>}
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? <p>알림 없음</p> :
                notifications.map((n, idx) => <p key={idx}>⏰ {n.time} - {n.message}</p>)}
            </div>
          )}
        </div>
      </div>

      <div className="routine-card dark-card clickable-card" onClick={() => {
        if (user?.todayRoutine) navigate('/postureanalysis', { state: { routine: user.todayRoutine } });
      }}>
        <div className="routine-header">
          <strong className="routine-title">오늘 루틴 시작</strong>
          {user?.todayRoutine && <span className="routine-name">{user.todayRoutine.name}</span>}
        </div>
        {user?.todayRoutine && (
          <div className="routine-detail">
            {user.todayRoutine.steps.map((s, idx) => <p key={idx}>{s}</p>)}
            <p>총 소요 시간: {user.todayRoutine.totalTime}</p>
          </div>
        )}
      </div>

      <div className="dashboard">
        <div className="dashboard-row">
          {orderedComponents}
          {fallbackComponents}
        </div>

        <div className="calendar-card dark-card">
          <div className="calendar-header">
            <span className="arrow" onClick={() => changeWeek(-1)}>◀</span>
            <span>{yearMonthLabel} 주간 목표</span>
            <span className="arrow" onClick={() => changeWeek(1)}>▶</span>
          </div>
          <div className="weekly-goal">{completedDays}/{totalDays}</div>
          <div className="circular-progress" style={{
            background: `conic-gradient(#a5eb47 0% ${percentage}%, #333 ${percentage}% 100%)`
          }}>
            <div className="circular-progress-text">{percentage}%</div>
          </div>
          <div className="calendar-body">
            {weekData.map((day, idx) => (
              <div
                key={idx}
                className={`calendar-day ${day.exercised ? 'exercised' : day.hasRoutine ? 'has-routine' : ''}`}
                onClick={() => navigate('/schedulepage')}
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
