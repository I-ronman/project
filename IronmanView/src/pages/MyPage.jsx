import React, { useState, useRef } from 'react';
import '../styles/MyPage.css';
import defaultProfileImage from '../images/default_profile.jpg';
import SurveyBlurOverlay from '../components/SurveyBlurOverlay';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

const MyPage = ({ user, hasSurvey = false }) => {
  const [showBodyInfo, setShowBodyInfo] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const todayDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const workoutDates = [1, 2, 3, 7, 8, 15, 22, 25]; // 기록 있는 날짜
  const streakDays = workoutDates.includes(todayDate) ? 3 : 0;

  const toggleSection = () => setShowBodyInfo(prev => !prev);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, todayDate - i);
      if (d.getMonth() === currentMonth && d.getDate() > 0) {
        days.push(d.getDate());
      }
    }
    return days;
  };

  const isToday = (day) => day === todayDate;
  const hasRecord = (day) => workoutDates.includes(day);
  const isPast = (day) => day <= todayDate;

  const progressRef = useRef(null);
  const bodyRef = useRef(null);

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        <div className="profile-card">
          <img
            src={user?.profileImage || defaultProfileImage}
            alt="프로필"
            className="profile-image"
          />
          <div className="profile-name">{user?.name || '홍길동'}</div>
          <div>성별: {user?.gender || '남성'} | 생년: {user?.birth || '1995년생'}</div>
          <div>{user?.email || 'test@example.com'}</div>
          <button className="profile-edit-btn" onClick={() => navigate('/profile-edit')}>
            프로필 수정
          </button>
        </div>

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

        <div className="progress-card">
          <div className="progress-title">연속 운동 일수</div>
          <div className="streak">{streakDays}일</div>
          <div className="dot-row">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`dot ${i < streakDays ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <SwitchTransition mode="out-in">
          <CSSTransition
            key={showBodyInfo ? 'body' : 'progress'}
            timeout={300}
            classNames="slide-fade"
            nodeRef={showBodyInfo ? bodyRef : progressRef}
          >
            <div
              ref={showBodyInfo ? bodyRef : progressRef}
              style={{ width: '100%' }}
            >
              {!showBodyInfo ? (
                <div className="progress-section">
                  <div className="progress-title">
                    오늘 운동 달성률 <span className="percent">40%</span>
                  </div>
                  <div className="bar-outline">
                    <div className="bar-fill" style={{ width: '40%' }} />
                  </div>

                  <div className="day-box-row">
                    {getLast7Days().map((day, idx) => (
                      <div
                        key={idx}
                        className={`day-box ${isToday(day) ? 'today' : hasRecord(day) ? 'recorded' : ''}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="calendar-container">
                    <div className="progress-title">월간 운동 달성률</div>
                    <div className="calendar-grid">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="calendar-day">{d}</div>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const date = i + 1;
                        const highlight = hasRecord(date) && isPast(date);
                        const isCurrent = isToday(date);
                        return (
                          <div
                            key={i}
                            className={`calendar-date ${highlight ? 'highlight' : ''} ${isCurrent ? 'today-border' : ''}`}
                          >
                            {date}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button className="toggle-btn" onClick={toggleSection}>▼</button>
                </div>
              ) : (
                <div className="body-info-section">
                  <div className="body-info-header">
                    <h3>나의 신체 정보</h3>
                    <button className="edit-btn" onClick={() => navigate('/profile-edit')}>
                      정보 수정
                    </button>
                  </div>
                  <div className={`body-info-card ${!hasSurvey ? 'blurred' : ''}`}>
                    <p>키: {user?.height || '160cm'}</p>
                    <p>몸무게: {user?.weight || '52kg'}</p>
                    <p>체지방률: {user?.fat || '24%'}</p>
                    {!hasSurvey && <SurveyBlurOverlay />}
                  </div>
                  <button className="toggle-btn" onClick={toggleSection}>▲</button>
                </div>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>

        <div className="settings-container">
          <button className="settings-btn" onClick={() => navigate('/settings')}>
            환경 설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
