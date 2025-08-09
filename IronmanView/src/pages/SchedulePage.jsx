// project/IronmanView/src/pages/SchedulePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/SchedulePage.css';
import defaultProfile from '../images/default_profile.jpg';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SchedulePage = () => {

  const [date, setDate] = useState(new Date());
  const [routineData, setRoutineData] = useState({});
  const navigate = useNavigate();

  const selectedKey = date.toISOString().split('T')[0];
  const selectedRoutine = routineData[selectedKey];
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const saved = localStorage.getItem(`routine_${selectedKey}`);
    if (saved) {
      setRoutineData(prev => ({
        ...prev,
        [selectedKey]: JSON.parse(saved)
      }));
    }
  }, [date]);

   useEffect(() => {
  axios.get('http://localhost:329/web/login/user', { withCredentials: true })
    .then(res => {
      const { name, email } = res.data;
      setUser(prev => ({ ...prev, name, email }));
    })
    .catch(err => {
      console.error('세션 사용자 정보 불러오기 실패', err);
      navigate('/login');
    });
}, []);
  

  return (
      <div className="schedule-page">
        <div className="profile-section">
          <div className="profile-left">
            <p className="profile-name">{user?.name || '홍길동'}</p>
            <p className="profile-detail">Age: ??</p>
            <p className="profile-detail">75 Kg | 1.65 M</p>
          </div>
          <img src={defaultProfile} alt="프로필" className="profile-image" />
        </div>

        <h2 className="calendar-title">운동 스케줄러</h2>
        <Calendar onChange={setDate} value={date} locale="ko-KR" className="custom-calendar" />

        <div className="activity-section">
          <h3>운동 활동</h3>
          {selectedRoutine ? (
            <div className="routine-card">
              <p>🏋 루틴 이름: <strong>{selectedRoutine.name}</strong></p>
              <p>📋 구성: {selectedRoutine.list}</p>
              <p>⏱ 시간: {selectedRoutine.duration}분</p>
              <p>🔥 예상 소모 칼로리: {selectedRoutine.duration * 8} Kcal</p>
            </div>
          ) : (
            <p className="no-record">운동 기록이 없습니다.</p>
          )}

          {!isPast && (
            <div className="routine-buttons">
              <button onClick={() => navigate('/routine', { state: { selectedDate: selectedKey } })}>
                {selectedRoutine ? '오늘의 루틴 수정하기' : '루틴 새로 등록하기'}
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default SchedulePage;
