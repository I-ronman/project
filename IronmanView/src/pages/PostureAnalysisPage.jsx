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

const PostureAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routine = location.state?.routine;

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

  const [reportImg, setReportImg] = useState('');
  const hasSavedRef = useRef(false);

  const toggleFeedback = () => setIsFeedbackOn(v => !v);

  useEffect(() => { if (routine) setRemainingTime(calcTotalTime(routine)); }, [routine]);

  // 카운트다운
  useEffect(() => {
    if (!isStarted || remainingTime <= 0) return;
    const t = setInterval(() => setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(t);
  }, [isStarted, remainingTime]);

  // 가이드 영상 목록
  useEffect(() => {
    axios.get('http://localhost:329/web/api/posture/list', { withCredentials: true })
      .then((res) => {
        const list = res.data || [];
        setExerciseList(list);
        if (list.length > 0) setSelectedVideo(list[0].videoUrl);
      })
      .catch((err) => console.error('운동 리스트 불러오기 실패:', err));
  }, []);

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

  // 총 횟수 도달 시 자동 저장
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
      console.log('📦 /api/exercise/result 응답:', data);

      idByExercise = mapLogIds(data, exerciseLogs);
      console.log('🧭 exerciseId→logId 매핑:', idByExercise);

    } catch (err) {
      console.error('❌ 운동 결과 저장 실패:', err?.response?.data ?? err);
      alert('운동 결과 저장에 실패했습니다.');
      navigate('/main');
      return;
    }

    try {
      const jobs = (capturedList ?? [])
        .filter(e => e?.img && e.img.length > 100)
        .map(entry => {
          const base64 = entry.img.includes(',') ? entry.img.split(',')[1] : entry.img;
          const logId = entry.exerciseId != null ? idByExercise[entry.exerciseId] : undefined;
          if (logId == null) {
            console.warn('⏭️ logId 없음 → 해당 캡처 업로드 스킵:', entry);
            return Promise.resolve();
          }
          const body = {
            singleExerciseLogId: logId,
            detectedIssue: entry.issue ?? '0',
            feedbackImg: base64,
            postureFeedbackcol: entry.type ?? '자동 캡처',
          };
          return axios.post('http://localhost:329/web/api/posture/upload', body, { withCredentials: true });
        });

      await Promise.all(jobs);
      console.log('✅ 캡처 업로드 완료');
    } catch (error) {
      console.error('❌ 캡처 업로드 실패:', error?.response?.data ?? error);
      alert('캡처 업로드 중 일부가 실패했습니다.');
      navigate('/main');
      return;
    }

    alert('✅ 모든 운동이 완료되었습니다!');
    navigate('/main');
  };
  /* --------------------------------------------------------- */

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
              <div className="logo">💪 언맨</div>
              <h2>운동 및 자세분석</h2>
              <div className="settings-icon" onClick={() => navigate('/settings')}>⚙️</div>
            </header>

            <div className="posture-stats">
              <StatBox label="총 횟수" count={goodCount + badCount} />
              <StatBox label="좋은 자세" count={goodCount} />
              <StatBox label="나쁜 자세" count={badCount} />
            </div>

            <FeedbackToggle isOn={isFeedbackOn} onToggle={toggleFeedback} />

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
              <div className="video-status-bar">
                <div className="progress-info">
                  <span>진행률: {doneReps} / {totalReps}</span>
                  <progress value={doneReps} max={totalReps}></progress>
                </div>
                <div className="timer-info">
                  ⏱ 남은 시간: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
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
      </PageWrapper>
    </CountContext.Provider>
  );
};

export default PostureAnalysisPage;
