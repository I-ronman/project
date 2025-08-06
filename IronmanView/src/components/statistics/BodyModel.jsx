// src/components/statistics/BodyModel.jsx
import React from 'react';

const BodyModel = ({ onSelectCategory }) => {
  return (
    <svg width="150" height="300" viewBox="0 0 100 200">
      <rect x="40" y="10" width="20" height="30" fill="#ccc" onClick={() => onSelectCategory('상체')} />
      <rect x="40" y="40" width="20" height="40" fill="#aaa" onClick={() => onSelectCategory('코어')} />
      <rect x="30" y="80" width="15" height="50" fill="#888" onClick={() => onSelectCategory('하체')} />
      <rect x="55" y="80" width="15" height="50" fill="#888" onClick={() => onSelectCategory('하체')} />
    </svg>
  );
};

export default BodyModel;
