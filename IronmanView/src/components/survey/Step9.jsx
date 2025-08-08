import React from 'react';
import '../../styles/SurveyPage.css';

const Step9 = ({ workoutFrequency, setWorkoutFrequency, nextStep }) => {
  const options = [
    { label: '주1회', value: '주1회' },
    { label: '주2회', value: '주2회' },
    { label: '주3회', value: '주3회' },
    { label: '주4회', value: '주4회' },
    { label: '주5회', value: '주5회' },
    { label: '주6회', value: '주6회' },
    { label: '주7회', value: '주7회' },
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
