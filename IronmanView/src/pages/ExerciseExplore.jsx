import React, { useState, useEffect, useContext } from 'react';
import '../styles/ExerciseExplore.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const dummyExercises = [
  // 기존 9개
  { exerciseId: 1, exerciseName: '벤치 프레스', part: '상체', image: '/images/exerciseImg/bench_press2.png', description: '벤치에 누워 바벨을 가슴 위로 들어올리는 운동' },
  { exerciseId: 2, exerciseName: '덤벨 벤치 프레스', part: '상체', image: '/images/exerciseImg/dumbbell_bench_press2.png', description: '벤치에 누워 덤벨을 양손에 들고 가슴 위로 밀어올리는 운동' },
  { exerciseId: 3, exerciseName: '덤벨 풀오버', part: '상체', image: '/images/exerciseImg/dumbbell_pullover2.png', description: '덤벨을 머리 뒤에서 가슴 방향으로 당겨오는 운동' },
  { exerciseId: 4, exerciseName: '펙덱 플라이', part: '상체', image: '/images/exerciseImg/pec_deck_fly2.png', description: '기구를 이용해 양 팔을 벌렸다가 모으며 가슴 근육을 수축시키는 운동' },
  { exerciseId: 5, exerciseName: '스쿼트', part: '하체', image: '/images/exerciseImg/squat2.png', description: '서 있는 자세에서 엉덩이를 낮췄다가 다시 일어나는 하체 운동' },
  { exerciseId: 6, exerciseName: '런지', part: '하체', image: '/images/exerciseImg/lunge2.png', description: '한쪽 다리를 앞으로 내디뎌 무릎을 굽히며 하체를 단련하는 운동' },
  { exerciseId: 7, exerciseName: '윗몸 일으키기', part: '코어', image: '/images/exerciseImg/situp2.png', description: '누운 상태에서 양손을 머리 뒤에 두고 복근을 이용해 상체를 일으키는 운동' },
  { exerciseId: 8, exerciseName: '버드독', part: '코어', image: '/images/exerciseImg/bird_dog2.png', description: '네 발 자세에서 팔과 다리를 교차로 들어올려 코어를 단련하는 운동' },
  { exerciseId: 9, exerciseName: '사이드 레그 레이즈', part: '코어', image: '/images/exerciseImg/side_leg_raise2.png', description: '옆으로 누워 다리를 들어올리며 옆구리와 엉덩이 근육을 자극하는 운동' },

  // 상체
  { exerciseId: 10, exerciseName: '풀업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '철봉에 매달려 턱을 올리는 상체 근력 운동' },
  { exerciseId: 11, exerciseName: '딥스', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '평행봉에서 팔을 굽혔다 펴며 가슴과 삼두근을 강화하는 운동' },
  { exerciseId: 12, exerciseName: '푸시업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '바닥에 엎드려 팔을 굽혔다 펴는 전신 근력 운동' },
  { exerciseId: 13, exerciseName: '다이아몬드 푸시업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '손을 모아 팔꿈치를 굽혀 삼두근을 강화하는 푸시업 변형' },
  { exerciseId: 14, exerciseName: '와이드 푸시업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '팔을 넓게 벌려 가슴 근육을 강화하는 푸시업 변형' },
  { exerciseId: 15, exerciseName: '인클라인 푸시업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '상체를 기울여 팔굽혀펴기를 수행하는 변형 운동' },
  { exerciseId: 16, exerciseName: '디클라인 푸시업', part: '상체', image: '/images/exerciseImg/default_exercise.png', description: '발을 높여 상체를 낮춰 팔굽혀펴기를 수행하는 변형 운동' },

  // 하체
  { exerciseId: 17, exerciseName: '점프 스쿼트', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '스쿼트 후 점프를 하여 하체 폭발력을 향상시키는 운동' },
  { exerciseId: 18, exerciseName: '브릿지', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '누운 상태에서 엉덩이를 들어올려 둔근과 햄스트링을 강화하는 운동' },
  { exerciseId: 19, exerciseName: '사이드 런지', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '옆으로 발을 내딛으며 하체 근육을 발달시키는 운동' },
  { exerciseId: 20, exerciseName: '리버스 런지', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '뒤로 발을 내딛으며 하체와 균형을 발달시키는 운동' },
  { exerciseId: 21, exerciseName: '월 싯', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '벽에 등을 붙이고 앉은 자세를 유지하는 하체 근지구력 운동' },
  { exerciseId: 22, exerciseName: '불가리안 스플릿 스쿼트', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '한 발을 뒤에 올리고 스쿼트를 수행하는 하체 운동' },
  { exerciseId: 23, exerciseName: '카프 레이즈', part: '하체', image: '/images/exerciseImg/default_exercise.png', description: '발끝으로 서서 종아리 근육을 강화하는 운동' },

  // 코어
  { exerciseId: 24, exerciseName: '플랭크', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '팔꿈치와 발끝으로 몸을 지탱하며 코어를 강화하는 운동' },
  { exerciseId: 25, exerciseName: '마운틴 클라이머', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '팔을 짚고 무릎을 번갈아 빠르게 당겨 복부와 전신을 강화하는 운동' },
  { exerciseId: 26, exerciseName: '레그 레이즈', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '누워서 다리를 들어 복부 하부를 자극하는 운동' },
  { exerciseId: 27, exerciseName: '러시안 트위스트', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '앉아서 몸통을 좌우로 비틀어 복부 옆 근육을 강화하는 운동' },
  { exerciseId: 28, exerciseName: '바이시클 크런치', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '자전거 타듯 다리를 움직이며 상체를 비트는 복부 운동' },
  { exerciseId: 29, exerciseName: '데드버그', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '누운 상태에서 팔다리를 번갈아 들어 코어를 안정화하는 운동' },
  { exerciseId: 30, exerciseName: '플러터 킥', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '누워서 다리를 번갈아 위아래로 차는 복부 운동' },
  { exerciseId: 31, exerciseName: '힐 터치', part: '코어', image: '/images/exerciseImg/default_exercise.png', description: '누운 상태에서 옆으로 굽혀 발목을 터치하는 복부 옆근육 운동' },

  // 유산소
  { exerciseId: 32, exerciseName: '버피 테스트', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '점프와 푸시업을 결합한 고강도 전신 유산소 운동' },
  { exerciseId: 33, exerciseName: '점핑잭', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '팔과 다리를 동시에 벌렸다 모으며 전신을 사용하는 유산소 운동' },
  { exerciseId: 34, exerciseName: '하이 니', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '무릎을 높이 들어 제자리 달리기하는 유산소 운동' },
  { exerciseId: 35, exerciseName: '브로드 점프', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '멀리 뛰어 하체와 전신을 사용하는 유산소 운동' },
  { exerciseId: 36, exerciseName: '스케이터 점프', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '옆으로 점프하며 착지하는 하체·유산소 운동' },
  { exerciseId: 37, exerciseName: '스텝박스 점프', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '박스 위로 점프하고 내려오는 전신 유산소 운동' },
  { exerciseId: 38, exerciseName: '마운틴 스텝', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '계단이나 단상을 오르내리는 유산소 운동' },
  { exerciseId: 39, exerciseName: '베어 크롤', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '네 발로 기어가며 전신을 사용하는 유산소 운동' },
  { exerciseId: 40, exerciseName: '크랩 워크', part: '유산소', image: '/images/exerciseImg/default_exercise.png', description: '뒤로 네 발로 이동하며 전신을 사용하는 유산소 운동' },

  // 전신
  { exerciseId: 41, exerciseName: '스파이더맨 푸시업', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '푸시업과 동시에 무릎을 옆으로 당기는 전신 운동' },
  { exerciseId: 42, exerciseName: '잭나이프', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '상체와 하체를 동시에 들어올려 접는 전신 운동' },
  { exerciseId: 43, exerciseName: '프론트 킥', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '발을 앞으로 차며 하체와 코어를 사용하는 전신 운동' },
  { exerciseId: 44, exerciseName: '백 킥', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '발을 뒤로 차며 둔근과 코어를 사용하는 전신 운동' },
  { exerciseId: 45, exerciseName: '버드독 변형', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '팔과 다리를 들어올리며 균형을 유지하는 전신 운동' },
  { exerciseId: 46, exerciseName: '윈드밀', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '팔을 벌리고 상체를 숙여 반대 손으로 발끝을 터치하는 전신 운동' },
  { exerciseId: 47, exerciseName: '프론트 런지 트위스트', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '런지 동작과 상체 비틀기를 결합한 전신 운동' },
  { exerciseId: 48, exerciseName: '인치웜', part: '전신', image: '/images/exerciseImg/default_exercise.png', description: '상체를 숙여 손으로 앞으로 이동 후 복귀하는 전신 운동' }
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
  const [customSets, setCustomSets] = useState(3);
  const [customReps, setCustomReps] = useState(5);
  const [customExerciseTime, setCustomExerciseTime] = useState(60);
  const [customBreaktime, setCustomBreaktime] = useState(30);
  const [expandedRoutineId, setExpandedRoutineId] = useState(null);
  const [showRoutineSelectModal, setShowRoutineSelectModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);  // 🔹 모바일 여부 체크
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineSummary, setNewRoutineSummary] = useState('');
  const [showRoutineInputModal, setShowRoutineInputModal] = useState(false);
  
  // 전역 변수 감지
  const { surveyDone } = useContext(AuthContext);
  const leftBtnLabel = '루틴 추천받기';
  const leftBtnPath  = '/chatbot';

  // ✅ 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1000;
      setIsMobile(isNowMobile);

      if (isNowMobile) {
        setShowRightPanel(false); // 모바일 전환 시 패널 닫기
      } else {
        setShowRightPanel(true);  // 데스크탑 전환 시 패널 열기
      }
    };

  // 초기 실행
  handleResize();

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const navigate = useNavigate();
  
  // 운동을 선택하거나 모바일에 넣을 때 기본 값 넣기
  useEffect(() => {
    if (showModal && selectedExercise) {
      setCustomSets(3);
      setCustomReps(5);
      setCustomExerciseTime(60);
      setCustomBreaktime(30);
    }
  }, [showModal, selectedExercise]);
  
  // 루틴 목록
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

  // 개별 운동하기 클릭할 경우 함수
  const handleStartExercise = () => {
    const exerciseWithCustomValues = {
    ...selectedExercise,
    sets: customSets,
    reps: customReps,
    exerciseTime: customExerciseTime,
    breaktime: customBreaktime,
    };

    console.log('[운동하기 클릭] 전달될 운동 정보:', exerciseWithCustomValues); // 🔍
    
    navigate('/postureanalysis', { state: { exercise: exerciseWithCustomValues } });
  };

  // 운동을 선택하면, 운동 모달을 선택하고 모달을 띄우는 함수
  const handleCardClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  // 루틴을 선택하는 함수
  const handleRoutineSelect = (routine) => {
    console.log('선택된 루틴:', routine);
    setSelectedRoutine(routine);
  };

  // 운동을 루틴에 추가하는 함수
  const addExerciseToRoutine = (routine) => {
    if (!routine || !selectedExercise) return;

    const newExercise = {
      exerciseId: selectedExercise.exerciseId,
      exerciseName: selectedExercise.exerciseName,
      exerciseImg: selectedExercise.image,
      sets: customSets,
      reps: customReps,
      exerciseTime: customExerciseTime,
      breaktime: customBreaktime,
      order: routine.exercises.length + 1,
      isNew: true,
    };

    const updatedRoutine = {
      ...routine,
      exercises: [...routine.exercises, newExercise],
    };

    // 전역 selectedRoutine도 업데이트
    setSelectedRoutine(updatedRoutine);

    // 루틴 목록도 업데이트
    setRoutines((prev) =>
      prev.map((r) => r.routineId === routine.routineId ? updatedRoutine : r)
    );
  };


  // 운동 필터링
  const filteredExercises = dummyExercises.filter((exercise) => {
    const matchesSearch = exercise.exerciseName.includes(searchTerm);
    const matchesPart = selectedPart === '전체' || exercise.part === selectedPart;
    return matchesSearch && matchesPart;
  });

  const calculateTotalTime = (exercises) => {
    return exercises.reduce((acc, e) => {
      const sets = e.sets ?? 1;
      const exerciseTime = e.exerciseTime ?? 1;
      const breaktime = e.breaktime ?? 0;

      const time = (exerciseTime + breaktime) * sets;
      
      return acc + time;
    }, 0);
  };

  // 초 단위를 시간, 분단위로 바꾸는 함수
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

  // 🔢 고정 인덱스 생성 로직 (routineId 기반)
  const getImageIndexFromId = (id) => {
    if (!id) return 1;
    return (id % 5) + 1;  // 1~5 사이
  };

  // ???
  const updateRoutineExercises = (routineId, updatedExercises) => {
    setRoutines(prev =>
      prev.map(r => r.routineId === routineId ? { ...r, exercises: updatedExercises } : r)
    );

  };
  
  // 루틴 저장하기
  const saveRoutineToServer = async (routine) => {
    try {
      const payload = {
        routineId: routine.routineId,
        title: routine.title,
        summary: routine.summary,
        exercises: routine.exercises.map(e => ({
          exerciseId: e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          exerciseTime: e.exerciseTime,
          breaktime: e.breaktime,
        })),
      };

      const response = await axios.post(
        'http://localhost:329/web/api/routine/save',
        payload,
        { withCredentials: true }
      );

      console.log('✅ 루틴 저장 성공:', response.data);
      alert('루틴이 저장되었습니다!');
    } catch (error) {
      console.error('❌ 루틴 저장 실패:', error);
      alert('루틴 저장에 실패했습니다.');
    }
  };

  // 루틴 삭제하기
  const deleteRoutineFromServer = async (routineId) => {
    try {
      await axios.delete(`http://localhost:329/web/api/routine/${routineId}`, {
        withCredentials: true
      });
      setRoutines(prev => prev.filter(r => r.routineId !== routineId));
      if (selectedRoutine?.routineId === routineId) {
        setSelectedRoutine(null);
      }
      if (routineModal?.routineId === routineId) {
        setRoutineModal(null);
      }
      alert('루틴이 삭제되었습니다.');
    } catch (error) {
      console.error('❌ 루틴 삭제 실패:', error);
      alert('루틴 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="explore-container">

      {/* 📱 토글 버튼 (왼쪽 하단) */}
          {isMobile && (
            <button
              className="toggle-right-panel-btn left"
              onClick={() => setShowRightPanel((prev) => !prev)}
            >
              {showRightPanel ? '▶ 루틴 닫기' : '◀ 루틴 열기'}
            </button>
          )}

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
      <div
        className={`right-panel-exp ${showRightPanel ? 'visible' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRoutine(null);
        }}
      >
        <div className="right-top-exp">
          <p>루틴 리스트</p>
            {routines.map((routine, index) => {
              const isExpanded = expandedRoutineId === routine.routineId;
              const totalTime = calculateTotalTime(routine.exercises);
              const imageIndex = getImageIndexFromId(routine.routineId);
              const backgroundImageUrl = `/images/bg/exercise_man${imageIndex}.png`;

              return (
                <div 
                  key={routine.routineId} 
                  className="routine-card-large-exp"
                >
                  {/* 🔥 배경 이미지 */}
                  <div
                    className="routine-background-image"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                  />
                  <div className="routine-card-content">
                  {/* 🔴 루틴 삭제 버튼 (우상단) */}
                  <button
                    className="routine-delete-btn-exp"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('삭제 버튼 클릭 - 루틴 ID:', routine.routineId);
                      const confirmed = window.confirm(`'${routine.title}' 루틴을 정말 삭제하시겠습니까?`);
                      if (confirmed) {
                        deleteRoutineFromServer(routine.routineId);
                      }
                    }}
                  >
                    ✕
                  </button>
                  
                  {/* 상단: 제목, 시간, 운동 목록 */}
                  <div className="routine-card-header">
                    <h3>{routine.title || '제목 없음'}</h3>
                    {routine.summary && <p className="routine-summary">{routine.summary}</p>} 
                    <p>총 시간: {formatSecondsToHourMinute(totalTime)}</p>
                    <p>운동: {routine.exercises.map((e) => e.exerciseName).join(', ')}</p>
                  </div>

                  {/* 상세 보기 (화살표 클릭 시 확장) */}
                  {isExpanded && (
                    <div className="routine-card-detail">
                      <div className="exercise-set-rep-inputs">
                      {routine.exercises.map((e, i) => (
                        <div key={i} className="routine-exercise-row">
                          {/* 상단: 운동 이름 + 삭제 버튼 */}
                          <div className="routine-exercise-header">
                            <p className="exercise-name">{e.exerciseName}</p>
                            <button
                              className="routine-exercise-delete-btn-exp"
                              onClick={() => {
                                const updated = routine.exercises.filter((_, idx) => idx !== i);
                                updateRoutineExercises(routine.routineId, updated);
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {/* 이미지 및 입력 필드 */}
                          <div className="routine-exercise-body">
                            <img
                              src={e.exerciseImg}
                              alt={e.exerciseName}
                              className="exercise-thumb"
                            />
                            <div className='exercise-input-group'>
                                <div className='input-row-elements'>
                                  세트: <input type="number" value={e.sets} onChange={(ev) => {
                                    const updated = [...routine.exercises];
                                    updated[i].sets = Number(ev.target.value);
                                    updateRoutineExercises(routine.routineId, updated);
                                  }} />
                                </div>
                                <div className='input-row-elements'>
                                  반복: <input type="number" value={e.reps} onChange={(ev) => {
                                    const updated = [...routine.exercises];
                                    updated[i].reps = Number(ev.target.value);
                                    updateRoutineExercises(routine.routineId, updated);
                                  }} />
                                </div>
                                <div className='input-row-elements'>
                                시간: <input type="number" value={e.exerciseTime} onChange={(ev) => {
                                  const updated = [...routine.exercises];
                                  updated[i].exerciseTime = Number(ev.target.value);
                                  updateRoutineExercises(routine.routineId, updated);
                                }} />
                                </div>
                                <div className='input-row-elements'>
                                휴식: <input type="number" value={e.breaktime} onChange={(ev) => {
                                  const updated = [...routine.exercises];
                                  updated[i].breaktime = Number(ev.target.value);
                                  updateRoutineExercises(routine.routineId, updated);
                                }} />
                                </div>
                              
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                      <div className="routine-detail-footer">
                        <button
                          className="save-btn-exp"
                          onClick={() => {
                            console.log('루틴 저장:', routine);
                            saveRoutineToServer(routine)
                          }}
                        >
                          수정/저장
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 하단 버튼 영역 */}
                  <div className="routine-card-footer">
                    <button
                      className="start-btn-inside"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/postureanalysis', { state: { routine } });
                      }}
                    >
                      루틴 시작하기
                    </button>
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedRoutineId(isExpanded ? null : routine.routineId)}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="routine-create-section-exp">
            <button
              className="routine-create-btn-exp"
              onClick={() => setShowRoutineInputModal(true)}
            >
              ＋ 새 루틴 만들기
            </button>
          </div>
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
            <div className="exercise-set-rep-inputs">
              <div className="input-row-exp">
                <div className="input-group-exp">
                  <label htmlFor="sets">세트:</label>
                  <input id="sets" type="number" value={customSets} onChange={(e) => setCustomSets(Number(e.target.value))} />
                </div>
                <div className="input-group-exp">
                  <label htmlFor="reps">반복:</label>
                  <input id="reps" type="number" value={customReps} onChange={(e) => setCustomReps(Number(e.target.value))} />
                </div>
              </div>
              <div className="input-row-exp">
                <div className="input-group-exp">
                  <label htmlFor="exerciseTime">운동 시간(초):</label>
                  <input id="exerciseTime" type="number" value={customExerciseTime} onChange={(e) => setCustomExerciseTime(Number(e.target.value))} />
                </div>
                <div className="input-group-exp">
                  <label htmlFor="breaktime">휴식 시간(초):</label>
                  <input id="breaktime" type="number" value={customBreaktime} onChange={(e) => setCustomBreaktime(Number(e.target.value))} />
                </div>
              </div>
            </div>
            <div className="modal-buttons-exp">
              <button className="start-btn-exp" onClick={handleStartExercise}>운동하기</button>
              <button className="add-btn-exp" onClick={() => {setShowRoutineSelectModal(true);}}>루틴에 넣기</button>
            </div>
          </div>
        </div>
      )}

      {/* 루틴 선택 모달 */}
      {showRoutineSelectModal && (
        <div className="modal-overlay-exp">
          <div className="modal-content-exp">
            <button className="close-btn-exp" onClick={() => setShowRoutineSelectModal(false)}>X</button>
            <h3>루틴 선택</h3>
            {routines.map((routine) => (
              <div key={routine.routineId} className="routine-select-item" onClick={() => {
                handleRoutineSelect(routine);
                addExerciseToRoutine(routine);
                setExpandedRoutineId(routine.routineId);
                setShowRoutineSelectModal(false);
                setShowModal(false);  // 운동 모달도 닫기
                setShowRightPanel(true);
              }}>
                {routine.title || '제목 없음'}
              </div>
            ))}

            {/* ➕ 루틴 만들기 버튼 추가 */}
            <button
              className="routine-create-btn-inline"
              onClick={() => {
                setShowRoutineSelectModal(false);       // 기존 모달 닫고
                setShowRoutineInputModal(true);         // 루틴 생성 모달 열기
                setShowModal(false);
              }}
            >
              ＋ 새 루틴 만들기
            </button>
          </div>
        </div>
      )}

      {showRoutineInputModal && (
        <div 
          className="modal-overlay-exp"
          onClick={(e)=>{ 
            if (e.target === e.currentTarget) setShowRoutineInputModal(false);
          }}
        >
          <div className="routine-create-modal">
            <button className="close-btn-exp" onClick={() => setShowRoutineInputModal(false)}>X</button>
            <h3>새 루틴 만들기</h3>
            <input
              type="text"
              placeholder="새 루틴"
              value={newRoutineTitle}
              onChange={(e) => setNewRoutineTitle(e.target.value)}
            />
            <textarea
              placeholder="내 운동 루틴"
              value={newRoutineSummary}
              onChange={(e) => setNewRoutineSummary(e.target.value)}
              rows={4}
            />
            <div className='create-row-exp'>
              <button
                className="secondary-btn-exp"
                onClick={() => {
                  navigate(leftBtnPath);
                }}
                disabled={!surveyDone} // 🔹 설문 미완료 시 버튼 비활성화
                style={{
                  opacity: surveyDone ? 1 : 0.5, // 🔹 시각적으로 흐리게
                  cursor: surveyDone ? "pointer" : "not-allowed"
                }}
              >
                {leftBtnLabel}
              </button>
              <button
                className="create-btn-exp"
                onClick={() => {
                  const newRoutine = {
                    routineId: null,  
                    title: newRoutineTitle || '새 루틴',
                    summary: newRoutineSummary || '내 운동 루틴',
                    exercises: [],
                    isNew: true,
                  };
                  setRoutines((prev) => [...prev, newRoutine]);
                  setExpandedRoutineId(newRoutine.routineId);
                  setSelectedRoutine(newRoutine);
                  setShowRightPanel(true);
                  setShowRoutineInputModal(false);
                  setNewRoutineTitle('새 루틴');
                  setNewRoutineSummary('내 운동 루틴');
                }}
              >
                만들기
              </button>
            </div>
            {/* ✅ 설문 유도 문구 (설문 안 했을 때만) */}
            {!surveyDone && (
              <p className="survey-hint-exp">
                설문조사를 해야 루틴을 추천받을 수 있습니다.
                <button
                  className="survey-link-exp"
                  onClick={() => navigate('/survey',{ state: { from: '/exercise' } })}
                  type="button"
                >
                  설문조사 하러가기
                </button>
              </p>
            )}
          </div>
        </div>
      )}

    </div>
    
  );
};

export default ExerciseExplore;
