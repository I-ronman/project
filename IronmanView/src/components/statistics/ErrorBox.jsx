// project/IronmanView/src/components/statistics/ErrorBox.jsx
import React from 'react';

const ErrorBox = ({ errors }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return <div className="error-box">틀린횟수<br />데이터 없음</div>;
  }

  return (
    <div className="error-box">
      <h4>틀린횟수</h4>
      {Object.entries(errors).map(([name, count], idx) => (
        <p key={idx}>{name}: {count}회</p>
      ))}
    </div>
  );
};

export default ErrorBox;
