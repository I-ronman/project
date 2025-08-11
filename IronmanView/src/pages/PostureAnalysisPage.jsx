// src/pages/PostureAnalysisPage.jsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import '../styles/PostureAnalysis.css';
import StatBox from '../components/posture/StatBox';
import FeedbackToggle from '../components/posture/FeedbackToggle';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import TrainingCamTest from '../components/TrainingCamTest';
import PageWrapper from '../layouts/PageWrapper';
import { CountContext } from '../context/CountContext';
import { AuthContext } from '../context/AuthContext';
import { getSpeech } from "../utils/getSpeach";

/* ---------------------- utils ---------------------- */
const calcTotalTime = (routine) =>
  (routine?.exercises ?? []).reduce((acc, cur) => {
    const ex = (cur.exerciseTime ?? 0) * (cur.sets ?? 1);
    const br = (cur.breaktime ?? 0)   * (cur.sets ?? 1);
    return acc + ex + br;
  }, 0);

const buildExerciseLogs = (routine, exerciseResults, durationSeconds) =>
  (routine?.exercises ?? []).map((ex) => {
    const s = exerciseResults[ex.exerciseId] || {};
    return {
      exerciseId: ex.exerciseId,
      duration: ex.exerciseTime ?? 0,
      endTime: durationSeconds,
      goodCount: s.goodCount || 0,
      badCount:  s.badCount  || 0,
      sets: ex.sets,
      reps: ex.reps,
      breaktime: ex.breaktime,
    };
  });

/** 어떤 응답이 와도 exerciseId -> singleExerciseLogId 매핑 생성 */
const mapLogIds = (resp, reqExerciseLogs) => {
  // { logs: [{exerciseId, singleExerciseLogId}] }
  if (resp && Array.isArray(resp.logs)) {
    const m = {};
    resp.logs.forEach(it => {
      if (it && it.exerciseId != null && it.singleExerciseLogId != null) {
        m[it.exerciseId] = it.singleExerciseLogId;
      }
    });
    if (Object.keys(m).length) return m;
  }
  // [123,124,...]
  if (Array.isArray(resp)) {
    const m = {};
    (reqExerciseLogs || []).forEach((ex, idx) => {
      if (resp[idx] != null && ex?.exerciseId != null) {
        m[ex.exerciseId] = resp[idx];
      }
    });
    if (Object.keys(m).length) return m;
  }
  // { ids: [...] }
  if (resp && Array.isArray(resp.ids)) {
    const m = {};
    (reqExerciseLogs || []).forEach((ex, idx) => {
      if (resp.ids[idx] != null && ex?.exerciseId != null) {
        m[ex.exerciseId] = resp.ids[idx];
      }
    });
    if (Object.keys(m).length) return m;
  }
  return {};
};

// 더미 계산식: 세션 지표 → 결과 화면용
const estimateCalories = (good, bad, totalSeconds) => {
  // (총카운트 * 0.9kcal) + (시간(분) * 3.5kcal), 최소 50
  const total = good + bad;
  const timeMin = Math.max(1, Math.round(totalSeconds / 60));
  return Math.max(50, Math.round(total * 0.9 + timeMin * 3.5));
};
const buildRadarDummy = (good, bad) => {
  const total = Math.max(1, good + bad);
  const pct = (v) => Math.min(100, Math.round((v / total) * 100));
  return [
    { subject: '상체 근력', value: pct(good * 0.6 + bad * 0.3) },
    { subject: '하체 근력', value: pct(good * 0.4 + bad * 0.4) },
    { subject: '유연성',   value: pct(good * 0.3 + bad * 0.2) },
    { subject: '체력 종합', value: pct(good * 0.5 + bad * 0.5) },
    { subject: '체력균형', value: pct(good * 0.35 + bad * 0.25) },
    { subject: '근지구력', value: Math.min(100, good * 2 + 30) },
  ];
};

const PostureAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routine = location.state?.routine;
  getSpeech();
  const { user } = useContext(AuthContext);

  const [isFeedbackOn, setIsFeedbackOn] = useState(true);
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewKnee, setViewKnee] = useState(false);
  const [viewLegHip, setViewLegHip] = useState(false);
  const [capturedList, setCapturedList] = useState([]);   // {img, issue, type, exerciseId}
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [doneReps, setDoneReps] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startAt, setStartAt] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [liveDots, setLiveDots] = useState([]);
  const [currentExerciseIndex] = useState(0);
  const currentExercise = routine?.exercises?.[currentExerciseIndex];
  const totalReps = routine?.exercises?.reduce((acc, cur) => acc + ((cur.reps ?? 0) * (cur.sets ?? 1)), 0) ?? 0;
  const [exerciseResults, setExerciseResults] = useState({}); // { [exerciseId]: {goodCount, badCount} }
  const [poseHistory, setPoseHistory] = useState([]);

  const [reportImg, setReportImg] = useState('');
  const hasSavedRef = useRef(false);

  // ✅ 추가: 종료 안내 오버레이 & 카운트다운
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const resultPayloadRef = useRef(null); // workoutresult로 넘길 state 보관

  const toggleFeedback = () => setIsFeedbackOn(v => !v);

  useEffect(() => { if (routine) setRemainingTime(calcTotalTime(routine)); }, [routine]);

  // 카운트다운
  useEffect(() => {
    if (!isStarted || remainingTime <= 0) return;
    const t = setInterval(() => setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(t);
  }, [isStarted, remainingTime]);

  const currentExerciseId = currentExercise?.exerciseId;

  const canCountNow = () =>
    isStarted && !hasSavedRef.current && currentExerciseId && doneReps < totalReps;

  const clampInc = () => setDoneReps(prev => (prev >= totalReps ? prev : prev + 1));

  const onRepCounted = () => {
    if (!canCountNow()) return;
    setExerciseResults(prev => ({
      ...prev,
      [currentExerciseId]: {
        goodCount: prev[currentExerciseId]?.goodCount || 0,
        badCount:  prev[currentExerciseId]?.badCount  || 0,
      }
    }));
    clampInc();
  };

  const onGoodPosture = () => {
    if (!canCountNow()) return;
    setExerciseResults(prev => ({
      ...prev,
      [currentExerciseId]: {
        goodCount: (prev[currentExerciseId]?.goodCount || 0) + 1,
        badCount:  (prev[currentExerciseId]?.badCount  || 0),
      }
    }));
    setGoodCount(v => v + 1);
    setLiveDots(d => [...d, { type: 'good', id: Date.now() }].slice(-60));
    clampInc();
  };

  const onBadPosture = () => {
    if (!canCountNow()) return;
    setExerciseResults(prev => ({
      ...prev,
      [currentExerciseId]: {
        goodCount: (prev[currentExerciseId]?.goodCount || 0),
        badCount:  (prev[currentExerciseId]?.badCount  || 0) + 1,
      }
    }));
    setBadCount(v => v + 1);
    setLiveDots(d => [...d, { type: 'bad', id: Date.now() }].slice(-60));
    clampInc();
  };

  // 총 횟수 도달 시 자동 저장 → (바로 navigate X) → 안내 오버레이 + 10초 후 자동 이동
  useEffect(() => {
    if (!isStarted || totalReps === 0 || doneReps < totalReps || hasSavedRef.current) return;
    const videoEl = document.querySelector('video');
    if (videoEl && !videoEl.paused) videoEl.pause();
    setIsStarted(false);
    setRemainingTime(0);
    handleVideoEnd();
  }, [doneReps, totalReps, isStarted]);

  const handleVideoEnd = async () => {
    if (hasSavedRef.current) return;

    if (doneReps < totalReps) {
      const videoEl = document.querySelector("video");
      if (videoEl) videoEl.play();
      return;
    }

    hasSavedRef.current = true;
    setIsStarted(false);

    const durationSeconds = startAt ? Math.round((Date.now() - startAt) / 1000) : 0;
    const exerciseLogs = buildExerciseLogs(routine, exerciseResults, durationSeconds);
    const payload = { email: user.email, exerciseLogs };

    // 1) 결과 저장
    let idByExercise = {};
    try {
      const { data } = await axios.post(
        'http://localhost:329/web/api/exercise/result',
        payload,
        { withCredentials: true }
      );
      idByExercise = mapLogIds(data, exerciseLogs);
    } catch (err) {
      console.error('❌ 운동 결과 저장 실패:', err?.response?.data ?? err);
      alert('운동 결과 저장에 실패했습니다.');
      navigate('/main');
      return;
    }

    // 2) 캡처 업로드(선택)
    try {
      const jobs = (capturedList ?? [])
        .filter(e => e?.img && e.img.length > 100)
        .map(entry => {
          const base64 = entry.img.includes(',') ? entry.img.split(',')[1] : entry.img;
          const logId = entry.exerciseId != null ? idByExercise[entry.exerciseId] : undefined;
          if (logId == null) return Promise.resolve();
          const body = {
            singleExerciseLogId: logId,
            detectedIssue: entry.issue ?? '0',
            feedbackImg: base64,
            postureFeedbackcol: entry.type ?? '자동 캡처',
          };
          return axios.post('http://localhost:329/web/api/posture/upload', body, { withCredentials: true });
        });

      await Promise.all(jobs);
    } catch (error) {
      console.error('❌ 캡처 업로드 실패:', error?.response?.data ?? error);
    }

    // 3) 결과 요약(프론트 상태) → WorkoutResultPage로 전달할 payload만 준비
    const calories = estimateCalories(goodCount, badCount, durationSeconds);
    const radarData = buildRadarDummy(goodCount, badCount);
    const sessionSummary = {
      email: user.email,
      doneReps,
      totalReps,
      goodCount,
      badCount,
      totalSeconds: durationSeconds,
      exerciseLogs,
      routineMeta: {
        routineId: routine?.routineId ?? null,
        routineName: routine?.name ?? '오늘의 루틴',
      },
    };

    // 이동 payload를 ref에 보관하고, 안내 오버레이 오픈 + 카운트다운 시작
    resultPayloadRef.current = {
      from: '/postureanalysis',
      radarData,
      caloriesBurned: calories,
      mistakeCount: badCount,
      session: sessionSummary,
    };
    setCountdown(10);
    setShowEndOverlay(true);
  };

  // ✅ 안내 오버레이 카운트다운 타이머
  useEffect(() => {
    if (!showEndOverlay) return;
    if (countdown <= 0) {
      // 자동 이동
      if (resultPayloadRef.current) {
        navigate('/workoutresult', { state: resultPayloadRef.current });
      } else {
        navigate('/main');
      }
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showEndOverlay, countdown, navigate]);

  const goResultNow = () => {
    if (resultPayloadRef.current) {
      setShowEndOverlay(false);
      navigate('/workoutresult', { state: resultPayloadRef.current });
    }
  };
  const goHomeNow = () => {
    setShowEndOverlay(false);
    navigate('/main');
  };

  // 간단한 인라인 스타일(새 CSS 파일 수정 없이 최소 변경)
  const overlayStyles = {
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000
    },
    card: {
      width: 'min(480px, 92vw)', background: '#101010', color: '#eaeaea',
      border: '1px solid #1f1f1f', borderRadius: 16, padding: 20,
      boxShadow: '0 24px 60px rgba(0,0,0,0.45)', textAlign: 'center'
    },
    title: { margin: '0 0 8px', fontSize: 18, fontWeight: 800 },
    desc: { margin: '0 0 14px', color: '#bbbbbb', fontSize: 14 },
    ctaRow: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' },
    btn: {
      background: '#161616', color: '#fff', border: '1px solid #2b2b2b',
      padding: '10px 14px', borderRadius: 12, cursor: 'pointer', fontWeight: 800
    },
    primary: {
      background: '#222', color: '#000', border: '1px solid #2b2b2b',
      position: 'relative', overflow: 'hidden'
    },
    progressWrap: {
      display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', marginTop: 6
    },
    progressBar: {
      width: '100%', height: 8, background: '#171717', borderRadius: 999, overflow: 'hidden',
      border: '1px solid #2b2b2b'
    },
    progressFill: (pct) => ({
      width: `${pct}%`, height: '100%',
      background: 'linear-gradient(90deg, #FBD157, #ffe08c)'
    }),
    countText: { fontSize: 12, color: '#aaa' }
  };

  return (
    <CountContext.Provider value={{
      goodCount, setGoodCount,
      badCount, setBadCount,
      setReportImg,
      setCapturedList
    }}>
      <PageWrapper>
        <div className="posture-container">
          <div className="posture-left">
            <header className="posture-header">
              <img className='logo' src='./images/ironman_logo.png' alt="logo" />
              <h2>운동 및 자세분석</h2>
              <div className="settings-icon" onClick={() => navigate('/settings')}>⚙️</div>
            </header>

            <div className="posture-stats">
              <StatBox label="총 횟수" count={goodCount + badCount} />
              <StatBox label="좋은 자세" count={goodCount} />
              <StatBox label="나쁜 자세" count={badCount} />
            </div>

            <FeedbackToggle isOn={isFeedbackOn} onToggle={toggleFeedback} />
            {isStarted && (
              <div className="realtime-pills-card">
                <div className="realtime-row">
                  {poseHistory.map((p, i) => (
                    <span key={p.id ?? i} className={`pill-seg ${p.type}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="exercise-buttons">
              {exerciseList.map((exercise, idx) => (
                <button
                  key={idx}
                  className={`exercise-btn ${selectedVideo === exercise.videoUrl ? 'active' : ''}`}
                  onClick={() => setSelectedVideo(exercise.videoUrl)}
                >
                  {exercise.name}
                </button>
              ))}
            </div>

            <div className="posture-stats">
              <button className="stat-box" onClick={() => setViewKnee(v => !v)} style={viewKnee ? { backgroundColor: 'gray' } : undefined}>무릎 발끝 수직선 체크</button>
              <button className="stat-box" onClick={() => setViewLegHip(v => !v)} style={viewLegHip ? { backgroundColor: 'gray' } : undefined}>무릎 허리 각도보기</button>
            </div>
            <button onClick={()=>{getSpeech("박머혁 여기 코드 왜 이렇게 해놨어?");}}>박머혁은 소리키고 이거 눌러라</button>
            {selectedCapture && (
              <div className="capture-preview">
                <h4>📷 선택한 캡처 미리보기</h4>
                <img src={selectedCapture} alt="선택된 캡처" className="preview-img" />
                <button onClick={() => setSelectedCapture(null)}>닫기</button>
              </div>
            )}

            <div className="capture-thumbnails">
              {(capturedList ?? []).map((entry, idx) => (
                <img
                  key={idx}
                  src={entry.img}
                  alt={`캡처 ${idx + 1}`}
                  className="thumbnail-img"
                  onClick={() => setSelectedCapture(entry.img)}
                />
              ))}
            </div>
          </div>

          <div className="posture-right">
            <div className="video-container">
              <div className="video-status-bar-modern">
                <div className="progress-container">
                  <div className="progress-label">
                    <span>📊 진행률</span>
                    <span className="progress-percent">
                      {totalReps > 0 ? Math.round((doneReps / totalReps) * 100) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${totalReps > 0 ? (doneReps / totalReps) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {doneReps} / {totalReps} 회
                  </div>
                </div>
                <div className="timer-container">
                  <span className="timer-icon">⏱</span>
                  <span className="timer-text">
                    {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <TrainingCamTest
                isStarted={isStarted}
                viewKnee={viewKnee}
                viewLegHip={viewLegHip}
                onVideoEnd={handleVideoEnd}
                currentExercise={currentExercise}
                onGoodPosture={onGoodPosture}
                onBadPosture={onBadPosture}
                onRepCounted={onRepCounted}
              />

              {!isStarted && (
                <div className="start-overlay">
                  <button
                    className="start-btn"
                    onClick={() => {
                      if (routine) setRemainingTime(calcTotalTime(routine));
                      setDoneReps(0);
                      setGoodCount(0);
                      setBadCount(0);
                      setExerciseResults({});
                      setStartAt(Date.now());
                      hasSavedRef.current = false;
                      setIsStarted(true);
                    }}
                  >
                    시작
                  </button>
                </div>
              )}
            </div>
          </div>

          {isStarted && (
            <div className="live-dots">
              {liveDots.map((d, i) => (
                <span key={d.id ?? i} className={`dot ${d.type}`} />
              ))}
            </div>
          )}
        </div>

        {/* ✅ 운동 종료 안내 오버레이 */}
 
          {showEndOverlay && (
            <div className="end-overlay">
              <div className="end-card">
                <h3 className="end-title">운동이 종료되었습니다</h3>
                <p className="end-desc">
                  <strong>운동결과페이지</strong>로 이동합니다. ({countdown}초 후 자동 이동)
                </p>

                <div className="end-progress">
                  <div className="end-progress-bar">
                    <div
                      className="end-progress-fill"
                      style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                    />
                  </div>
                  <div className="end-count">자동 이동까지 {countdown}초</div>
                </div>

                <div className="end-actions">
                  <button className="end-btn" onClick={goHomeNow}>홈으로 가기</button>
                  <button className="end-btn end-btn-primary" onClick={goResultNow}>
                    운동결과페이지로 가기
                  </button>
                </div>
              </div>
            </div>
          )}

      </PageWrapper>
    </CountContext.Provider>
  );
};

export default PostureAnalysisPage;
