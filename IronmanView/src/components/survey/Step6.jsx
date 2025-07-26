import React from 'react';
import '../../styles/SurveyPage.css';

const Step6 = ({ plankTime, setPlankTime, nextStep }) => {
  const options = [
    { label: '훌륭한 (6분 이상)', value: 'very_good' },
    { label: '좋은 (4분~6분)', value: 'good' },
    { label: '평균 이상 (3분~4분)', value: 'over_common' },
    { label: '평균 (1분~3분)', value: 'common' },
    { label: '평균 이하 (30초~60초)', value: 'under_common' },
    { label: '나쁨 (15초~30초)', value: 'bad' },
    { label: '매우 나쁨 (15초 이하)', value: 'very_bad' },
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
