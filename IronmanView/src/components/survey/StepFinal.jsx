import React from 'react';
import { useNavigate } from 'react-router-dom';

const StepFinal = ({ surveyData }) => {
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      const response = await fetch('http://localhost:329/web/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 유지 시 필요
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        localStorage.setItem('surveyCompleted', 'true');
        navigate('/routine');
      } else {
        alert('설문 전송 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  return (
    <div className="survey-step" style={{ textAlign: 'center' }}>
      <img
        src="/images/coach.png"
        alt="코치 이미지"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '24px'
        }}
      />
      <h3 className="survey-title" style={{ marginBottom: '20px' }}>
        설문이 종료되었습니다.<br />
        AI로 루틴을 추천받으세요!
      </h3>
      <button className="option-button selected" onClick={handleFinish}>
        완료
      </button>
    </div>
  );
};

export default StepFinal;
