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
  const isSurveyCompleted = localStorage.getItem('surveyCompleted') === 'true';
  
  // 임시 설문조사 초기화 버튼
  const [refresh, setRefresh] = useState(false);
  const handleSurveyReset = () => {
    const currentStatus = localStorage.getItem('surveyCompleted') === 'true';
    localStorage.setItem('surveyCompleted', (!currentStatus).toString());
    setRefresh(prev => !prev);
  }
  // 설문조사 페이지로 이동하기 위한 함수
  const handleSurveyNavigate = () => {
    navigate('/survey');
  };

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
              <div className='top-row'>
                {!isSurveyCompleted && (
                  <button className="survey-btn" onClick={handleSurveyNavigate}>설문조사 하기</button>
                )}
                <button className="survey-btn" onClick={() => navigate('/schedulepage')}>스케쥴 확인하기</button>
                {/* ✅ 임시 초기화 버튼 */}
                <button className="survey-btn" onClick={handleSurveyReset}>설문 토글</button>
            
              </div>
            </div>

            <div className="routine-card-list">
              {routines.map((r, index) => (
                <div key={index} className="routine-card">
                  <div className="routine-card-header">
                    <h2>{r.title}</h2>
                    <span
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(r.title);
                      }}
                    >
                      X
                    </span>
                  </div>
                  <p>⏱ {r.duration}분</p>
                  {/* 🔧 이 부분만 수정 */}
                  {Array.isArray(r.exercises) ? (
                    <p>💪 {r.exercises.map((e) => e.name).join(', ')}</p>
                  ) : (
                    <p>💪 운동 없음</p>
                  )}
                  {r.description && r.description !== '루틴 설명을 입력해주세요' && (
                    <p className="routine-description">{r.description}</p>
                  )}
                  
                  <p>💪 {r.summary || '운동없음'}</p>
                  <button className="start-routine-btn"
                    onClick={(e) => {
                      e.stopPropagation();
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
