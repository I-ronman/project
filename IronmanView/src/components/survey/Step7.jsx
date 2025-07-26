import React from 'react';
import '../../styles/SurveyPage.css';

const Step7 = ({ squatLevel, setSquatLevel, nextStep }) => {
  const options = [
    { label: '훌륭한 (49개 이상)', value: 'very_good' },
    { label: '좋은 (44개~49개)', value: 'good' },
    { label: '평균 이상 (39개~43개)', value: 'over_common' },
    { label: '평균 (35개~38개)', value: 'common' },
    { label: '평균 이하 (31개~34개)', value: 'under_common' },
    { label: '나쁨 (25개~30개)', value: 'bad' },
    { label: '매우 나쁨 (25개 이하)', value: 'very_bad' },
  ];

  const handleClick = (value) => {
    setSquatLevel(value);
    nextStep();
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">
        한번에 스쿼트<br />
        몇 번까지 가능하세요?<br />

      </h3>
      <div className="activity-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${squatLevel === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step7;
