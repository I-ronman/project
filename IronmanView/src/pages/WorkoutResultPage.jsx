// src/pages/WorkoutResultPage.jsx

import React, { useState } from 'react';
import '../styles/WorkoutResultPage.css';
import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import PageWrapper from '../layouts/PageWrapper';

const WorkoutResultPage = () => {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // 예시 데이터 (향후 백엔드 데이터로 대체)
  const radarData = [
    { subject: '상체 근력', value: 60 },
    { subject: '하체 근력', value: 75 },
    { subject: '유연성', value: 40 },
    { subject: '체력 종합', value: 50 },
    { subject: '체력균형', value: 30 },
    { subject: '근지구력', value: 90 },
  ];

  const caloriesBurned = 321;
  const mistakeCount = 9;

  const handleFeedbackClick = (feedback) => {
    setSelectedFeedback(feedback);
    
    // TODO: 백엔드 연동을 위해 POST 요청할 코드 예시
    // fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ feedback }),
    // });
  };

  return (
    <PageWrapper>
      <div className="workout-result-container">
        <div className="result-card">
          {/* 루틴 피드백 질문 - 모바일에서는 상단 */}
          <div className="routine-feedback-mobile">
            <p className="routine-title">이번 루틴은 어땠나요?</p>
            <div className="routine-options">
              {['쉬웠다', '적당', '힘듦'].map(option => (
                <span
                  key={option}
                  className={`feedback-option ${selectedFeedback === option ? 'selected' : ''}`}
                  onClick={() => handleFeedbackClick(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          <h2>오늘의 운동 결과</h2>

          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="운동능력" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="info-box calories">
            소모 칼로리 <span>{caloriesBurned}kcal</span>
          </div>
          <div className="info-box mistakes">
            틀린 횟수 <span>{mistakeCount}회</span>
          </div>

          <button className="back-button" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </button>
        </div>

        {/* 웹일 때 오른쪽에 표시 */}
        <div className="routine-feedback-web">
          <p className="routine-title">이번 루틴은<br />어땠나요?</p>
          <div className="routine-options">
            {['쉬웠다', '적당', '힘듦'].map(option => (
              <span
                key={option}
                className={`feedback-option ${selectedFeedback === option ? 'selected' : ''}`}
                onClick={() => handleFeedbackClick(option)}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default WorkoutResultPage;
