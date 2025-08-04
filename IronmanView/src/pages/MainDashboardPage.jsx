import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import defaultProfile from '../images/default_profile.jpg';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// ✅ 예시용 dummy 데이터
const dummyData = {
  weeklyStats: [
    { chartData: { '스쿼트': 3, '푸쉬업': 2 } },
    { chartData: { '스쿼트': 1, '푸쉬업': 1 } },
    { chartData: { '스쿼트': 2, '푸쉬업': 3 } },
    { chartData: { '스쿼트': 2, '푸쉬업': 1, '플랭크': 2 } },
    { chartData: { '푸쉬업': 1 } },
    { chartData: { '스쿼트': 0 } },
    { chartData: {} },
  ],
  exerciseColors: {
    '스쿼트': '#FF5C5C',
    '푸쉬업': '#4A90E2',
    '플랭크': '#7ED957',
  }
};

const MainDashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser, surveyDone } = useContext(AuthContext);

  // ——————————————————————————————
  // 프로필·알림·게시글 상태
  const [calendarData, setCalendarData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [posts] = useState([
    { title: "오늘 첫 운동 완료했어요!", content: "스트레칭부터 유산소까지 알차게 했습니다. 여러분도 힘내세요!" },
    { title: "질문이 있어요", content: "하체 루틴을 바꿔보려고 하는데 추천 있을까요?" },
  ]);

  // 사용자 정보 로드
  useEffect(() => {
    axios.get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email, preferences = [], todayRoutine, hasSurvey, unreadNotifications = 0 } = res.data;
        setUser(prev => ({ ...prev, name, email, preferences, todayRoutine, hasSurvey, unreadNotifications }));
      })
      .catch(() => navigate('/login'));
  }, []);

  // 오늘 캘린더 데이터 (더미)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCalendarData([{ date: today, exercised: true, hasRoutine: true }]);
  }, []);

  // 오늘 루틴 알림
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (calendarData.some(d => d.date === today && d.hasRoutine)) {
      setNotifications([{ time: '07:00', message: `${today}에 오늘의 루틴이 있습니다.`, read: false }]);
    }
  }, [calendarData]);

  const handleNotificationClick = () => {
    setShowNotifications(v => !v);
    setUser(u => ({ ...u, unreadNotifications: 0 }));
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  // ——————————————————————————————
  // 1) 통계 차트용: 오늘 기준 고정 7일
  const statWeekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - 3));
    return d;
  });
  const statData = statWeekDates.map((d, idx) => ({
    name: `${d.getDate()}일`,
    ...dummyData.weeklyStats[idx]?.chartData
  }));

  // ——————————————————————————————
  // 2) 주간 목표 캘린더용: 화살표로 이동
  const [calendarCenterDate, setCalendarCenterDate] = useState(new Date());
  const changeWeek = offset => {
    const d = new Date(calendarCenterDate);
    d.setDate(d.getDate() + offset * 7);
    setCalendarCenterDate(d);
  };
  const calendarDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(calendarCenterDate);
    d.setDate(d.getDate() + (i - 3));
    return d;
  });
  const weekData = calendarDates.map(d => {
    const ds = d.toISOString().split('T')[0];
    return {
      ...calendarData.find(c => c.date === ds) || { exercised: false, hasRoutine: false },
      dayLabel: `${d.getDate()}일`
    };
  });
  const completedDays = weekData.filter(d => d.exercised).length;
  const totalDays = 7;
  const percentage = Math.round((completedDays / totalDays) * 100);
  const yearMonthLabel = `${calendarCenterDate.getFullYear()}년 ${calendarCenterDate.getMonth() + 1}월`;

  // ——————————————————————————————
  // 대시보드 카드 모음
  const DASHBOARD_COMPONENTS = {
    '운동 루틴 추천': (
      <div className="dashboard-card dark-card clickable-card"
           onClick={() => navigate('/routine')}
           key="routine"
      >
        <p>루틴 짜기/추천받기</p>
        <span>루틴을 직접 짜거나 추천받아 보세요.</span>
      </div>
    ),
    '챗봇 서비스': (
      <div className="dashboard-card dark-card clickable-card"
           onClick={() => navigate('/chatbot')}
           key="chatbot"
      >
        <p>AI 챗봇</p>
        <span>운동 및 건강 관련 질문을 도와드려요.</span>
      </div>
    ),
    '통계 보기': (
      <div className="dashboard-card dark-card clickable-card full-width"
           onClick={() =>
             (user?.hasSurvey || surveyDone)
               ? navigate('/statistics')
               : navigate('/survey')
           }
           key="statistics"
      >
        {user?.hasSurvey || surveyDone ? (
          <>
            <p>📊 통계 보기</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={statData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {Object.entries(dummyData.exerciseColors).map(([k, col]) =>
                  <Bar key={k} dataKey={k} stackId="a" fill={col} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <>
            <p>📝 설문조사</p>
            <span>AI 루틴 추천을 위해 설문을 완료해 주세요.</span>
            <p className="survey-link">통계 보러가기 →</p>
          </>
        )}
      </div>
    )
  };

  // 사용자 선호도 순서대로
  const ordered = [], fallback = [];
  Object.entries(DASHBOARD_COMPONENTS).forEach(([k,c]) => {
    (user?.preferences?.includes(k) ? ordered : fallback).push(c);
  });

  return (
    <div className="main-container dark-background">

      {/* 프로필 & 알림 */}
      <div className="profile-card dark-card clickable-card"
           onClick={() => navigate('/mypage')}
      >
        <div className="profile-info">
          <img src={user?.profileImage || defaultProfile}
               alt="프로필"
               className="profile-img" />
          <div className="profile-texts">
            <p className="welcome-text">어서오세요!</p>
            <p className="username-text">{user?.name || '홍길동'} 님</p>
          </div>
        </div>
        <div className="notification-icon"
             onClick={e => { e.stopPropagation(); handleNotificationClick(); }}
        >
          🔔{user?.unreadNotifications > 0 && <span className="badge">{user.unreadNotifications}</span>}
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0
                ? <p>알림 없음</p>
                : notifications.map((n,i) =>
                    <p key={i}>⏰ {n.time} - {n.message}</p>
                  )
              }
            </div>
          )}
        </div>
      </div>

      {/* 오늘 루틴 시작 */}
      <div className="routine-card dark-card clickable-card"
           onClick={() =>
             user?.todayRoutine
               ? navigate('/postureanalysis', { state: { routine: user.todayRoutine } })
               : navigate('/routine')
           }
      >
        <div className="routine-header">
          <strong className="routine-title">오늘 루틴 시작</strong>
          {user?.todayRoutine
            ? <span className="routine-name">{user.todayRoutine.name}</span>
            : <span className="routine-name">등록된 루틴이 없습니다.</span>
          }
        </div>
        {user?.todayRoutine && (
          <div className="routine-detail">
            {user.todayRoutine.steps.map((s,i) => <p key={i}>{s}</p>)}
            <p>총 소요 시간: {user.todayRoutine.totalTime}</p>
          </div>
        )}
      </div>

      {/* 대시보드 카드 */}
      <div className="dashboard">
        <div className="dashboard-row">
          {ordered}
          {fallback}
        </div>

        {/* 주간 목표 캘린더 */}
        <div className="calendar-card dark-card">
          <div className="calendar-header">
            <span className="arrow" onClick={() => changeWeek(-1)}>◀</span>
            <span>{yearMonthLabel} 주간 목표</span>
            <span className="arrow" onClick={() => changeWeek(1)}>▶</span>
          </div>
          <div className="weekly-goal">{completedDays}/{totalDays}</div>
          <div className="circular-progress"
               style={{ background: `conic-gradient(#a5eb47 0% ${percentage}%, #333 ${percentage}% 100%)` }}
          >
            <div className="circular-progress-text">{percentage}%</div>
          </div>
          <div className="calendar-body">
            {weekData.map((day,i) => (
              <div key={i}
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

        {/* 랭킹 */}
        <div className="ranking-card dark-card clickable-card" onClick={() => navigate('/ranking')}>
          <p>🏆 랭킹</p>
          <ol>
            <li>🥇 신라면</li>
            <li>🥈 진라면</li>
            <li>🥉 짜파게티</li>
          </ol>
          <p className="my-rank">255등 / 전체</p>
        </div>

        {/* 게시판 */}
        <div className="board-card dark-card clickable-card" onClick={() => navigate('/board')}>
          <p className="board-title">📌 커뮤니티 게시판</p>
          {posts.length === 0
            ? <div className="board-empty"><p>아직 게시글이 없습니다.</p><p>첫 게시글을 올려보세요!</p></div>
            : <div className="board-preview">
                {posts.slice(0,2).map((p,i)=>(
                  <div key={i} className="post-preview"><h4>{p.title}</h4><p>{p.content.slice(0,40)}...</p></div>
                ))}
                <p className="view-more">더보기 →</p>
              </div>
          }
        </div>
      </div>

      {/* 챗봇 */}
      <div className="chatbot-section clickable-card" onClick={() => navigate('/chatbot')}>
        <div className="chatbot-bubble">💬</div>
        <p>I봇</p>
      </div>
    </div>
  );
};

export default MainDashboardPage;
