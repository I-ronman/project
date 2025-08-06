import React, { useState } from 'react';
import '../styles/ExerciseExplore.css';

const dummyExercises = [
  { exerciseId: 1, name: '벤치 프레스', part: '상체', image: '/images/exerciseImg/bench_press.png' },
  { exerciseId: 2, name: '덤벨 벤치 프레스', part: '상체', image: '/images/exerciseImg/dumbbell_bench_press.png' },
  { exerciseId: 3, name: '덤벨 풀오버', part: '상체', image: '/images/exerciseImg/dumbbell_pullover.png' },
  { exerciseId: 4, name: '펙덱 플라이', part: '상체', image: '/images/exerciseImg/pec_deck_fly.png' },
  { exerciseId: 5, name: '스쿼트', part: '하체', image: '/images/exerciseImg/squat.png' },
  { exerciseId: 6, name: '런지', part: '하체', image: '/images/exerciseImg/lunge.png' },
  { exerciseId: 7, name: '윗몸 일으키기', part: '코어', image: '/images/exerciseImg/situp.png' },
  { exerciseId: 8, name: '버드독', part: '코어', image: '/images/exerciseImg/bird_dog.png' },
  { exerciseId: 9, name: '사이드 레그 레이즈', part: '코어', image: '/images/exerciseImg/side_leg_raise.png' },
];

const bodyParts = ['전체', '상체', '하체', '코어', '유산소', '전신'];

const ExerciseExplore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState('전체');

  const handleCardClick = (name) => {
    setSearchTerm(name);
  };

  const filteredExercises = dummyExercises.filter((exercise) => {
    const matchesSearch = exercise.name.includes(searchTerm);
    const matchesPart = selectedPart === '전체' || exercise.part === selectedPart;
    return matchesSearch && matchesPart;
  });

  return (
    <div className="explore-container">
      {/* 왼쪽 */}
      <div className="left-panel-exp">
        {/* 필터 버튼 */}
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

        {/* 검색창 */}
        <input
          type="text"
          className="exercise-search-input-exp"
          placeholder="운동 이름을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 운동 리스트 */}
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.exerciseId}
            className="exercise-card-exp"
            onClick={() => handleCardClick(exercise.name)}
          >
            <img src={exercise.image} alt={exercise.name} />
            <div className="card-info-exp">
              <h4>{exercise.name}</h4>
              <p>{exercise.part}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 */}
      <div className="right-panel-exp">
        <p>오른쪽 20vh 고정 영역입니다.</p>
      </div>
    </div>
  );
};

export default ExerciseExplore;
