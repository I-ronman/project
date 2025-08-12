import React, { useState, useRef, useContext, useMemo } from 'react';
import '../styles/MyPage.css';
import defaultProfileImage from '../images/default_profile.jpg';
import SurveyBlurOverlay from '../components/SurveyBlurOverlay';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import { AuthContext } from '../context/AuthContext';

const MyPage = () => {
  const [showBodyInfo, setShowBodyInfo] = useState(false);
  const navigate = useNavigate();

  const progressRef = useRef(null);
  const bodyRef = useRef(null);

  const { user, surveyDone } = useContext(AuthContext);

  // ===== 날짜/기록 샘플 =====
  const now = useMemo(() => new Date(), []);
  const todayDate = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0~11

  // 예시 기록(실제 연동 전까지 사용)
  const workoutDates = [1, 2, 3, 7, 8, 15, 22, 25];
  const streakDays = workoutDates.includes(todayDate) ? 3 : 0;

  // 최근 7일 레이블
  const getLast7Days = () =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(year, month, todayDate - (6 - i));
      return d.getDate();
    });
  const isToday = (d) => d === todayDate;
  const hasRecord = (d) => workoutDates.includes(d);

  // ===== 월간 달력: 현재 월을 요일에 맞춰 렌더 =====
  const calendar = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay(); // 0(일)~6(토)
    const lastDate = new Date(year, month + 1, 0).getDate(); // 해당월 마지막 날짜
    const cells = [];

    for (let i = 0; i < firstWeekday; i++) cells.push({ type: 'blank', key: `b-${i}` });
    for (let d = 1; d <= lastDate; d++) cells.push({ type: 'date', day: d, key: `d-${d}` });

    const targetLen = cells.length <= 35 ? 35 : 42;
    while (cells.length < targetLen) cells.push({ type: 'blank', key: `t-${cells.length}` });

    return cells;
  }, [year, month]);

  const monthLabel = useMemo(
    () => `${year}.${String(month + 1).padStart(2, '0')}`,
    [year, month]
  );

  return (
    <PageWrapper>
      <div className="mypage-wrapper">
        <div className="mypage-container">
          {/* 본문 2열 그리드 */}
          <div className="mypage-grid">
            {/* 좌측: 진행/달력 (연속일수는 우하단으로 이동) */}
            <div className="left-column">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={showBodyInfo ? 'body' : 'progress'}
                  timeout={280}
                  classNames="slide-fade"
                  nodeRef={showBodyInfo ? bodyRef : progressRef}
                >
                  <div ref={showBodyInfo ? bodyRef : progressRef} style={{ width: '100%' }}>
                    {!showBodyInfo ? (
                      <div className="progress-section">
                        <div className="progress-title">
                          오늘 운동 달성률 <span className="percent">40%</span>
                        </div>
                        <div className="bar-outline">
                          <div className="bar-fill" style={{ width: '40%' }} />
                        </div>

                        {/* 최근 7일 */}
                        <div className="day-box-row">
                          {getLast7Days().map((d, idx) => (
                            <div
                              key={idx}
                              className={`day-box ${
                                isToday(d) ? 'today' : hasRecord(d) ? 'recorded' : ''
                              }`}
                            >
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* 월간 달력 */}
                        <div className="calendar-container">
                          <div className="calendar-head">
                            <div className="progress-title">{monthLabel} 월간 운동 달성률</div>
                          </div>
                          <div className="calendar-grid">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                              <div key={i} className="calendar-day">
                                {wd}
                              </div>
                            ))}

                            {calendar.map((cell) =>
                              cell.type === 'blank' ? (
                                <div key={cell.key} className="calendar-blank" />
                              ) : (
                                <div
                                  key={cell.key}
                                  className={[
                                    'calendar-date',
                                    hasRecord(cell.day) ? 'highlight' : '',
                                    cell.day === todayDate ? 'today-border' : '',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  {cell.day}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* ▼ 버튼: 달력 아래 중앙 정렬 */}
                        <button
                          className="toggle-btn"
                          onClick={() => setShowBodyInfo(true)}
                          aria-label="신체 정보 보기"
                        >
                          ▼
                        </button>
                      </div>
                    ) : (
                      <div className="body-info-section">
                        <div className="body-info-header">
                          <h3>나의 신체 정보</h3>
                          <button
                            className="edit-btn"
                            onClick={() => navigate('/profile-edit')}
                          >
                            정보 수정
                          </button>
                        </div>

                        {/* ✅ 오버레이가 카드 ‘위’에 올라오도록 래퍼 추가 */}
                        <div className="body-info-wrap">
                          <div className={`body-info-card ${!surveyDone ? 'blurred' : ''}`}>
                            <p>키: {user?.height || '160cm'}</p>
                            <p>몸무게: {user?.weight || '52kg'}</p>
                            <p>체지방률: {user?.fat || '24%'}</p>
                          </div>

                          {/* 오버레이는 카드의 형제이자 같은 래퍼 안에서 절대배치 → 블러 위에 표시됨 */}
                          {!surveyDone && <SurveyBlurOverlay />}
                        </div>

                        <button
                          className="toggle-btn"
                          onClick={() => setShowBodyInfo(false)}
                          aria-label="진행 현황 보기"
                        >
                          ▲
                        </button>
                      </div>
                    )}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </div>

            {/* 우측: 프로필 + 요약 + (이동) 연속일수 */}
            <div className="right-column">
              <div className="profile-card">
                <div className="profile-avatar">
                  <img
                    src={user?.face || defaultProfileImage}
                    alt="프로필"
                    className="profile-image"
                  />
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user?.name || '홍길동'} 님</h2>
                  <div className="profile-details">
                    <span>
                      성별:{' '}
                      {user?.gender === 'M'
                        ? '남성'
                        : user?.gender === 'F'
                        ? '여성'
                        : '미설정'}
                    </span>
                    <span>생년월일: {user?.birthdate || '1995-01-01'}</span>
                  </div>
                  <div className="profile-email">
                    {user?.email || 'example@gmail.com'}
                  </div>
                </div>
                <button
                  className="profile-edit-btn"
                  onClick={() => navigate('/profile-edit')}
                >
                  프로필 수정
                </button>
              </div>

              {/* 우하단 요약 카드 */}
              <div className="summary-row in-right">
                <div className="summary-box">
                  <div className="summary-value">171</div>
                  <div className="summary-label">🔥 칼로리</div>
                </div>
                <div className="summary-box">
                  <div className="summary-value">2</div>
                  <div className="summary-label">💪 운동</div>
                </div>
                <div className="summary-box">
                  <div className="summary-value">23</div>
                  <div className="summary-label">분</div>
                </div>
              </div>

              {/* (이동) 연속 운동 일수 카드 */}
              <div className="progress-card">
                <div className="progress-title">연속 운동 일수</div>
                <div className="streak">{streakDays}일</div>
                <div className="dot-row">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`dot ${i < streakDays ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 설정 버튼 (전체폭) */}
          <div className="settings-container">
            <button className="settings-btn" onClick={() => navigate('/settings')}>
              환경 설정
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyPage;
