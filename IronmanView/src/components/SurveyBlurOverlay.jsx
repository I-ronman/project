import React from 'react';
import '../styles/SurveyBlurOverlay.css';

const SurveyBlurOverlay = () => {
  return (
    <>
      {/* 블러 레이어 + 안내문구(형제 요소로 렌더) */}
      <div className="survey-blur-overlay" />
      <div className="survey-blur-overlay-message">
        설문조사가 필요한 기능입니다.
      </div>
    </>
  );
};

export default SurveyBlurOverlay;
