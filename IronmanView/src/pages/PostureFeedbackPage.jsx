import React, { useEffect, useState } from 'react';
import '../styles/PostureFeedbackPage.css';

// 더미 피드백 + 날짜 메타
const dummyFeedback = {
  1: {
    date: '2025-08-10',
    postures: [
      { id: 1, type: '좋은자세', image: '/images/dummy.jpg', description: '등이 곧고 어깨가 펴진 좋은 자세입니다.' },
      { id: 2, type: '좋은자세', image: '/images/dummy.jpg', description: '무릎과 발끝이 일직선인 좋은 자세입니다.' },
      { id: 3, type: '나쁜자세', image: '/images/dummy.jpg', description: '허리가 과하게 구부러진 나쁜 자세입니다.' },
      { id: 4, type: '나쁜자세', image: '/images/dummy.jpg', description: '어깨가 앞으로 말린 나쁜 자세입니다.' },
    ]
  },
  2: {
    date: '2025-08-11',
    postures: [
      { id: 5, type: '좋은자세', image: '/images/dummy2.jpg', description: '스쿼트 자세가 안정적입니다.' },
      { id: 6, type: '나쁜자세', image: '/images/dummy2.jpg', description: '허리가 너무 젖혀졌습니다.' },
    ]
  },
  // 필요 시 더 추가...
};

const PostureFeedbackPage = ({ recordId }) => {
  const [selectedType, setSelectedType] = useState('좋은자세');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postures, setPostures] = useState([]);
  const [recordDate, setRecordDate] = useState('');

  useEffect(() => {
    // 실제 API 연동 자리 (추후 교체)
    /*
    async function fetchFeedback() {
      const res = await fetch(`http://localhost:329/web/api/records/${recordId}/feedback`, { credentials: 'include' });
      const data = await res.json();
      setPostures(data.postures);
      setRecordDate(data.date);
      setCurrentIndex(0);
    }
    fetchFeedback().catch(() => {
      // 실패 시 더미 사용
      const d = dummyFeedback[recordId] || { date: '', postures: [] };
      setPostures(d.postures);
      setRecordDate(d.date);
      setCurrentIndex(0);
    });
    */

    // 당장 동작하는 더미 로직
    const d = dummyFeedback[recordId] || { date: '', postures: [] };
    setPostures(d.postures);
    setRecordDate(d.date);
    setCurrentIndex(0);
  }, [recordId]);

  const filteredPostures = postures.filter(p => p.type === selectedType);
  const currentPosture = filteredPostures[currentIndex] || {};

  const changePosture = dir => {
    if (filteredPostures.length <= 1) return;
    const next = (currentIndex + dir + filteredPostures.length) % filteredPostures.length;
    setCurrentIndex(next);
  };

  return (
    <div className="posture-feedback-page">
      <div className="modal-header">
        <h2>자세 확인하기</h2>
      </div>

      {recordDate && (
        <div className="feedback-date">날짜: {recordDate}</div>
      )}

      <div className="tab-select">
        {['좋은자세','나쁜자세'].map(type => (
          <button
            key={type}
            className={selectedType === type ? 'active' : ''}
            onClick={() => {
              setSelectedType(type);
              setCurrentIndex(0);
            }}
          >
            {type === '좋은자세' ? '좋은 자세' : '나쁜 자세'}
          </button>
        ))}
      </div>

      <div className="card-wrapper">
        <div className="posture-card">
          <div className="badge">AI 분석 결과 반영</div>
          <div className="posture-content">
            <button
              className="arrow-btn left"
              onClick={() => changePosture(-1)}
              disabled={filteredPostures.length <= 1}
            >
              ‹
            </button>
            <img
              className="posture-image"
              src={currentPosture.image}
              alt={currentPosture.type}
            />
            <button
              className="arrow-btn right"
              onClick={() => changePosture(1)}
              disabled={filteredPostures.length <= 1}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="posture-description">
        {currentPosture.description || '해당 자세에 대한 설명이 없습니다.'}
      </div>
    </div>
  );
};

export default PostureFeedbackPage;
