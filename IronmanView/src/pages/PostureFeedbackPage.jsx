import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostureFeedbackPage.css';

const dummyPostures = [
  { id: 1, type: '좋은자세', image: '/images/good1.jpg', description: '등이 곧고 어깨가 펴진 좋은 자세입니다.' },
  { id: 2, type: '좋은자세', image: '/images/good2.jpg', description: '무릎과 발끝이 일직선인 좋은 자세입니다.' },
  { id: 3, type: '나쁜자세', image: '/images/bad1.jpg', description: '허리가 과하게 구부러진 나쁜 자세입니다.' },
  { id: 4, type: '나쁜자세', image: '/images/bad2.jpg', description: '어깨가 앞으로 말린 나쁜 자세입니다.' },
];

const PostureFeedbackPage = () => {
  const [selectedType, setSelectedType] = useState('좋은자세');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postures, setPostures] = useState(dummyPostures);
  const navigate = useNavigate();

  const filteredPostures = postures.filter(p => p.type === selectedType);
  const currentPosture = filteredPostures[currentIndex];

  useEffect(() => {
    // 백엔드 연동 예시
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
        <button className="back-button" onClick={() => navigate(-1)}>← 뒤로가기</button>
        <h2 className="page-title">자세 확인 페이지</h2>
      </div>

      <div className="tab-select">
        <button onClick={() => setSelectedType('좋은자세')} className={selectedType === '좋은자세' ? 'active' : ''}>좋은 자세</button>
        <button onClick={() => setSelectedType('나쁜자세')} className={selectedType === '나쁜자세' ? 'active' : ''}>나쁜 자세</button>
      </div>

      <div className="card-wrapper">
        <div className="posture-card dark-card">
          <div className="badge">AI 분석 결과 반영</div>
          <img src={currentPosture?.image} alt="posture" />
          <button className="arrow-btn left" onClick={() => changePosture(-1)}>{'<'}</button>
          <button className="arrow-btn right" onClick={() => changePosture(1)}>{'>'}</button>
        </div>
      </div>

      <div className="posture-description dark-card scrollable">
        {currentPosture?.description}
      </div>
    </div>
  );
};

export default PostureFeedbackPage;
