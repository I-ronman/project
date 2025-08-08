import React, { useState, useRef, useEffect, useContext } from 'react';
import '../styles/MyPage.css';
import defaultProfileImage from '../images/default_profile.jpg';
import SurveyBlurOverlay from '../components/SurveyBlurOverlay';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyPage = () => {
  const [showBodyInfo, setShowBodyInfo] = useState(false);
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const bodyRef = useRef(null);
  const { user, setUser, surveyDone } = useContext(AuthContext);

  // 오늘 & 예시 기록
  const today = new Date();
  const todayDate = today.getDate();
  const workoutDates = [1, 2, 3, 7, 8, 15, 22, 25];
  const streakDays = workoutDates.includes(todayDate) ? 3 : 0;

  // 지난 7일 구하기
  const getLast7Days = () =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(todayDate - (6 - i));
      return d.getDate();
    });
  const isToday = d => d === todayDate;
  const hasRecord = d => workoutDates.includes(d);

  // 사용자 정보 로드
  useEffect(() => {
    axios
      .get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email, birthdate, gender, face } = res.data;
        setUser(prev => ({
          ...prev,
          name,
          email,
          birthdate,
          gender,
          face,
        }));
      })
      .catch(() => navigate('/login'));
  }, [setUser, navigate]);

  return (
    <PageWrapper>
      <div className="mypage-wrapper">
        <div className="mypage-container">

          {/* ─── 프로필 카드 ─── */}
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
                <span>성별: {user.gender === 'M' ? '남성' : user.gender === 'F' ? '여성' : '미설정'}</span>
                <span>생년월일: {user?.birthdate || '1995-01-01'}</span>
              </div>
              <div className="profile-email">{user?.email || 'example@gmail.com'}</div>
            </div>
            <button
              className="profile-edit-btn"
              onClick={() => navigate('/profile-edit')}
            >
              프로필 수정
            </button>
          </div>

          {/* ─── 요약 정보 ─── */}
          <div className="summary-row">
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

          {/* ─── 연속 운동 일수 ─── */}
          <div className="progress-card">
            <div className="progress-title">연속 운동 일수</div>
            <div className="streak">{streakDays}일</div>
            <div className="dot-row">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`dot ${i < streakDays ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          {/* ─── 진행률 ↔ 신체 정보 토글 ─── */}
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={showBodyInfo ? 'body' : 'progress'}
              timeout={300}
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
                    <div className="calendar-container">
                      <div className="progress-title">월간 운동 달성률</div>
                      <div className="calendar-grid">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                          <div key={i} className="calendar-day">{wd}</div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const date = i + 1;
                          const highlight = hasRecord(date);
                          const todayB = date === todayDate;
                          return (
                            <div
                              key={i}
                              className={`calendar-date ${highlight ? 'highlight' : ''} ${todayB ? 'today-border' : ''}`}
                            >
                              {date}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button className="toggle-btn" onClick={() => setShowBodyInfo(true)}>▼</button>
                  </div>
                ) : (
                  <div className="body-info-section">
                    <div className="body-info-header">
                      <h3>나의 신체 정보</h3>
                      <button className="edit-btn" onClick={() => navigate('/profile-edit')}>
                        정보 수정
                      </button>
                    </div>
                    <div className={`body-info-card ${!surveyDone ? 'blurred' : ''}`}>
                      <p>키: {user?.height || '160cm'}</p>
                      <p>몸무게: {user?.weight || '52kg'}</p>
                      <p>체지방률: {user?.fat || '24%'}</p>
                      {!surveyDone && <SurveyBlurOverlay />}
                    </div>
                    <button className="toggle-btn" onClick={() => setShowBodyInfo(false)}>▲</button>
                  </div>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>

          {/* ─── 설정 버튼 ─── */}
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
