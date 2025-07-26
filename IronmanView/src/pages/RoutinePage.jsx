import React, { useState, useEffect } from 'react';
import '../styles/RoutinePage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const RoutinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('routine');
  const [savedRoutines, setSavedRoutines] = useState([]);

  // 새로운 루틴 저장
  useEffect(() => {
    const newRoutine = location.state?.newRoutine;
    if (newRoutine) {
      setSavedRoutines((prev) => [...prev, newRoutine]);
    }
  }, [location.state]);

  const handleRoutineClick = (routine) => {
    navigate('/routinedetail', { state: { routine } });
  };

  const handleAddRoutine = () => {
    navigate('/routinedetail');
  };

  const handleChatbotNavigate = () => {
    navigate('/chatbot', { state: { from: '/routine' } });
  };

  return (
    <div className="routine-wrapper">
      <div className="routine-container">
        <div className="routine-tab">
          <button className={activeTab === 'routine' ? 'tab active' : 'tab'} onClick={() => setActiveTab('routine')}>
            루틴 운동하기
          </button>
          <button className={activeTab === 'individual' ? 'tab active' : 'tab'} onClick={() => setActiveTab('individual')}>
            개별 운동하기
          </button>
        </div>

        {activeTab === 'routine' && (
          <div>
            <div className="top-row">
              <h3>오늘의 루틴</h3>
              <button className="survey-btn">설문조사 하기</button>
            </div>

            <div className="routine-card-list">
              {savedRoutines.map((r, index) => (
                <div key={index} className="routine-card" onClick={() => handleRoutineClick(r)}>
                  <h2>{r.name}</h2>
                  <p>⏱ {r.duration}분</p>
                  <p>💪 {r.exercises.join(', ')}</p>
                </div>
              ))}

              {/* 무조건 추가 버튼 표시 */}
              <div className="add-routine-card" onClick={handleAddRoutine}>
                ＋ 루틴 추가하기
              </div>
            </div>

            <div className="routine-actions">
              <button onClick={handleChatbotNavigate}>루틴 추천받기</button>
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="individual-list">
            <h3>운동 카테고리</h3>
            <ul>
              <li>상체 운동</li>
              <li>하체 운동</li>
              <li>코어 운동</li>
              <li>유산소 운동</li>
              <li>전신 운동</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinePage;
