import React, { useState, useEffect } from 'react';
import '../styles/RoutinePage.css';
import { useNavigate } from 'react-router-dom';
import { useRoutine } from '../context/RoutineContext.jsx';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';

const RoutinePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('routine');
  const { savedRoutines, deleteRoutine } = useRoutine();
  const [routines, setRoutines] = useState([]);  // 🔧 추가
  const isSurveyCompleted = true; // 또는 false, 또는 상태로 관리

   // ✅ 루틴 목록을 서버에서 불러오기
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get('http://localhost:329/web/api/routine/list', {
          withCredentials: true,
        });
        setRoutines(response.data); // 서버에서 받은 루틴 목록
      } catch (error) {
        console.error('루틴 목록 불러오기 실패:', error);
      }
    };

    fetchRoutines();
  }, []);

  const handleRoutineClick = (routine) => {
  navigate('/routinedetail', {
    state: {
      routine: {
        routineId: routine.routineId,
        name: routine.title,
        summary: routine.summary,
        exercises: routine.exercises.map((e) => ({
          name: e.name,
          part: e.part,
          sets: e.sets,
          reps: e.reps,
          breaktime: e.breaktime,
          exerciseTime: e.exerciseTime,
          exerciseId: e.exerciseId,
        })),
      },
    },
  });
};

  const handleDeleteRoutine = async (routineId) => {
  const confirmed = window.confirm('정말 이 루틴을 삭제하시겠습니까?');
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:329/web/api/routine/${routineId}`, {
      withCredentials: true,
    });

    // 프론트 목록에서도 삭제
    setRoutines((prev) => prev.filter((r) => r.routineId !== routineId));
  } catch (error) {
    console.error('루틴 삭제 실패:', error);
  }
};


  const handleAddRoutine = () => {
  const newRoutine = {
    name: `루틴 ${String.fromCharCode(65 + savedRoutines.length)}`,
    exercises: [
      {
        name: '운동 선택',
        part: '',
        sets: 3,
        reps: 10,
        exerciseTime: 60,
        breaktime: 30,
        description: '운동을 선택해주세요',
        image: '/images/sample-placeholder.png',
      }
    ]
  };

  navigate('/routinedetail', { state: { routine: newRoutine } });
};


const handleChatbotNavigate = () => {
  navigate('/chatbot', { state: { from: '/routine' } });
};

const handleStartRoutine = (routine) => {
navigate('/postureanalysis', { state: { routine } });
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
              <div className='top-row'>
                {!isSurveyCompleted && (
                  <button className="survey-btn" onClick={handleSurveyNavigate}>설문조사 하기</button>
                )}
                <button className="survey-btn" onClick={() => navigate('/schedulepage')}>스케쥴 확인하기</button>
                {/* ✅ 임시 초기화 버튼 */}
            
              </div>
            </div>

            <div className="routine-card-list">
              {routines.map((r, index) => (
                <div key={index} className="routine-card">
                  <div className="routine-card-header">
                    <h2>{r.title || r.name}</h2>
                    <span
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(r.routineId);
                      }}
                    >
                      X
                    </span>
                  </div>
                  {r.summary && <p className="routine-summary">{r.summary}</p>}
                            <p>⏱ { r.exercises && r.exercises.length > 0
                ? (() => {
                    const totalSeconds = r.exercises.reduce((acc, cur) => {
                      const time = (cur.exerciseTime || 0);
                      const rest = (cur.breaktime || 0);
                      const sets = (cur.sets || 1);
                      return acc + (time + rest) * sets;
                    }, 0);

                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;

                    return minutes > 0
                      ? `${minutes}분 ${seconds > 0 ? `${seconds}초` : ''}`
                      : `${seconds}초`;
                  })()
                : '0초'}</p>
                  <p>
                    💪 {r.exercises.length > 0 
                          ? r.exercises.map((ex, idx) => ex.exerciseName).join(', ')
                          : '운동없음'}
                  </p>
                  <button className="start-routine-btn"
                    onClick={(e) => {
                      handleStartRoutine(r);
                    }}
                  >루틴 시작하기</button>
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
