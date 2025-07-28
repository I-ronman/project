import React from 'react';

// 운동/실패 횟수 박스 컴포넌트
const StatBox = ({ label, count }) => {
  return (
    <div className="stat-box">
      <div className="stat-label">{label}</div>
      <div className="stat-count">{count}회</div>
    </div>
  );
};

export default StatBox;
