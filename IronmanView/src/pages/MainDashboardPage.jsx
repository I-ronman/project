// src/pages/MainDashboardPage.jsx
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainDashboardPage.css';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FaClipboardList,
  FaCalendarAlt,
  FaRobot,
  FaUsers,
  FaChartBar,
  FaTrophy,
  FaRunning,
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

/* ----------------------- 더미 데이터 (프론트용) ----------------------- */
// 날짜별(최근 7일) 상체/코어/하체 각각 소요 시간(분)
const statsData = [
  { date: '08-01', upper: 18, core: 6,  lower: 8 },
  { date: '08-02', upper: 12, core: 10, lower: 14 },
  { date: '08-03', upper: 20, core: 8,  lower: 8 },
  { date: '08-04', upper: 9,  core: 5,  lower: 22 },
  { date: '08-05', upper: 14, core: 6,  lower: 12 },
  { date: '08-06', upper: 16, core: 12, lower: 9 },
  { date: '08-07', upper: 8,  core: 4,  lower: 10 },
];

const exerciseColors = {
  upper: '#FBD157', // 상체
  core:  '#A5EB47', // 코어
  lower: '#00C9FF', // 하체
};

// 최근 운동 기록(간단 리스트 + 스파크바)
const recentRecords = [
  { date: '08-07', minutes: 20, tags: ['#하체', '#유산소'] },
  { date: '08-06', minutes: 35, tags: ['#상체', '#코어'] },
  { date: '08-05', minutes: 30, tags: ['#코어', '#전신'] },
];

// 커뮤니티 프리뷰
const posts = [
  { title: '오늘 첫 운동 완료했어요!', content: '스트레칭부터 유산소까지 알차게 했습니다' },
  { title: '오운완 인증합니다!', content: '푸쉬업, 플랭크, 스쿼트 루틴 돌림!' },
];

// 랭킹 프리뷰
const previewTop3 = [
  { id: 1, name: '대상혁', score: 100 },
  { id: 2, name: '정지훈', score: 96 },
  { id: 3, name: '김건우', score: 92 },
];

// 주간 달성률/도넛 예시
const percentage = 72;
const weekData = [
  { dayLabel: '월', exercised: true },
  { dayLabel: '화', exercised: false, hasRoutine: true },
  { dayLabel: '수', exercised: true },
  { dayLabel: '목', exercised: true },
  { dayLabel: '금', exercised: false },
  { dayLabel: '토', exercised: true },
  { dayLabel: '일', exercised: false, hasRoutine: true },
];

// 오늘의 루틴 예시 (null이면 없음)
const todayRoutine = {
  name: '상체+코어 집중 루틴',
  // name: null, // <- 루틴 없을 때 테스트
};

/* ----------------------- Recharts 커스텀 툴팁 ----------------------- */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const items = payload
    .map((p) => ({ name: p.name, value: p.value, color: p.fill }))
    .filter((i) => i.value > 0);

  const total = items.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="recharts-tooltip">
      <div className="tooltip-title">{label}</div>
      <ul className="tooltip-list">
        {items.map((i) => (
          <li key={i.name} className="tooltip-line">
            <span className="dot" style={{ background: i.color }} />
            <span>{i.name}</span>
            <strong style={{ marginLeft: 'auto' }}>{i.value}분</strong>
          </li>
        ))}
      </ul>
      <div className="tooltip-total">합계 {total}분</div>
    </div>
  );
};

/* =================================================================== */

const MainDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const needSurvey = useMemo(() => !user?.hasSurvey, [user]);
  const gridClass = needSurvey ? 'has-survey' : 'no-survey';

  const hasTodayRoutine = Boolean(todayRoutine?.name);

  return (
    <div className="main-container dark-background">
      <div className={`dashboard-grid ${gridClass}`}>

        {/* 프로필 */}
        <motion.div
          className="card dark-card profile-card clickable-card"
          onClick={() => navigate('/mypage')}
          whileHover={{ scale: 1.02 }}
        >
          <img
            className="profile-img"
            src={user?.face || '/images/default_profile.jpg'}
            alt="profile"
          />
          <div>
            <div className="card-subtitle" style={{ opacity: 0.9 }}>환영합니다,</div>
            <div className="profile-name">{user?.name ?? '홍길동'} 님</div>
          </div>
        </motion.div>

        {/* 오늘의 루틴 시작하기 */}
        <motion.div
          className={`card dark-card start-card clickable-card ${!hasTodayRoutine ? 'disabled-card' : ''}`}
          onClick={() => hasTodayRoutine && navigate('/exercise')}
          whileHover={hasTodayRoutine ? { scale: 1.01 } : {}}
        >
          <FaRunning className="card-icon" />
          <div className="start-title">
            오늘의 루틴 <span className="start-accent">시작하기</span>
          </div>

          {hasTodayRoutine ? (
            <div className="start-desc">
              오늘 예정된 루틴: <strong>{todayRoutine.name}</strong>
            </div>
          ) : (
            <div className="start-desc">
              오늘의 루틴이 없습니다. <br />
              루틴을 직접 만들거나 추천받아보세요.
            </div>
          )}
        </motion.div>

        {/* 주간 달성률 */}
        <motion.div className="card dark-card donut-card" whileHover={{ scale: 1.01 }}>
          <div className="card-header">
            <FaCalendarAlt className="card-icon" />
            <div className="card-title">주간 달성률</div>
            <span className="card-subtitle">8월 1주차</span>
          </div>
          <div className="calendar-progress" aria-label={`달성률 ${percentage}%`}>
            <svg width="120" height="120" viewBox="0 0 120 120" role="img">
              <g transform="rotate(-90,60,60)">
                <circle cx="60" cy="60" r="44" stroke="#333" strokeWidth="12" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  stroke="#A5EB47"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={(2 * Math.PI * 44) * (1 - percentage / 100)}
                />
              </g>
            </svg>
            <div className="percent-label">{percentage}%</div>
          </div>
          <div className="calendar-body">
            {weekData.map((d, i) => (
              <div
                key={i}
                className={`calendar-day ${d.exercised ? 'exercised' : d.hasRoutine ? 'has-routine' : ''}`}
                onClick={() => navigate('/schedulepage')}
              >
                {d.dayLabel}
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <span className="legend-dot routine" /> 루틴
            <span className="legend-dot done" /> 완료
          </div>
        </motion.div>

        {/* 설문 카드 */}
        {needSurvey && (
          <motion.div
            className="card dark-card survey-card clickable-card"
            onClick={() => navigate('/survey')}
            whileHover={{ scale: 1.01 }}
          >
            <span className="survey-badge">필수</span>
            <FaClipboardList className="card-icon" />
            <div className="survey-content">
              <div className="survey-title">AI 맞춤 추천을 위한 설문</div>
              <div className="survey-desc">선호 운동/목표를 알려주시면 맞춤 루틴을 추천해 드립니다.</div>
              <button type="button" className="survey-btn">지금 설문하기</button>
            </div>
          </motion.div>
        )}

        {/* 루틴 짜기/추천받기 */}
        <motion.div
          className="card dark-card builder-card clickable-card"
          onClick={() => navigate('/routine')}
          whileHover={{ scale: 1.02 }}
        >
          <FaClipboardList className="card-icon" />
          <div>
            <div className="builder-title">루틴 짜기/추천받기</div>
            <div className="muted">내가 직접 만들거나, AI에게 추천을 받아보세요.</div>
          </div>
        </motion.div>

        {/* 통계 보기 */}
        <motion.div
          className="card dark-card stats-card clickable-card"
          onClick={() => navigate('/statistics')}
          whileHover={{ scale: 1.02 }}
        >
          <FaChartBar className="card-icon" />
          <div className="card-title" style={{ marginBottom: 8 }}>통계 보기</div>
          <div className="card-subtitle" style={{ marginBottom: 6 }}>날짜별 운동시간(분) — 항목별 스택</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statsData} margin={{ left: 4, right: 8, top: 4, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: '#e0e0e0' }} />
              <YAxis tick={{ fill: '#e0e0e0' }} label={{ value: '시간(분)', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ color: '#e0e0e0' }} />
              <Bar dataKey="upper" name="상체" stackId="s" fill={exerciseColors.upper} />
              <Bar dataKey="core"  name="코어" stackId="s" fill={exerciseColors.core} />
              <Bar dataKey="lower" name="하체" stackId="s" fill={exerciseColors.lower} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 운동 기록 */}
        <motion.div
          className="card dark-card records-card clickable-card"
          onClick={() => navigate('/records')}
          whileHover={{ scale: 1.02 }}
        >
          <FaCalendarAlt className="card-icon" />
          <div className="card-title" style={{ marginBottom: 6 }}>운동 기록</div>
          <div className="card-subtitle">누적 기록을 한눈에 확인하세요.</div>
          <div className="sparkbar" aria-hidden>
            {recentRecords.map((r, idx) => (
              <div key={r.date + idx} className="sparkbar-bar" style={{ height: Math.max(14, Math.min(56, r.minutes)) }} title={`${r.date} • ${r.minutes}분`} />
            ))}
          </div>
          <div className="recent-list">
            {recentRecords.map((r) => (
              <div key={r.date} className="recent-item">
                <div className="recent-date">{r.date}</div>
                <div className="recent-tags">
                  {r.tags.map((t, i) => (<span key={i} className="tag">{t}</span>))}
                </div>
                <div className="recent-min">{r.minutes}분</div>
              </div>
            ))}
          </div>
          <div className="records-cta">자세히 보기 →</div>
        </motion.div>

        {/* 커뮤니티 */}
        <motion.div
          className="card dark-card community-card clickable-card"
          onClick={() => navigate('/board')}
          whileHover={{ scale: 1.02 }}
        >
          <FaUsers className="card-icon" />
          <div className="card-title" style={{ marginBottom: 6 }}>커뮤니티</div>
          {posts.map((p, i) => (
            <div className="post-preview" key={i}>
              <h4>{p.title}</h4>
              <p>{p.content}</p>
            </div>
          ))}
        </motion.div>

        {/* 랭킹 */}
        <motion.div
          className="card dark-card ranking-card clickable-card"
          onClick={() => navigate('/ranking')}
          whileHover={{ scale: 1.02 }}
        >
          <FaTrophy className="card-icon" />
          <div className="card-title" style={{ marginBottom: 6 }}>전체 랭킹</div>
          <ol className="ranking-list">
            {previewTop3.map((r, idx) => (
              <li key={r.id}>{['🥇', '🥈', '🥉'][idx]} {r.name} {r.score}점</li>
            ))}
          </ol>
          <p className="my-rank">17등 / 전체</p>
        </motion.div>

        {/* AI 챗봇 */}
        <motion.div
          className="card dark-card chatbot-card clickable-card"
          onClick={() => navigate('/chatbot')}
          whileHover={{ scale: 1.02 }}
        >
          <FaRobot className="card-icon" />
          <div className="card-title" style={{ marginBottom: 6 }}>AI 챗봇</div>
          <div className="muted">홈트 관련 궁금한 점을 AI가 도와드려요.</div>
        </motion.div>
      </div>

      {/* 우하단 챗봇 버튼 */}
      <div className="chatbot-section" onClick={() => navigate('/chatbot')} aria-label="AI 챗봇 열기">
        <div className="chatbot-bubble"><FaRobot /></div>
        <p className="chatbot-label">I봇</p>
      </div>
    </div>
  );
};

export default MainDashboardPage;
