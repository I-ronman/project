// project/IronmanView/src/components/MainContent.jsx
import React from 'react';

const MainContent = () => {
  return (
    <div className="main-content">
      {/* 여기에 메인 콘텐츠들 나열 */}
      <div className="routine-start">오늘 루틴 시작</div>
      <div className="routine-setting">루틴 짜기 / 추천받기</div>
      <div className="ranking-panel">랭킹 영역</div>
      <div className="weekly-goal">주간 목표 5/7</div>
      <div className="exercise-program">운동 프로그램들</div>
      <div className="exercise-record">운동 기록 카드</div>
    </div>
  );
};

export default MainContent;
