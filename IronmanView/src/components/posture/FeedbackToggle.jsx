// project/IronmanView/src/components/posture/FeedbackToggle.jsx
import React from 'react';

// 피드백 음성 ON/OFF 토글 버튼 컴포넌트
const FeedbackToggle = ({ isOn, onToggle }) => {
  return (
    <div className="feedback-toggle">
      <span>피드백 음성</span>
      <button className="feedback-button" onClick={onToggle}>
        {isOn ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default FeedbackToggle;
    