import React from 'react';
import { useNavigate } from 'react-router-dom';

const StepFinal = ({
  height,
  weight,
  goalWeight,
  activity,
  pushupLevel,
  plankTime,
  squatLevel,
  flexibility,
  workoutFrequency,
}) => {
  const navigate = useNavigate();

  const handleFinish = async () => {
    const surveyData = {
      height,
      weight,
      goalWeight,
      activity,
      pushupLevel,
      plankTime,
      squatLevel,
      flexibility,
      workoutFrequency,
    };

    try {
      const response = await fetch('http://localhost:8080/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {

        localStorage.setItem('surveyCompleted', 'true');
        navigate('/routine')
        // navigate('/recommend'); 성공 시 추천 페이지로 이동
      } else {
        alert('설문 전송 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('서버와 연결할 수 없습니다.');
    } finally{
      navigate('/chatbot');
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
