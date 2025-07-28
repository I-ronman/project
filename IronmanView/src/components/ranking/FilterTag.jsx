import React from 'react';
import '../../styles/FilterTag.css';

const FilterTag = ({ label, onRemove }) => {
  return (
    <div className="filter-tag">
      {label}
      <button className="remove-btn" onClick={onRemove}>✕</button>
    </div>
  );
};

export default FilterTag;
