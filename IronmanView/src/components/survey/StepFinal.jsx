import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:329/web/api/survey', surveyData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // 세션 기반 인증 시 필요
      });

      if (response.status === 200) {
        localStorage.setItem('surveyCompleted', 'true');
        navigate('/routine');
      } else {
        alert('설문 전송 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('서버와 연결할 수 없습니다.');
    } finally {
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
