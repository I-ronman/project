import React from 'react';
import '../../styles/RankingList.css';

const mockData = [
  { name: '신라면', score: 98 },
  { name: '진라면', score: 95 },
  { name: '짜파게티', score: 90 },
  { name: '진라면', score: 89 },
  { name: '진라면', score: 85 },
  { name: '진라면', score: 82 },
  { name: '진라면', score: 78 },
  { name: '진라면', score: 75 },
  { name: '진라면', score: 70 },
  { name: '진라면', score: 66 }
];

const RankingList = ({ filters }) => {
  // TODO: filters.category, filters.types를 이용해 필터링된 리스트 만들기

  return (
    <div className="ranking-list">
      {mockData.map((user, idx) => (
        <div key={idx} className={`rank-item ${idx === 0 ? 'first' : ''}`}>
          <span className="rank">{idx + 1}.</span>
          <span className="username">{user.name}</span>
          <span className="score">{user.score}점</span>
        </div>
      ))}
    </div>
  );
};

export default RankingList;
