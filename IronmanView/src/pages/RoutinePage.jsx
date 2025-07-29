// project/IronmanView/src/pages/RoutinePage.jsx
import React, { useState } from 'react';
import '../styles/RoutinePage.css';
import { useNavigate } from 'react-router-dom';
import { useRoutine } from '../contexts/RoutineContext.jsx';
import PageWrapper from '../layouts/PageWrapper';

const RoutinePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('routine');
  const { savedRoutines, deleteRoutine } = useRoutine();

  const handleRoutineClick = (routine) => {
    navigate('/routinedetail', { state: { routine } });
  };

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
  };

  const handleChatbotNavigate = () => {
    navigate('/chatbot', { state: { from: '/routine' } });
  };

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
};

export default RoutinePage;
