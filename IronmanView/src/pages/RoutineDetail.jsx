import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RoutineDetail.css';
import { useRoutine } from '../contexts/RoutineContext.jsx';
import PageWrapper from '../layouts/PageWrapper';

const RoutineDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRoutine } = useRoutine();

  const [routineName, setRoutineName] = useState(location.state?.routine?.name || '루틴 A');
  const [exerciseList, setExerciseList] = useState([
    {
      name: '운동 선택',
      part: '',
      description: '운동을 선택해주세요',
      image: '/images/sample-placeholder.png',
    },
  ]);

  const defaultDesc = '루틴 설명을 적어주세요';
  const [routineDesc, setRoutineDesc] = useState(location.state?.routine?.description || defaultDesc);

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
    const preservedName = routine?.name || routineName;

    if (updatedExercise && index !== undefined) {
      setExerciseList((prevList) => {
        const newList = [...prevList];
        newList[index] = {
          name: updatedExercise.name,
          part: updatedExercise.part,
          description: `${updatedExercise.part} 부위를 강화합니다.`,
          image: '/images/sample-new.png',
        };

        if (newList[newList.length - 1].name !== '운동 선택') {
          newList.push({
            name: '운동 선택',
            part: '',
            description: '운동을 선택해주세요',
            image: '/images/sample-placeholder.png',
          });
        }

        // ✅ 여기서 최신 newList 기준으로 상태 저장
        navigate(location.pathname, {
          replace: true,
          state: {
            routine: {
              name: preservedName,
              exercises: newList
                .filter((e) => e.name !== '운동 선택')
                .map((e) => ({ name: e.name, part: e.part })),
            },
          },
        });

        return newList;
      });

      setRoutineName(preservedName);
    }
  }, [location.state]);

  const handleSave = () => {
    const routine = {
      name: routineName,
      description: routineDesc === defaultDesc ? '' : routineDesc,
      duration: 30,
      exercises: exerciseList
        .filter((e) => e.name !== '운동 선택')
        .map((e) => ({
          name: e.name,
          part: e.part,
        })),
    };
    updateRoutine(routine);
    navigate('/routine');
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
            value={routineDesc}
            onChange={(e) => setRoutineDesc(e.target.value)}
            placeholder="defaultDesc"
          />
        </div>

        <div className="ex-list">
          {exerciseList.map((exercise, i) => (
            <div key={i} className="ex-card" onClick={() => handleCardClick(i)}>
              <div className="ex-info">
                <img src={exercise.image} alt={exercise.name} />
                <div>
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
