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
  const [routines, setRoutines] = useState([]);              // ✅ 루틴 목록
  const [selectedRoutine, setSelectedRoutine] = useState(null); // ✅ 선택된 루틴

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

  const filteredExercises = dummyExercises.filter((exercise) => {
    const matchesSearch = exercise.exerciseName.includes(searchTerm);
    const matchesPart = selectedPart === '전체' || exercise.part === selectedPart;
    return matchesSearch && matchesPart;
  });

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
            <img src={exercise.image} alt={exercise.name} />
            <div className="card-info-exp">
              <h4>{exercise.exerciseName}</h4>
              <p>{exercise.part}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 */}
      <div className="right-panel-exp">
        <div className="right-top-exp">
          <p>루틴 리스트</p>
          {routines.map((routine) => (
            <div
              key={routine.routineId}
              className={`routine-card-small ${selectedRoutine?.routineId === routine.routineId ? 'active' : ''}`}
              onClick={() => setSelectedRoutine(routine)}
            >
              {routine.title || '제목 없음'}
            </div>
          ))}
        </div>

        <div className="right-bottom-exp">
          <p>루틴 상세 운동 리스트</p>
          {selectedRoutine && selectedRoutine.exercises.length > 0 ? (
            selectedRoutine.exercises.map((e, idx) => (
              <div key={idx} className="routine-exercise-item">
                <strong>{e.exerciseName}</strong> - 세트: {e.sets} / 반복: {e.reps}
              </div>
            ))
          ) : (
            <p className="empty-msg">루틴을 선택하세요.</p>
          )}
        </div>
      </div>

      {showModal && selectedExercise && (
        <div className="modal-overlay-exp">
          <div className="modal-content-exp">
            <button className="close-btn-exp" onClick={() => setShowModal(false)}>X</button>
            <h2>{selectedExercise.name}</h2>
            <img src={selectedExercise.image} alt={selectedExercise.name} />
            <p>운동 부위: {selectedExercise.part}</p>
            <p style={{ marginTop: '10px' }}>{selectedExercise.description}</p>
            <div className="modal-buttons-exp">
              <button className="start-btn-exp" onClick={handleStartExercise}>운동하기</button>
              <button className="add-btn-exp">루틴에 넣기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseExplore;
