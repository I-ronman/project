// project/IronmanView/src/pages/RoutineDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RoutineDetail.css';
import { useRoutine } from '../context/RoutineContext.jsx';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';

const RoutineDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRoutine } = useRoutine();

  const [routineDescription, setRoutineDescription] = useState('');

  const [routineName, setRoutineName] = useState(location.state?.routine?.name || '루틴 A');
  
  // exerciseList 변수를 정의해놓은 곳
  const [exerciseList, setExerciseList] = useState([
    {
      name: '운동 선택',
    part: '',
    sets: 3,
    reps: 10,
    exerciseTime: 60,  // 기본값 60초
    description: '운동을 선택해주세요',
    image: '/images/sample-placeholder.png',
    },
]);

 // 만약 루틴을 통해 들어왔을 경우(처음에만), 루틴의 정보대로 리스트를 매핑
 // 처음으로 루틴을 만들러 들어왔을 경우, 루틴 정보 매핑은 생략하고 그냥 운동 선택만 추가
 useEffect(() => {
  const routine = location.state?.routine;
  if (routine?.exercises?.length > 0) {
    setRoutineDescription(routine.summary || '');

    const mappedExercises = routine.exercises.map((e) => ({
      ...e,
      description: `${e.part} 부위를 강화합니다.`,
      image: '/images/sample-new.png',
    }));

    // 맨 마지막에 '운동 선택'이 없으면 추가
    if (mappedExercises[mappedExercises.length - 1].name !== '운동 선택') {
      mappedExercises.push({
        name: '운동 선택',
        part: '',
        sets: 3,
        reps: 10,
        exerciseTime: 60,
        description: '운동을 선택해주세요',
        image: '/images/sample-placeholder.png',
      });
    }

    setExerciseList(mappedExercises);
  }
}, []);  // ✅ 최초 진입 시만 실행

// ExerciseSearch 에서 선택한 운동을 받은 후에, 해당 index에 있는 운동을 덮어쓴다.
// 다시 운동 선택 카드가 맨 끝에 없으면 추가
useEffect(() => {
  const { updatedExercise, index } = location.state || {};

  if (updatedExercise && index !== undefined) {
    setExerciseList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = {
        ...updatedList[index],
        id: updatedExercise.id,
        name: updatedExercise.name,
        part: updatedExercise.part,
        description: `${updatedExercise.part} 부위를 강화합니다.`,
        image: '/images/sample-new.png',
      };

      // 마지막이 '운동 선택'이 아니면 추가
      if (updatedList[updatedList.length - 1].name !== '운동 선택') {
        updatedList.push({
          name: '운동 선택',
          part: '',
          sets: 3,
          reps: 10,
          exerciseTime: 60,
          description: '운동을 선택해주세요',
          image: '/images/sample-placeholder.png',
        });
      }

      return updatedList;
    });

    // ✅ 상태 초기화해서 중복 선택 방지
    setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} });
    }, 0);
  }
}, [location.state]);

  // 백엔드로 루틴 저장 전송
  const handleSave = async () => {
  const routineData = {
     title: routineName,
     summary: routineDescription,
     exercises: exerciseList
    .filter((e) => e.name !== '운동 선택' && e.id)
    .map((e) => ({
      exerciseId: e.id,
      part: e.part,
      sets: e.sets,
      reps: e.reps,
      exerciseTime: e.exerciseTime,
      })),
  };

  try {
    const response = await axios.post('http://localhost:329/web/api/routine/add', routineData, {
      withCredentials: true, // 인증 필요 시
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('루틴 저장 성공:', response.data);
    navigate('/routine');

  } catch (error) {
    console.error('루틴 저장 실패:', error);
    alert('루틴 저장에 실패했습니다.');
  }
};

  // 루틴 페이지로 돌아가기 기능
  const handleBack = () => {
    const confirmBack = window.confirm('변경 사항이 저장되지 않습니다. 루틴 목록으로 돌아가시겠습니까?');
    if (confirmBack) {
      navigate('/routine');
    }
  };

  // 운동 카드 클릭 시 운동 검색으로 이동
  const handleCardClick = (index) => {
  navigate('/search', {
    state: {
      index,  // ✅ 누른 카드의 index 넘김
      routine: {
        name: routineName,
        summary: routineDescription,
        exercises: exerciseList,  // ✅ 전체 리스트 넘김
      },
    },
  });
};



  return (
    <PageWrapper>
      <div className="routine-detail-container">
        <div className="routine-detail-header">
          <input
            type="text"
            className="routine-name-input"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="루틴 이름을 입력하세요"
          />
          <textarea
            className="routine-description-input"
            value={routineDescription}
            onChange={(e) => setRoutineDescription(e.target.value)}
            placeholder="간단한 설명을 적어주세요"
          />
        </div>

        <div className="ex-list">
          {exerciseList.map((exercise, i) => {
  const isSelectable = exercise.name === '운동 선택';

  return (
    <div
      key={i}
      className="ex-card"
      onClick={isSelectable ? () => handleCardClick(i) : undefined}
      style={{ cursor: isSelectable ? 'pointer' : 'default' }}
    >
      <div className="ex-info">
        <img src={exercise.image} alt={exercise.name} />
        <div className="ex-text">
          <div className="ex-name">{exercise.name}</div>
          <div className="ex-target">{exercise.description}</div>

          {!isSelectable && (
            <div className="ex-options">
              <label>
                세트:
                <input
                  type="number"
                  value={exercise.sets || 0}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newList = [...exerciseList];
                    newList[i] = { ...newList[i], sets: parseInt(e.target.value, 10) };
                    setExerciseList(newList);
                  }}
                />
              </label>

              <label>
                반복:
                <input
                  type="number"
                  value={exercise.reps || 0}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newList = [...exerciseList];
                    newList[i] = { ...newList[i], reps: parseInt(e.target.value, 10) };
                    setExerciseList(newList);
                  }}
                />
              </label>

              <label>
                시간(초):
                <input
                  type="number"
                  value={exercise.exerciseTime || 0}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newList = [...exerciseList];
                    newList[i] = { ...newList[i], exerciseTime: parseInt(e.target.value, 10) };
                    setExerciseList(newList);
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
})}
</div>
       <div className="button-row">
  <button className="back-button" onClick={handleBack}>돌아가기</button>

  {/* ✅ 운동 추가 버튼 */}
  <button className="add-button" onClick={() => {
    setExerciseList([...exerciseList, {
      name: '운동 선택',
      part: '',
      sets: 3,
      reps: 10,
      exerciseTime: 1,
      description: '운동을 선택해주세요',
      image: '/images/sample-placeholder.png',
    }]);
  }}>
    운동 추가
  </button>

  <button className="save-button" onClick={handleSave}>저장</button>
</div>

      </div>
    </PageWrapper>
  );
};

export default RoutineDetail;
