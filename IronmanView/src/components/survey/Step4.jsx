import React, { useState } from 'react';
import './Step4.css';

const Step4 = ({ activity, setActivity, nextStep }) => {
  const activityOptions = [
    {
      label: '저는 하루 종일 책상 앞에 앉아 있습니다.',
      value: '저는 하루 종일 책상 앞에 앉아 있습니다.',
    },
    {
      label: '저는 가끔 운동하거나 30분 산책을 합니다.',
      value: '저는 가끔 운동하거나 30분 산책을 합니다.',
    },
    {
      label: '저는 매일 한 시간 이상 운동을 합니다.',
      value: '저는 매일 한 시간 이상 운동을 합니다.',
    },
    {
      label: '저는 운동을 좋아하고 더 운동하고 싶습니다.',
      value: '저는 운동을 좋아하고 더 운동하고 싶습니다.',
    },
  ];

  const handleClick = (value) => {
    setActivity(value);
    nextStep();
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">활동 수준은 어떠신가요?</h3>
      <div className="activity-options">
        {activityOptions.map((opt) => (
          <button
            key={opt.value}
            className={`option-button ${activity === opt.value ? 'selected' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step4;
