import React, { useState, useEffect } from 'react';
import '../styles/ExerciseExplore.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const dummyExercises = [
  {
    exerciseId: 1,
    exerciseName: '벤치 프레스',
    part: '상체',
    image: '/images/exerciseImg/bench_press2.png',
    description: '벤치에 누워 바벨을 가슴 위로 들어올리는 운동'
  },
  {
    exerciseId: 2,
    exerciseName: '덤벨 벤치 프레스',
    part: '상체',
    image: '/images/exerciseImg/dumbbell_bench_press2.png',
    description: '벤치에 누워 덤벨을 양손에 들고 가슴 위로 밀어올리는 운동'
  },
  {
    exerciseId: 3,
    exerciseName: '덤벨 풀오버',
    part: '상체',
    image: '/images/exerciseImg/dumbbell_pullover2.png',
    description: '덤벨을 머리 뒤에서 가슴 방향으로 당겨오는 운동'
  },
  {
    exerciseId: 4,
    exerciseName: '펙덱 플라이',
    part: '상체',
    image: '/images/exerciseImg/pec_deck_fly2.png',
    description: '기구를 이용해 양 팔을 벌렸다가 모으며 가슴 근육을 수축시키는 운동'
  },
  {
    exerciseId: 5,
    exerciseName: '스쿼트',
    part: '하체',
    image: '/images/exerciseImg/squat2.png',
    description: '서 있는 자세에서 엉덩이를 낮췄다가 다시 일어나는 하체 운동'
  },
  {
    exerciseId: 6,
    exerciseName: '런지',
    part: '하체',
    image: '/images/exerciseImg/lunge2.png',
    description: '한쪽 다리를 앞으로 내디뎌 무릎을 굽히며 하체를 단련하는 운동'
  },
  {
    exerciseId: 7,
    exerciseName: '윗몸 일으키기',
    part: '코어',
    image: '/images/exerciseImg/situp2.png',
    description: '누운 상태에서 양손을 머리 뒤에 두고 복근을 이용해 상체를 일으키는 운동'
  },
  {
    exerciseId: 8,
    exerciseName: '버드독',
    part: '코어',
    image: '/images/exerciseImg/bird_dog2.png',
    description: '네 발 자세에서 팔과 다리를 교차로 들어올려 코어를 단련하는 운동'
  },
  {
    exerciseId: 9,
    exerciseName: '사이드 레그 레이즈',
    part: '코어',
    image: '/images/exerciseImg/side_leg_raise2.png',
    description: '옆으로 누워 다리를 들어올리며 옆구리와 엉덩이 근육을 자극하는 운동'
  }
];


const bodyParts = ['전체', '상체', '하체', '코어', '유산소', '전신'];

const ExerciseExplore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState('전체');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [routineModal, setRoutineModal] = useState(null);
  const [originalRoutine, setOriginalRoutine] = useState(null);
  const [calculatedTime, setCalculatedTime] = useState(0);

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get('http://localhost:329/web/api/routine/list', {
          withCredentials: true,
        });
        setRoutines(response.data);
      } catch (error) {
        console.error('루틴 목록 불러오기 실패:', error);
      }
    };

    fetchRoutines();
  }, []);

  const handleStartExercise = () => {
    navigate('/postureanalysis', { state: { exercise: selectedExercise } });
  };

  const handleCardClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const handleRoutineSelect = (routine) => {
    console.log('선택된 루틴:', routine);
    setSelectedRoutine(routine);
  };

  const handleRoutineCardClick = (routine) => {
    setRoutineModal(JSON.parse(JSON.stringify(routine))); // 깊은 복사
    setOriginalRoutine(JSON.parse(JSON.stringify(routine)));
  };


  const handleStartRoutine = (e) => {
    e.stopPropagation(); // ← 이 줄 추가
    if (selectedRoutine) {
        navigate('/postureanalysis', { state: { routine: selectedRoutine } });
    }
  };

  const addExerciseToRoutine = () => {
    if (!selectedRoutine || !selectedExercise) return;

    // 새로운 운동 객체 구성
    const newExercise = {
        exerciseId: selectedExercise.exerciseId,
        exerciseName: selectedExercise.exerciseName,
        sets: 3,
        reps: 5,
        exerciseTime: 60,
        breaktime: 30,
        order: selectedRoutine.exercises.length + 1,
        isNew: true,
    };

    // selectedRoutine 업데이트
    const updatedRoutine = {
        ...selectedRoutine,
        exercises: [...selectedRoutine.exercises, newExercise],
    };

    setSelectedRoutine(updatedRoutine);

    // 루틴 목록도 함께 업데이트해주면 UI 일관성 ↑
    setRoutines(prev =>
        prev.map(r => r.routineId === selectedRoutine.routineId ? updatedRoutine : r)
    );

    setShowModal(false); // 모달 닫기
  };


  const filteredExercises = dummyExercises.filter((exercise) => {
    const matchesSearch = exercise.exerciseName.includes(searchTerm);
    const matchesPart = selectedPart === '전체' || exercise.part === selectedPart;
    return matchesSearch && matchesPart;
  });

  const isRoutineModified = () => {
    if (!originalRoutine || !routineModal) return false;

    const originalExercises = originalRoutine.exercises;
    const currentExercises = routineModal.exercises;

    // 운동 개수 비교
    if (originalExercises.length !== currentExercises.length) return true;

    // 각 운동의 reps/sets 비교
    for (let i = 0; i < currentExercises.length; i++) {
      if (
        originalExercises[i].exerciseId !== currentExercises[i].exerciseId ||
        originalExercises[i].sets !== currentExercises[i].sets ||
        originalExercises[i].reps !== currentExercises[i].reps
      ) {
        return true;
      }
    }

    return false;
  };

  const calculateTotalTime = (exercises) => {
    return exercises.reduce((acc, e) => {
      const sets = e.sets ?? 1;
      const reps = e.reps ?? 1;
      const exerciseTime = e.exerciseTime ?? 1;
      const breaktime = e.breaktime ?? 0;

      const time = sets * reps * exerciseTime + (sets - 1) * breaktime;
      return acc + time;
    }, 0);
  };

  const formatSecondsToHourMinute = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}시간 ${remainingMinutes}분`;
    } else {
      return `${remainingMinutes}분`;
    }
  };


  useEffect(() => {
    if (routineModal) {
      setCalculatedTime(calculateTotalTime(routineModal.exercises));
    }
  }, [routineModal]);

  return (
    <div className="explore-container">
      {/* 왼쪽 */}
      <div className="left-panel-exp">
        <div className="filter-buttons-exp">
          {bodyParts.map((part) => (
            <button
              key={part}
              className={`filter-btn-exp ${selectedPart === part ? 'active' : ''}`}
              onClick={() => setSelectedPart(part)}
            >
              {part}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="exercise-search-input-exp"
          placeholder="운동 이름을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredExercises.map((exercise) => (
          <div
            key={exercise.exerciseId}
            className="exercise-card-exp"
            onClick={() => handleCardClick(exercise)}
          >
            <img src={exercise.image} alt={exercise.exerciseName} />
            <div className="card-info-exp">
              <h4>{exercise.exerciseName}</h4>
              <p>{exercise.part}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 */}
      <div className="right-panel-exp" onClick={() => setSelectedRoutine(null)}>
        <div className="right-top-exp">
          <p>루틴 리스트</p>
          {routines.map((routine) => (
            <div
                key={routine.routineId}
                className={`routine-card-box-exp ${selectedRoutine?.routineId === routine.routineId ? 'selected' : ''}`}
                onClick={(e) => {
                e.stopPropagation();
                handleRoutineCardClick(routine);
                }}
            >
                <div className="routine-card-title-exp">{routine.title || '제목 없음'}</div>
                <button
                className="routine-select-btn-exp"
                onClick={(e) => {
                    e.stopPropagation();
                    handleRoutineSelect(routine);
                }}
                >
                선택
                </button>
            </div>
            ))}
        </div>

        <div className="right-bottom-exp">
          {selectedRoutine && selectedRoutine.exercises.length > 0 ? (
            selectedRoutine.exercises.map((e, idx) => (
              <div key={idx} className="routine-exercise-item-exp">
                <div className="routine-exercise-header-exp">
                  <div className="routine-exercise-text-exp">
                    <strong>{e.exerciseName}</strong> 
                  </div>

                  {e.isNew && (
                    <button
                      className="delete-exercise-btn-exp"
                      onClick={(eBtn) => {
                        eBtn.stopPropagation();
                        const updatedExercises = selectedRoutine.exercises.filter((_, i) => i !== idx);
                        const updatedRoutine = { ...selectedRoutine, exercises: updatedExercises };
                        setSelectedRoutine(updatedRoutine);
                        setRoutines(prev =>
                          prev.map(r => r.routineId === selectedRoutine.routineId ? updatedRoutine : r)
                        );
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">루틴을 선택하세요</p>
          )}
        </div>
      </div>

      {/* 운동 모달 */}
      {showModal && selectedExercise && (
        <div className="modal-overlay-exp">
          <div className="modal-content-exp">
            <button className="close-btn-exp" onClick={() => setShowModal(false)}>X</button>
            <h2>{selectedExercise.exerciseName}</h2>
            <img src={selectedExercise.image} alt={selectedExercise.exerciseName} />
            <p>운동 부위: {selectedExercise.part}</p>
            <p style={{ marginTop: '10px' }}>{selectedExercise.description}</p>
            <div className="modal-buttons-exp">
              <button className="start-btn-exp" onClick={handleStartExercise}>운동하기</button>
              <button className="add-btn-exp" onClick={addExerciseToRoutine}>루틴에 넣기</button>
            </div>
          </div>
        </div>
      )}

      {/* 루틴 모달 */}
      {routineModal && (
        <div className="modal-overlay-exp">
          <div className="modal-content-exp">
            <button className="close-btn-exp" onClick={() => setRoutineModal(null)}>X</button>

            {/* 제목, 설명 */}
            <input
              type="text"
              value={routineModal.title}
              onChange={(e) => setRoutineModal({ ...routineModal, title: e.target.value })}
              className="routine-edit-input-exp"
              placeholder="루틴 제목"
            />
            <textarea
              value={routineModal.summary || ''}
              onChange={(e) => setRoutineModal({ ...routineModal, summary: e.target.value })}
              className="routine-edit-textarea-exp"
              placeholder="루틴 설명"
            />

            {/* ✅ 총 운동 시간 표시 */}
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#ccc', textAlign: 'left' }}>
              총 운동 예상 시간: <strong>{formatSecondsToHourMinute(calculatedTime)}</strong>
            </p>

            {/* 운동 카드 리스트 */}
            <div className="routine-exercise-list-exp">
              {routineModal.exercises.map((e, i) => (
                <div key={i} className="exercise-card-exp modal-version">
                  <div className="card-info-exp">
                    <h4>{e.exerciseName}</h4>
                    <div className="exercise-set-rep-inputs">
                      세트:
                      <input
                        type="number"
                        min="1"
                        value={e.sets}
                        onChange={(ev) => {
                          const updated = [...routineModal.exercises];
                          updated[i].sets = parseInt(ev.target.value);
                          setRoutineModal({ ...routineModal, exercises: updated });
                        }}
                      />
                      반복:
                      <input
                        type="number"
                        min="1"
                        value={e.reps}
                        onChange={(ev) => {
                          const updated = [...routineModal.exercises];
                          updated[i].reps = parseInt(ev.target.value);
                          setRoutineModal({ ...routineModal, exercises: updated });
                        }}
                      />
                      운동 시간(초):
                      <input
                        type="number"
                        min="0"
                        value={e.exerciseTime}
                        onChange={(ev) => {
                          const updated = [...routineModal.exercises];
                          updated[i].exerciseTime = parseInt(ev.target.value);
                          setRoutineModal({ ...routineModal, exercises: updated });
                        }}
                      />
                      휴식 시간(초):
                      <input
                        type="number"
                        min="0"
                        value={e.breaktime}
                        onChange={(ev) => {
                          const updated = [...routineModal.exercises];
                          updated[i].breaktime = parseInt(ev.target.value);
                          setRoutineModal({ ...routineModal, exercises: updated });
                        }}
                      />  
                      {/* 삭제 버튼 */}
                      <button
                        className="delete-exercise-btn-exp"
                        onClick={() => {
                          const updated = routineModal.exercises.filter((_, idx) => idx !== i);
                          setRoutineModal({ ...routineModal, exercises: updated });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                className="save-btn-exp"
                onClick={() => {
                  setSelectedRoutine(routineModal);
                  setRoutines(prev => prev.map(r => r.routineId === routineModal.routineId ? routineModal : r));
                  setRoutineModal(null);
                }}
              >
                수정 및 저장
              </button>

              <button
                className="start-btn-exp"
                disabled={isRoutineModified()}
                onClick={() => navigate('/postureanalysis', { state: { routine: routineModal } })}
              >
                운동하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseExplore;
