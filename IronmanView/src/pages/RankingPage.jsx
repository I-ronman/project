// project/IronmanView/src/pages/RankingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import '../styles/RankingPage.css';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RankingPage = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ category: '', types: [] });
  const [modalSearch, setModalSearch] = useState('');
  const [allData, setAllData] = useState([
    // — 더미 데이터 유지 —
    { id: 1, name: '김철수', score: 98 },
    { id: 2, name: '이영희', score: 92 },
    { id: 3, name: '박민준', score: 89 },
    { id: 4, name: '최수정', score: 85 },
    { id: 5, name: '정하늘', score: 82 },
    { id: 6, name: '오지훈', score: 78 },
    { id: 7, name: '한유진', score: 75 },
    { id: 8, name: '송도윤', score: 72 },
    { id: 9, name: '장서연', score: 70 },
    { id: 10, name: '백승현', score: 68 },
    { id: 11, name: '강지원', score: 65 },
    { id: 12, name: '윤태희', score: 63 },
    { id: 13, name: '문서우', score: 60 },
    { id: 14, name: '신주원', score: 58 },
    { id: 15, name: '구민재', score: 55 },
  ]);

  // 나의 순위(더미). 나중에 API 응답으로 대체하세요.
  const userRank = 23;
  const userName = user?.name || '나';

  const exerciseList = [
    '플랭크',
    '스쿼트',
    '팔굽혀펴기',
    '런지',
    '버피',
    '윗몸일으키기',
    '사이드 플랭크',
  ];
  const visibleExercises = exerciseList.filter((e) =>
    e.includes(modalSearch)
  );
  const top10 = allData.slice(0, 10);

  const toggleType = (type) => {
    setFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
  };

  // — 백엔드 연동용 밑작업(useEffect) —
  useEffect(() => {
    // 실제 API가 준비되면 URL과 params만 바꿔주세요.
    axios
      .get('/api/ranking', {
        params: {
          category: filters.category,
          types: filters.types,
        },
      })
      .then((res) => {
        // API가 { data: [...] } 형태로 랭킹 리스트를 내려준다고 가정
        if (Array.isArray(res.data)) {
          setAllData(res.data);
        }
      })
      .catch((err) => {
        console.warn('랭킹 데이터 로드 실패, 더미 유지', err);
      });
  }, [filters]);

  return (
    <PageWrapper>
      <div className="ranking-page">
        <div className="ranking-header">
          <h2>운동 랭킹</h2>
          <button
            className="filter-open-btn"
            onClick={() => setShowModal(true)}
          >
            필터 ⚙️
          </button>
        </div>

        <div className="filter-tags">
          {filters.category && (
            <span className="filter-tag">
              {filters.category}
              <span
                className="tag-close"
                onClick={() =>
                  setFilters((f) => ({ ...f, category: '' }))
                }
              >
                ×
              </span>
            </span>
          )}
          {filters.types.map((t) => (
            <span key={t} className="filter-tag">
              {t}
              <span
                className="tag-close"
                onClick={() => toggleType(t)}
              >
                ×
              </span>
            </span>
          ))}
        </div>

        <div className="ranking-card">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>이름</th>
                <th>종합 운동 점수</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
              {userRank > 10 && (
                <>
                  <tr className="ellipsis-row">
                    <td colSpan={3}>
                      <div className="ellipsis-vertical">
                        .<br />
                        .<br />
                        .
                      </div>
                    </td>
                  </tr>
                  <tr className="user-row">
                    <td>{userRank}</td>
                    <td>{userName}</td>
                    <td>-</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h3>필터 설정</h3>

              <div className="modal-section">
                <label>카테고리</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">전체</option>
                  <option value="운동시간">운동시간</option>
                  <option value="정확도">정확도</option>
                  <option value="운동량">운동량</option>
                  <option value="칼로리">칼로리</option>
                </select>
              </div>

              <div className="modal-section">
                <label>운동 검색</label>
                <input
                  className="modal-search"
                  placeholder="운동 검색..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>

              <div className="modal-section">
                <label>종류 선택</label>
                <div className="checkbox-list">
                  {visibleExercises.map((type) => (
                    <label
                      key={type}
                      className="checkbox-group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      {type}
                    </label>
                  ))}
                  {visibleExercises.length === 0 && (
                    <p className="no-results">
                      검색된 운동이 없습니다.
                    </p>
                  )}
                </div>
              </div>

              <button
                className="apply-btn"
                onClick={() => setShowModal(false)}
              >
                적용하기
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default RankingPage;
