// project/IronmanView/src/components/ranking/FilterModal.jsx
import React, { useState } from 'react';
import '../../styles/FilterModal.css';

const rankingCategories = ['운동시간', '운동정확도', '소모 칼로리', '운동 빈도'];
const exerciseTypes = ['스쿼트', '플랭크', '런지', '푸쉬업', '버피', '점프잭'];

const FilterModal = ({ initialFilters, onClose, onApply }) => {
  const [category, setCategory] = useState(initialFilters.category || '');
  const [types, setTypes] = useState(initialFilters.types || []);
  const [search, setSearch] = useState('');

  const toggleType = (type) => {
    setTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleApply = () => {
    onApply({ category, types });
  };

  const filteredTypes = exerciseTypes.filter(type => type.includes(search));

  return (
    <div className="filter-modal-backdrop">
      <div className="filter-modal">
        <h2>필터 설정</h2>

        <div className="filter-section">
          <h3>랭킹 기준</h3>
          <div className="filter-options">
            {rankingCategories.map(cat => (
              <button
                key={cat}
                className={`option-button ${cat === category ? 'selected' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>운동 종류</h3>
          <input
            type="text"
            placeholder="운동 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-options scrollable">
            {filteredTypes.map(type => (
              <button
                key={type}
                className={`option-button ${types.includes(type) ? 'selected' : ''}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-buttons">
          <button onClick={handleApply} className="apply-btn">필터 적용</button>
          <button onClick={onClose} className="close-btn">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
