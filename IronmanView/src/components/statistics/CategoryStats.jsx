// src/components/statistics/CategoryStats.jsx
import React from 'react';

const CategoryStats = ({ categoryTotals, onCategoryClick }) => {
  const categories = Object.keys(categoryTotals);

  return (
    <div className="category-stats">
      {categories.map(cat => (
        <div key={cat} className="category-card" onClick={() => onCategoryClick(cat)}>
          <h4>{cat}</h4>
          <p>{categoryTotals[cat].toFixed(1)} 시간</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
