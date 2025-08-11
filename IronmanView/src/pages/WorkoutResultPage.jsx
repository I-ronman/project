// src/pages/WorkoutResultPage.jsx
import React, { useMemo, useState } from 'react';
import '../styles/WorkoutResultPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
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

const DEFAULT_RADAR = [
  { subject: '상체 근력', value: 60 },
  { subject: '하체 근력', value: 75 },
  { subject: '유연성',   value: 40 },
  { subject: '체력 종합', value: 50 },
  { subject: '체력균형', value: 30 },
  { subject: '근지구력', value: 90 },
];

function formatDuration(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const mm = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function WorkoutResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // PostureAnalysisPage → navigate state
  const {
    radarData: incomingRadar,
    caloriesBurned: incomingCalories,
    mistakeCount: incomingMistakes,
    session: sessionSummary,
  } = location.state ?? {};

  const radarData = useMemo(() => incomingRadar ?? DEFAULT_RADAR, [incomingRadar]);
  const caloriesBurned = useMemo(() => incomingCalories ?? 321, [incomingCalories]);
  const mistakeCount = useMemo(() => incomingMistakes ?? 9, [incomingMistakes]);

  // 추가 표기값
  const totalReps   = sessionSummary?.totalReps   ?? 0;
  const goodCount   = sessionSummary?.goodCount   ?? 0;
  const badCount    = sessionSummary?.badCount    ?? mistakeCount ?? 0;
  const totalCount  = goodCount + badCount;
  const totalSec    = sessionSummary?.totalSeconds ?? 0;

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sendToChatbot = async (feedback, session) => {
    const resp = await fetch('http://localhost:456/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `사용자 운동 피드백: ${feedback}`,
        meta: { feedback, session },
      }),
    });
    const data = await resp.json().catch(() => ({}));

    if (data?.adaptedRoutine) return data.adaptedRoutine;

    try {
      const maybeJson = data?.result?.[1];
      if (maybeJson && typeof maybeJson === 'string') {
        const parsed = JSON.parse(maybeJson);
        if (parsed?.adaptedRoutine) return parsed.adaptedRoutine;
        return parsed;
      }
    } catch (_) {}

    return null;
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedFeedback) {
      setErrorMsg('※ 선택 후 완료해주세요.');
      return;
    }
    setSubmitting(true);

    try {
      // 1) 챗봇으로 피드백+세션 전달 → 적응 루틴 수신
      const adaptedRoutine = await sendToChatbot(selectedFeedback, sessionSummary);

      // 2) Spring Boot로 최종 저장/반영
      await axios.post(
        'http://localhost:329/web/feedback',
        {
          feedback: selectedFeedback,
          calories: caloriesBurned,
          mistakes: badCount,
          adaptedRoutine,
          session: sessionSummary ?? {},
        },
        { withCredentials: true }
      );

      setIsModalOpen(false);
      setTimeout(() => navigate('/main'), 80);
    } catch (err) {
      console.error('피드백 전송 실패', err);
      setErrorMsg('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // 모달 외부 클릭 → 홈 이동 (피드백 스킵 허용)
  const handleOverlayClick = (e) => {
    if (e.target?.classList?.contains('feedback-modal-overlay')) {
      setIsModalOpen(false);
      navigate('/main');
    }
  };

  return (
    <PageWrapper>
      <div className="workout-result-container">
        <div className="result-card">
          <div className="result-header">
            <h2>오늘의 운동 결과</h2>
            {sessionSummary?.routineMeta?.routineName && (
              <p className="result-subtitle">{sessionSummary.routineMeta.routineName}</p>
            )}
          </div>

          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={260}>
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

          {/* 추가 지표 표기 (그리드로 통일감) */}
          <div className="info-grid">
            <div className="info-box calories">
              <span>소모 칼로리</span>
              <span>{caloriesBurned}kcal</span>
            </div>
            <div className="info-box">
              <span>총 횟수</span>
              <span>{totalCount}회</span>
            </div>
            <div className="info-box">
              <span>성공 횟수</span>
              <span>{goodCount}회</span>
            </div>
            <div className="info-box mistakes">
              <span>틀린 횟수</span>
              <span>{badCount}회</span>
            </div>
            <div className="info-box">
              <span>걸린 시간</span>
              <span>{formatDuration(totalSec)}</span>
            </div>
          </div>

          <div className="actions-row">
            <button className="action-button ghost" onClick={() => navigate('/posture-feedback')}>
              자세 확인하기
            </button>
            <button className="action-button ghost" onClick={() => setIsModalOpen(true)}>
              홈으로 돌아가기
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="feedback-modal-overlay" onClick={handleOverlayClick}>
            <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title" style={{ color: '#111' }}>
                  이번 루틴은 어땠나요?
                </span>
                {/* X 버튼은 검은색으로 고정 */}
                <button
                  className="modal-close"
                  style={{ color: '#000' }}
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/main');
                  }}
                >
                  ×
                </button>
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

              <button
                className="modal-submit"
                onClick={handleFeedbackSubmit}
                disabled={submitting}
              >
                {submitting ? '전송 중...' : '완료'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
