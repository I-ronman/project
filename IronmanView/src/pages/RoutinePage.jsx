<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import '../styles/RoutinePage.css';
import { useNavigate } from 'react-router-dom';
import { useRoutine } from '../contexts/RoutineContext.jsx';

const RoutinePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('routine');
  const { savedRoutines, deleteRoutine } = useRoutine();
>>>>>>> 8dda8c4bf7fd7ce37b70fe92f556514fc6270d6b

  const handleRoutineClick = (routine) => {
    navigate('/routinedetail', { state: { routine } });
  };

<<<<<<< HEAD
  const handleAddRoutine = () => {
    navigate('/routinedetail');
=======
  const handleDeleteRoutine = (routineName) => {
    deleteRoutine(routineName);
  };

  const handleAddRoutine = () => {
    const newRoutine = {
      name: `루틴 ${String.fromCharCode(65 + savedRoutines.length)}`,
      duration: 30,
      exercises: [],
    };
    navigate('/routinedetail', { state: { routine: newRoutine } });
>>>>>>> 8dda8c4bf7fd7ce37b70fe92f556514fc6270d6b
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
<<<<<<< HEAD
                <div key={index} className="routine-card" onClick={() => handleRoutineClick(r)}>
                  <h2>{r.name}</h2>
                  <p>⏱ {r.duration}분</p>
                  <p>💪 {r.exercises.join(', ')}</p>
                </div>
              ))}

              {/* 무조건 추가 버튼 표시 */}
=======
                <div key={index} className="routine-card">
                  <div className="routine-card-header">
                    <h2>{r.name}</h2>
                    <span
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(r.name);
                      }}
                    >
                      X
                    </span>
                  </div>
                  <p>⏱ {r.duration}분</p>
                  <p>💪 {r.exercises.map((e) => e.name).join(', ')}</p>
                  <div className="routine-card-click-layer" onClick={() => handleRoutineClick(r)} />
                </div>
              ))}

>>>>>>> 8dda8c4bf7fd7ce37b70fe92f556514fc6270d6b
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
