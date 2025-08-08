import React from 'react';
import '../../styles/SurveyPage.css';

const Step5 = ({ pushupLevel, setPushupLevel, nextStep }) => {
  const options = [
    { label: '훌륭한 (56개 이상)', value: '팔굽혀펴기 수준 훌륭함' },
    { label: '좋은 (47개~56개)', value: '팔굽혀펴기 수준 좋음' },
    { label: '평균 이상 (35개~46개)', value: '팔굽혀펴기 수준 평균 이상임' },
    { label: '평균 (19개~34개)', value: '팔굽혀펴기 수준 평균임' },
    { label: '평균 이하 (11개~18개)', value: '팔굽혀펴기 수준 평균 이하임' },
    { label: '나쁨 (10개~4개)', value: '팔굽혀펴기 수준 나쁨' },
    { label: '매우 나쁨 (4개 이하)', value: '팔굽혀펴기 수준 매우 나쁨' },
  ];

  const handleClick = (value) => {
    setPushupLevel(value);
    nextStep();
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">한번에 팔굽혀펴기<br />몇 개까지 가능하세요?</h3>
      <div className="activity-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${pushupLevel === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step5;
