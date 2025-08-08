import React from 'react';
import '../../styles/SurveyPage.css';

const Step6 = ({ plankTime, setPlankTime, nextStep }) => {
  const options = [
    { label: '훌륭한 (6분 이상)', value: '플랭크 수준 훌륭함' },
    { label: '좋은 (4분~6분)', value: '플랭크 수준 좋음' },
    { label: '평균 이상 (3분~4분)', value: '플랭크 수준 평균 이상임' },
    { label: '평균 (1분~3분)', value: '플랭크 수준 평균임' },
    { label: '평균 이하 (30초~60초)', value: '플랭크 수준 평균 이하임' },
    { label: '나쁨 (15초~30초)', value: '플랭크 수준 나쁨' },
    { label: '매우 나쁨 (15초 이하)', value: '플랭크 수준 매우 나쁨' },
  ];

  const handleClick = (value) => {
    setPlankTime(value);
    nextStep();
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">한번에 플랭크<br />몇 분까지 가능하세요?</h3>
      <div className="activity-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${plankTime === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step6;
