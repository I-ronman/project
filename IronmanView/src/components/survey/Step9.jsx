import React from 'react';
import '../../styles/SurveyPage.css';

const Step9 = ({ workoutFrequency, setWorkoutFrequency, nextStep }) => {
  const options = [
    { label: '주1회', value: 'week1' },
    { label: '주2회', value: 'week2' },
    { label: '주3회', value: 'week3' },
    { label: '주4회', value: 'week4' },
    { label: '주5회', value: 'week5' },
    { label: '주6회', value: 'week6' },
    { label: '주7회', value: 'week7' },
  ];

  const handleClick = (value) => {
    setWorkoutFrequency(value);
    nextStep(); // 혹은 제출 로직
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">얼마나 자주<br />운동할 생각인가요?</h3>
      <div className="activity-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${workoutFrequency === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step9;
