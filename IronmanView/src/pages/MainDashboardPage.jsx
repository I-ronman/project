import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import { AuthContext } from '../context/AuthContext';
import {
  FaClipboardList, FaCalendarAlt, FaRobot, FaUsers,
  FaChartBar, FaTrophy, FaRunning
} from 'react-icons/fa';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const MainDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const todayRoutine = {
    exists: true,
    name: '전신 루틴'
  };

  const weeklyData = [
    { day: '월', routine: true, done: false },
    { day: '화', routine: true, done: true },
    { day: '수', routine: true, done: true },
    { day: '목', routine: false, done: false },
    { day: '금', routine: true, done: false },
    { day: '토', routine: false, done: false },
    { day: '일', routine: true, done: true },
  ];

  const completed = weeklyData.filter(d => d.done).length;
  const percent = Math.round((completed / 7) * 100);

  const doughnutData = {
    datasets: [{
      data: [percent, 100 - percent],
      backgroundColor: ['#A5EB47', '#333'],
      borderWidth: 0,
    }]
  };

  const doughnutOptions = {
    cutout: '70%',
    plugins: { tooltip: { enabled: false } },
  };

  const barChartData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '스트레칭',
        data: [2, 1, 2, 1, 3, 0, 2],
        backgroundColor: '#FBD157',
        stack: '운동'
      },
      {
        label: '근력',
        data: [1, 2, 3, 2, 1, 0, 1],
        backgroundColor: '#A5EB47',
        stack: '운동'
      },
      {
        label: '유산소',
        data: [1, 1, 2, 0, 1, 2, 1],
        backgroundColor: '#00CFFF',
        stack: '운동'
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 12 } }
      }
    },
    scales: {
      x: { stacked: true, ticks: { color: 'white' } },
      y: { stacked: true, ticks: { color: 'white' } }
    }
  };

  return (
    <div className="dark-background">
      <div className="main-container">

        {/* ✅ 프로필 카드 */}
        <div className="profile-card clickable-card" onClick={() => navigate('/profile-edit')}>
          <img src={user?.profileImage || '/default_profile.jpg'} alt="profile" className="profile-img" />
          <div className="profile-text">
            <div>환영합니다,</div>
            <div className="profile-name">{user?.name ?? '홍길동'} 님</div>
          </div>
        </div>

        {/* ✅ 메인 대시보드 카드들 */}
        <div className="dashboard-grid">
          <div className="dark-card clickable-card" onClick={() => navigate('/routine')}>
            <FaClipboardList className="card-icon" />
            <h3>루틴 짜기/추천받기</h3>
            <p>루틴을 직접 짜거나 AI에게 추천받아보세요.</p>
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/exercise')}>
            <FaRunning className="card-icon" />
            <h3>오늘의 루틴</h3>
            {todayRoutine.exists ? (
              <p>📌 오늘의 루틴: <strong>{todayRoutine.name}</strong></p>
            ) : (
              <p>오늘 등록된 루틴이 없습니다. 나만의 루틴을 만들어보세요!</p>
            )}
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/statistics')}>
            <FaChartBar className="card-icon" />
            <h3>통계 보기</h3>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/records')}>
            <FaCalendarAlt className="card-icon" />
            <h3>운동 기록</h3>
            <p>내가 기록한 운동 데이터를 한 눈에 확인하세요.</p>
          </div>

          <div className="dark-card calendar-card">
            <FaCalendarAlt className="card-icon" />
            <h3>주간 달성률</h3>
            <div className="calendar-progress">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="percent-label">{percent}%</div>
            </div>
            <div className="calendar-body">
              {weeklyData.map((day, idx) => (
                <div
                  key={idx}
                  className={`calendar-day ${day.done ? 'exercised' : day.routine ? 'has-routine' : ''}`}
                  onClick={() => navigate('/schedule')} // ✅ 날짜 클릭 시 스케줄로 이동
                >
                  {day.day}
                </div>
              ))}
            </div>
            <div className="calendar-legend">
              <span style={{ color: '#FBD157' }}>●</span> 루틴 있음 &nbsp;
              <span style={{ color: '#A5EB47' }}>●</span> 운동 완료 &nbsp;
              무색: 없음
            </div>
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/chatbot')}>
            <FaRobot className="card-icon" />
            <h3>AI 챗봇</h3>
            <p>홈트에 대한 궁금한 점을 AI가 도와드려요.</p>
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/board')}>
            <FaUsers className="card-icon" />
            <h3>커뮤니티</h3>
            <div className="post-preview">
              <h4>오늘 첫 운동 완료했어요!</h4>
              <p>스트레칭부터 유산소까지 알차게 했습니다</p>
            </div>
            <div className="post-preview">
              <h4>오운완 인증합니다!</h4>
              <p>푸쉬업, 플랭크, 스쿼트 루틴 돌림!</p>
            </div>
          </div>

          <div className="dark-card clickable-card" onClick={() => navigate('/ranking')}>
            <FaTrophy className="card-icon" />
            <h3>전체 랭킹</h3>
            <ul className="ranking-list">
              <li>🥇 철수 100점</li>
              <li>🥈 영희 98점</li>
              <li>🥉 민수 96점</li>
            </ul>
            <div className="my-rank">17등 / 전체</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;
