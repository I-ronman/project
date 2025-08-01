// project/IronmanView/src/pages/ExerciseSearch.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ExerciseSearch.css';
import PageWrapper from '../layouts/PageWrapper';

const ExerciseSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { index = null } = location.state || {}; // 단독 진입일 경우 null

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const dummyExercises = [
    { id: 1, name: '벤치 프레스', part: '가슴' },
    { id: 2, name: '덤벨 벤치 프레스', part: '가슴' },
    { id: 3, name: '덤벨 풀오버', part: '가슴' },
    { id: 4, name: '펙덱 플라이', part: '가슴' },
  ];

  const filteredExercises = dummyExercises.filter((exercise) =>
    exercise.name.includes(searchQuery)
  );

  const handleSelect = (exercise) => {
    setSelectedExercise(exercise);
    setSearchQuery(exercise.name);
  };

  const handleSave = () => {
    if (selectedExercise) {
      if (index !== null) {
        // RoutineDetail에서 왔을 경우
        navigate('/routinedetail', {
          state: {
            updatedExercise: selectedExercise,
            index,
            routine: {
              name: location.state?.routine?.name || '루틴 A',
              exercises: location.state?.routine?.exercises || [],
            },
          },
        });
      } else {
        // 단독 진입일 경우
        alert(`${selectedExercise.name} ( ${selectedExercise.part} 부위 ) 선택됨`);
      }
    }
  };

  const handleBack = () => {
    if (index !== null) {
      // RoutineDetail에서 왔을 경우 → 상태를 복구하여 다시 이동
      navigate('/routinedetail', {
        replace: true,
        state: {
          routine: location.state?.routine,
        },
      });
    } else {
      navigate('/routine'); // 단독 진입일 경우
    }
  };

  return (
    <PageWrapper>
      <div className="exercise-search-header">
        <h2>{index !== null ? '운동 선택' : '운동 검색'}</h2>
      </div>

      <input
        type="text"
        placeholder="운동 이름으로 검색해보세요"
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="exercise-list">
        {filteredExercises.map((exercise, i) => (
          <div
            key={i}
            className={`exercise-item ${selectedExercise?.name === exercise.name ? 'selected' : ''}`}
            onClick={() => handleSelect(exercise)}
          >
            <p className="exercise-name">{exercise.name}</p>
            <p className="exercise-part">{exercise.part} 부위</p>
          </div>
        ))}
      </div>

      <div className="button-row">
        <button className="back-button" onClick={handleBack}>돌아가기</button>
        <button className="save-button" onClick={handleSave} disabled={!selectedExercise}>저장</button>
      </div>
    </PageWrapper>
  );
};

export default ExerciseSearch;
