import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import defaultProfile from '../images/default_profile.jpg';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

import {
  FaRobot, FaDumbbell, FaChartBar,
  FaClipboardList, FaTrophy, FaUsers, FaCalendarAlt
} from 'react-icons/fa';

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

  const [calendarData, setCalendarData] = useState([]);
  const [posts] = useState([
    { title: "오늘 첫 운동 완료했어요!", content: "스트레칭부터 유산소까지 알차게 했습니다." },
    { title: "질문이 있어요", content: "하체 루틴을 바꿔보려고 하는데 추천 있을까요?" },
  ]);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email, preferences = [], todayRoutine, hasSurvey } = res.data;
        setUser(prev => ({ ...prev, name, email, preferences, todayRoutine, hasSurvey }));
      })
      .catch(() => navigate('/login'));
  }, [navigate, setUser]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCalendarData([{ date: today, exercised: true, hasRoutine: true }]);
  }, []);

  const statWeekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - 3));
    return d;
  });
  const statData = statWeekDates.map((d, idx) => ({
    name: `${d.getDate()}일`,
    ...dummyData.weeklyStats[idx]?.chartData
  }));

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

  const [previewTop3] = useState([
    { id: 1, name: '김철수', score: 98 },
    { id: 2, name: '이영희', score: 92 },
    { id: 3, name: '박민준', score: 89 },
  ]);
  const [myRank] = useState('-');

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
      </div>

      <div className="routine-card dark-card clickable-card"
        onClick={() =>
          user?.todayRoutine
            ? navigate('/postureanalysis', { state: { routine: user.todayRoutine } })
            : navigate('/routine')}>
        <div className="routine-header">
          <FaDumbbell className="card-icon" />
          <strong className="routine-title">오늘 루틴 시작</strong>
          {user?.todayRoutine
            ? <span className="routine-name">{user.todayRoutine.name}</span>
            : <span className="no-routine-text">등록된 루틴이 없습니다.</span>}
        </div>
      </div>

      <div className="dashboard-row">

        <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/routine')}>
          <FaClipboardList className="card-icon" />
          <p>루틴 짜기/추천받기</p>
          <span>루틴을 직접 짜거나 추천받아 보세요.</span>
        </div>

        <div className="dashboard-card dark-card clickable-card"
          onClick={() =>
            (user?.hasSurvey || surveyDone)
              ? navigate('/statistics')
              : navigate('/survey')}>
          <FaChartBar className="card-icon" />
          {user?.hasSurvey || surveyDone ? (
            <>
              <p>통계 보기</p>
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

        <div className="dashboard-card dark-card clickable-card" onClick={() => navigate('/records')}>
          <FaClipboardList className="card-icon" />
          <p>운동 기록 확인</p>
          <span>꾸준히 쌓아온 운동 기록을 확인해보세요.</span>
        </div>

        <div className="calendar-card dark-card">
          <FaCalendarAlt className="card-icon" />
          <div className="calendar-header">
            <span className="arrow" onClick={() => changeWeek(-1)}>◀</span>
            <span>{yearMonthLabel} 주간 목표</span>
            <span className="arrow" onClick={() => changeWeek(1)}>▶</span>
          </div>
          <div className="weekly-goal">{completedDays}/{totalDays}</div>
          <div className="circular-progress"
            style={{ background: `conic-gradient(#a5eb47 0% ${percentage}%, #2b2b2b ${percentage}% 100%)` }}>
            <div className="circular-progress-text">{percentage}%</div>
          </div>
          <div className="calendar-body">
            {weekData.map((day, i) => (
              <div key={i}
                className={`calendar-day ${day.exercised ? 'exercised' : day.hasRoutine ? 'has-routine' : ''}`}
                onClick={() => navigate('/schedulepage')}>
                {day.dayLabel}
              </div>
            ))}
          </div>
        </div>

        <div className="board-card dark-card clickable-card large-card" onClick={() => navigate('/board')}>
          <FaUsers className="card-icon" />
          <p className="board-title">📌 커뮤니티 게시판</p>
          {posts.map((p, i) => (
            <div key={i} className="post-preview">
              <h4>{p.title}</h4>
              <p>{p.content.slice(0, 40)}...</p>
            </div>
          ))}
        </div>

        <div className="ranking-card dark-card clickable-card" onClick={() => navigate('/ranking')}>
          <FaTrophy className="card-icon" />
          <p className="ranking-card-title">전체 랭킹 Top 3</p>
          <ol className="ranking-list">
            {previewTop3.map((item, idx) => (
              <li key={item.id}>
                {['🥇', '🥈', '🥉'][idx]} {item.name} {item.score}점
              </li>
            ))}
          </ol>
          <p className="my-rank">{myRank}등 / 전체</p>
        </div>

        <div className="dashboard-card dark-card clickable-card chatbot-card" onClick={() => navigate('/chatbot')}>
          <FaRobot className="card-icon" />
          <p>AI 챗봇</p>
          <span>운동 및 건강 관련 질문을 도와드려요.</span>
        </div>
      </div>

      <div className="chatbot-section clickable-card" onClick={() => navigate('/chatbot')}>
        <div className="chatbot-bubble">
          <FaRobot />
        </div>
        <p>I봇</p>
      </div>
    </div>
  );
};

export default MainDashboardPage;
