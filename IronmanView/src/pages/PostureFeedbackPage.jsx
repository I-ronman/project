import React, { useEffect, useState } from 'react';
import '../styles/PostureFeedbackPage.css';

const dummyPostures = [
  {
    id: 1,
    type: '좋은자세',
    image: '/images/dummy.jpg',
    description: '등이 곧고 어깨가 펴진 좋은 자세입니다.',
  },
  {
    id: 2,
    type: '좋은자세',
    image: '/images/dummy.jpg',
    description: '무릎과 발끝이 일직선인 좋은 자세입니다.',
  },
  {
    id: 3,
    type: '나쁜자세',
    image: '/images/dummy.jpg',
    description: '허리가 과하게 구부러진 나쁜 자세입니다.',
  },
  {
    id: 4,
    type: '나쁜자세',
    image: '/images/dummy.jpg',
    description: '어깨가 앞으로 말린 나쁜 자세입니다.',
  },
];

const PostureFeedbackPage = () => {
  const [selectedType, setSelectedType] = useState('좋은자세');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postures, setPostures] = useState(dummyPostures);

  const filteredPostures = postures.filter((p) => p.type === selectedType);
  const currentPosture = filteredPostures[currentIndex];

  useEffect(() => {
    // 추후 백엔드 연동용 구조
    /*
    const fetchPostures = async () => {
      const res = await fetch(`http://localhost:8080/api/postures?type=${selectedType}`);
      const data = await res.json();
      setPostures(data);
      setCurrentIndex(0);
    };
    fetchPostures();
    */
  }, [selectedType]);

  const changePosture = (direction) => {
    const newIndex = (currentIndex + direction + filteredPostures.length) % filteredPostures.length;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="main-container dark-background posture-page">
      <div className="top-bar">
        <h2 className="page-title">자세 확인하기</h2>
      </div>

      <div className="tab-select">
        <button
          onClick={() => setSelectedType('좋은자세')}
          className={selectedType === '좋은자세' ? 'active' : ''}
        >
          좋은 자세
        </button>
        <button
          onClick={() => setSelectedType('나쁜자세')}
          className={selectedType === '나쁜자세' ? 'active' : ''}
        >
          나쁜 자세
        </button>
      </div>

      <div className="card-wrapper">
        <div className="posture-card dark-card">
          <div className="badge">AI 분석 결과 반영</div>
          <div className="posture-content">
            <button className="arrow-btn left" onClick={() => changePosture(-1)}>
              {'<'}
            </button>
            <img className="posture-image" src={currentPosture?.image} alt="posture" />
            <button className="arrow-btn right" onClick={() => changePosture(1)}>
              {'>'}
            </button>
          </div>
        </div>
      </div>

      <div className="posture-description dark-card scrollable">
        {currentPosture?.description || '해당 자세에 대한 설명이 없습니다.'}
      </div>
    </div>
  );
};

export default PostureFeedbackPage;
