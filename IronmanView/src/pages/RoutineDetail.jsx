import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RoutineDetail.css';

const RoutineDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [exerciseList, setExerciseList] = useState([]);

  // 초기 루틴 데이터 또는 선택한 운동 적용
  useEffect(() => {
    const { updatedExercise, index, routine } = location.state || {};

    // 기존 루틴 데이터로 초기화
    if (routine && routine.exercises) {
      const mappedExercises = routine.exercises.map((name) => ({
        name,
        description:
          name === '운동 선택' ? '운동을 선택해주세요' : '선택된 운동입니다',
        image:
          name === '운동 선택'
            ? '/images/sample-placeholder.png'
            : '/images/sample-new.png',
      }));

      // 4개가 안 되면 채움
      while (mappedExercises.length < 4) {
        mappedExercises.push({
          name: '운동 선택',
          description: '운동을 선택해주세요',
          image: '/images/sample-placeholder.png',
        });
      }

      setExerciseList(mappedExercises);
    }

    // 특정 운동만 수정된 경우
    if (updatedExercise && index !== undefined) {
      setExerciseList((prevList) => {
        const newList = [...prevList];
        newList[index] = {
          name: updatedExercise.name,
          description: `${updatedExercise.part} 부위를 강화합니다`,
          image: '/images/sample-new.png',
        };
        return newList;
      });
    }
  }, [location.state]);

  const handleCardClick = (index) => {
    navigate('/search', {
      state: { index },
    });
  };

  const handleSave = () => {
    const prevName = location.state?.routine?.name || '루틴 A';

    const routine = {
      name: prevName,
      duration: 30,
      exercises: exerciseList.map((e) => e.name),
    };

    navigate('/routine', { state: { newRoutine: routine } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="routine-detail-wrapper">
      <div className="routine-detail-container">
        <div className="routine-detail-header">
          <h2>{location.state?.routine?.name || '루틴 A'}</h2>
          <p className="routine-description">루틴 설명을 작성해주세요</p>
        </div>

        <div className="exercise-list">
          {exerciseList.map((exercise, i) => (
            <div key={i} className="exercise-card" onClick={() => handleCardClick(i)}>
              <div className="exercise-info">
                <img src={exercise.image} alt={exercise.name} />
                <div>
                  <div className="exercise-name">{exercise.name}</div>
                  <div className="exercise-target">{exercise.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-row">
          <button className="back-button" onClick={handleBack}>돌아가기</button>
          <button className="save-button" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;
