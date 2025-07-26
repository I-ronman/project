import React from 'react';
import '../../styles/SurveyPage.css';

const Step8 = ({ flexibility, setFlexibility, nextStep }) => {
  const options = [
    { label: '발끝에 안닿음', value: 'bad' },
    { label: '발끝에 닿음', value: 'common' },
    { label: '발끝을 조금 넘어감', value: 'good' },
    { label: '발끝을 많이 넘어감', value: 'very_good' },
  ];

  const handleClick = (value) => {
    setFlexibility(value);
    nextStep();
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">
        앉은 자세에서 얼마나 멀리<br />앞으로 구부릴 수 있나요?
      </h3>
      <div className="activity-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${flexibility === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step8;
