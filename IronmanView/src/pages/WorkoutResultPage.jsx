// WorkoutResultPage.jsx

import React, { useState } from 'react';
import '../styles/WorkoutResultPage.css';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import PageWrapper from '../layouts/PageWrapper';

const WorkoutResultPage = () => {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

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
    // TODO: POST 요청 연동
  };

  return (
    <PageWrapper>
      <div className="workout-result-container">
        <div className="result-card">
          {/* 피드백 (모바일) */}
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

          {/* 레이더 차트 */}
          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="운동능력"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 운동 정보 */}
          <div className="info-box calories">
            <span>소모 칼로리</span>
            <span>{caloriesBurned}kcal</span>
          </div>
          <div className="info-box mistakes">
            <span>틀린 횟수</span>
            <span>{mistakeCount}회</span>
          </div>

          {/* 버튼들 */}
          <button className="action-button" onClick={() => navigate('/posture-feedback')}>
            자세 확인하기
          </button>
          <button className="action-button" onClick={() => navigate('/main')}>
            홈으로 돌아가기
          </button>
          
        </div>

        {/* 웹용 피드백 */}
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
