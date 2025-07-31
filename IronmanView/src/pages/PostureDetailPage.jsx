import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PostureDetailPage.css';

const dummyPostures = [
  { id: 1, type: '좋은자세', image: '/images/good1.jpg', description: '등이 곧고 어깨가 펴진 좋은 자세입니다.' },
  { id: 2, type: '좋은자세', image: '/images/good2.jpg', description: '무릎과 발끝이 일직선인 좋은 자세입니다.' },
  { id: 3, type: '나쁜자세', image: '/images/bad1.jpg', description: '허리가 과하게 구부러진 나쁜 자세입니다.' },
  { id: 4, type: '나쁜자세', image: '/images/bad2.jpg', description: '어깨가 앞으로 말린 나쁜 자세입니다.' },
];

const PostureDetailPage = () => {
  const { id, category } = useParams();
  const navigate = useNavigate();

  const posture = dummyPostures.find(p => p.id === parseInt(id) && p.type === category);

  if (!posture) return <div>해당 데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="posture-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← 돌아가기</button>
      <img src={posture.image} alt="posture-detail" className="detail-image" />
      <div className="text-box">
        <p>{posture.description}</p>
      </div>
    </div>
  );
};

export default PostureDetailPage;
