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
  const [exerciseList, setExerciseList] = useState([
    {
      name: '운동 선택',
      part: '',
      description: '운동을 선택해주세요',
      image: '/images/sample-placeholder.png',
    },
  ]);

  // ✅ 최초 진입 시 루틴 로드
  useEffect(() => {
    const routine = location.state?.routine;
    if (routine?.exercises?.length > 0) {
      const mappedExercises = routine.exercises.map((exercise) => ({
        name: exercise.name,
        part: exercise.part,
        description: `${exercise.part} 부위를 강화합니다.`,
        image: '/images/sample-new.png',
      }));

      setExerciseList(
        mappedExercises[mappedExercises.length - 1].name !== '운동 선택'
          ? [...mappedExercises, {
              name: '운동 선택',
              part: '',
              description: '운동을 선택해주세요',
              image: '/images/sample-placeholder.png',
            }]
          : mappedExercises
      );
    }
  }, []);

  // ✅ 운동 선택 후 돌아왔을 때 반영
  useEffect(() => {
    const { updatedExercise, index, routine } = location.state || {};

    if (updatedExercise && index !== undefined) {
      const preservedName = routine?.name || routineName;

      const updatedList = [...exerciseList];
      updatedList[index] = {
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
          description: '운동을 선택해주세요',
          image: '/images/sample-placeholder.png',
        });
      }

      // 상태 먼저 반영
      setExerciseList(updatedList);
      setRoutineName(preservedName);

      // navigate는 렌더 이후에 실행 (버그 방지용)
      setTimeout(() => {
        navigate(location.pathname, {
          replace: true,
          state: {
            routine: {
              name: preservedName,
              exercises: updatedList
                .filter((e) => e.name !== '운동 선택')
                .map((e) => ({ name: e.name, part: e.part })),
            },
          },
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleSave = async () => {
  const routineData = {
    title: routineName,
    description: routineDescription,
    summary: '루틴 설명', // 현재 고정값, 나중에 추가 입력 받으면 수정
    exercises: exerciseList
      .filter((e) => e.name !== '운동 선택')
      .map((e) => ({
        name: e.name,
        part: e.part,
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

  const handleBack = () => {
    const confirmBack = window.confirm('변경 사항이 저장되지 않습니다. 루틴 목록으로 돌아가시겠습니까?');
    if (confirmBack) {
      navigate('/routine');
    }
  };

  const handleCardClick = (index) => {
    navigate('/search', {
      state: {
        index,
        routine: {
          name: routineName,
          exercises: exerciseList
            .filter((e) => e.name !== '운동 선택')
            .map((e) => ({ name: e.name, part: e.part })),
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
          {exerciseList.map((exercise, i) => (
            <div key={i} className="ex-card" onClick={() => handleCardClick(i)}>
              <div className="ex-info">
                <img src={exercise.image} alt={exercise.name} />
                <div className='ex-text'>
                  <div className="ex-name">{exercise.name}</div>
                  <div className="ex-target">{exercise.description}</div>
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
    </PageWrapper>
  );
};

export default RoutineDetail;
