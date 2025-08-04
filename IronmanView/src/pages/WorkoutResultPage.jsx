import React, { useState } from 'react';
import '../styles/WorkoutResultPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleFeedbackSubmit = async () => {
    if (!selectedFeedback) {
      setErrorMsg('※ 선택 후 완료해주세요.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:329/web/feedback',
        {
          feedback: selectedFeedback,
          calories: caloriesBurned,
          mistakes: mistakeCount,
        },
        { withCredentials: true }
      );

      // ✅ 약간의 delay 이후 navigate (렌더 타이밍 보장)
      setIsModalOpen(false);
      setTimeout(() => {
        navigate('/main');
      }, 100); // 약간의 지연 후 이동

    } catch (err) {
      console.error('피드백 전송 실패', err);
    }
  };

  return (
    <PageWrapper>
      <div className="workout-result-container">
        <div className="result-card">
          <h2>오늘의 운동 결과</h2>

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

          <div className="info-box calories">
            <span>소모 칼로리</span>
            <span>{caloriesBurned}kcal</span>
          </div>
          <div className="info-box mistakes">
            <span>틀린 횟수</span>
            <span>{mistakeCount}회</span>
          </div>

          <button className="action-button" onClick={() => navigate('/posture-feedback')}>
            자세 확인하기
          </button>
          <button className="action-button" onClick={() => setIsModalOpen(true)}>
            홈으로 돌아가기
          </button>
        </div>

        {isModalOpen && (
          <div className="feedback-modal-overlay">
            <div className="feedback-modal">
              <div className="modal-header">
                <span className="modal-title" style={{ color: '#111' }}>
                  이번 루틴은 어땠나요?
                </span>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              </div>

              <div className="modal-options">
                {['쉬웠다', '적당', '힘듦'].map((option) => (
                  <div
                    key={option}
                    className={`modal-option ${selectedFeedback === option ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedFeedback(option);
                      setErrorMsg('');
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="modal-error">
                  {errorMsg}
                </div>
              )}

              <button className="modal-submit" onClick={handleFeedbackSubmit} >
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default WorkoutResultPage;
