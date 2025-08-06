// src/components/statistics/StatsCard.jsx
import React from 'react';

const StatsCard = ({ data }) => {
  const successRate = data.total > 0 ? ((data.success / data.total) * 100).toFixed(1) : 0;
  return (
    <div className="stats-card">
      <h4>{data.exercise}</h4>
      <p>성공률: {successRate}%</p>
      <p>총 횟수: {data.total}</p>
      <p>성공 횟수: {data.success}</p>
      <p>틀린 횟수: {data.fail}</p>
    </div>
  );
};

export default StatsCard;
