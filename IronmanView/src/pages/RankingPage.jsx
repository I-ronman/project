import React, { useState } from 'react';
import FilterModal from '../components/ranking/FilterModal';
import FilterTag from '../components/ranking/FilterTag';
import RankingList from '../components/ranking/RankingList';
import '../styles/RankingPage.css';

const RankingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '운동시간',  // '운동시간' | '운동정확도' 등
    types: []             // ['플랭크', '스쿼트'] 등
  });

  const handleFilterApply = (newFilters) => {
    setSelectedFilters(newFilters);
    setShowModal(false);
  };

  const handleRemoveFilter = (key, value) => {
    if (key === 'category') {
      setSelectedFilters(prev => ({ ...prev, category: null }));
    } else if (key === 'types') {
      setSelectedFilters(prev => ({
        ...prev,
        types: prev.types.filter(t => t !== value)
      }));
    }
  };

  return (
    <div className="ranking-page">
      <header className="ranking-header">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>운동 랭킹</h1>
        <button className="filter-button" onClick={() => setShowModal(true)}>필터 ⚙️</button>
      </header>

      <div className="filter-tags">
        {selectedFilters.category && (
          <FilterTag
            label={selectedFilters.category}
            onRemove={() => handleRemoveFilter('category', selectedFilters.category)}
          />
        )}
        {selectedFilters.types.map(type => (
          <FilterTag
            key={type}
            label={type}
            onRemove={() => handleRemoveFilter('types', type)}
          />
        ))}
      </div>

      <RankingList filters={selectedFilters} />

      {showModal && (
        <FilterModal
          initialFilters={selectedFilters}
          onClose={() => setShowModal(false)}
          onApply={handleFilterApply}
        />
      )}
    </div>
  );
};

export default RankingPage;
