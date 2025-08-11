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
import { AnimatePresence, motion } from "framer-motion";
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
  console.log("📋 루틴 목록:", routine?.exercises);

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
  const [isStarted, setIsStarted] = useState(false);
  const [startAt, setStartAt] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [liveDots, setLiveDots] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); 
  const currentExercise = routine?.exercises?.[currentExerciseIndex] ?? null;
  const [doneOverall, setDoneOverall] = useState(0);     // 전체 진행 수
  const [doneInExercise, setDoneInExercise] = useState(0); // 현재 운동에서의 진행 수
  const nextExercise   = routine?.exercises?.[currentExerciseIndex + 1] ?? null;
  const currentTarget = ((currentExercise?.reps ?? 0) * (currentExercise?.sets ?? 1)) || 0;
  const [history, setHistory] = useState([]);        // 끝난(또는 지나간) 운동들
  const carouselRef = useRef(null);
  const totalReps = routine?.exercises?.reduce (
  (acc, cur) => acc + ((cur.reps ?? 0) * (cur.sets ?? 1)),
    0
    ) ?? 0;

  const [exerciseResults, setExerciseResults] = useState({}); // { [exerciseId]: {goodCount, badCount} }const totalReps = routine?.exercises?.reduce((acc, cur) => acc + ((cur.reps ?? 0) * (cur.sets ?? 1)), 0) ?? 0;
  const [poseHistory, setPoseHistory] = useState([]);

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

  const currentExerciseId = currentExercise?.exerciseId;

  const canCountNow = () =>
  isStarted && !hasSavedRef.current && currentExerciseId && doneOverall < totalReps;


   // ----- 진행 목표 계산들 아래에 둡니다 -----
const incOne = () => {
  setDoneOverall(prev => (prev >= totalReps ? prev : prev + 1));
  setDoneInExercise(prev => {
    const next = currentTarget > 0 ? Math.min(prev + 1, currentTarget) : prev;
    return next;
  });
};

  const onRepCounted = () => {
    if (!canCountNow()) return;
    setExerciseResults(prev => ({
      ...prev,
      [currentExerciseId]: {
        goodCount: prev[currentExerciseId]?.goodCount || 0,
        badCount:  prev[currentExerciseId]?.badCount  || 0,
      }
    }));
    incOne();
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
  setPoseHistory(prev => [...prev, { type: 'good', id: Date.now() }]);
  incOne();
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
  setPoseHistory(prev => [...prev, { type: 'bad', id: Date.now() }]);
  incOne();
};


  // 총/현재 진행 감시
useEffect(() => {
  if (!isStarted) return;

  // (A) 현재 운동 완료 → 다음 운동으로
  if (currentTarget > 0 && doneInExercise >= currentTarget) {
    const nextIndex = (currentExerciseIndex ?? 0) + 1;
    const totalExercises = routine?.exercises?.length ?? 0;

    if (nextIndex < totalExercises) {
        if (currentExercise) {
      setHistory((h) => [...h, currentExercise]); }
      setCurrentExerciseIndex(nextIndex);
      setDoneInExercise(0);
      // 필요하면 안내 음성
      try { getSpeech?.(`${routine?.exercises?.[nextIndex]?.exerciseName} 시작`); } catch {}
    } else {
      // 마지막 운동까지 끝났다면 저장 트리거
      setIsStarted(false);
      setRemainingTime(0);
      handleVideoEnd();
    }
  }

  // (B) 전체 목표 달성 → 저장(백업 조건)
  if (totalReps !== 0 && doneOverall >= totalReps && isStarted) {
    const videoEl = document.querySelector('video');
    if (videoEl && !videoEl.paused) videoEl.pause();
    setIsStarted(false);
    setRemainingTime(0);
    handleVideoEnd();
  }
}, [
  doneOverall,          // 전체 진행 수
  isStarted,
  currentTarget,        // 현재 운동 목표(세트*횟수)
  doneInExercise,       // 현재 운동에서의 진행 수
  currentExerciseIndex,
  routine
]);

useEffect(() => {
  const el = carouselRef.current;
  if (!el) return;
  // 오른쪽 끝으로 부드럽게 이동
  el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
}, [history, currentExerciseIndex]);

  const handleVideoEnd = async () => {
    if (hasSavedRef.current) return;

    if (doneOverall < totalReps) {
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
              <img className= 'logo' src='./images/ironman_logo.png'></img>
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
                    {Math.round(((doneOverall || 0) / (totalReps || 1)) * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((doneOverall || 0) / (totalReps || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {doneOverall} / {totalReps} 회
                </div>
              </div>
              <div className="timer-container">
                <span className="timer-icon">⏱</span>
                <span className="timer-text">
                  {Math.floor(remainingTime / 60)}:
                  {String(remainingTime % 60).padStart(2, '0')}
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
                      console.log("✅ 시작 버튼 클릭됨");
                      if (routine) setRemainingTime(calcTotalTime(routine));
                      setDoneOverall(0);
                      setDoneInExercise(0);
                      setCurrentExerciseIndex(0);
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
           
             <div
  className="exercise-now-next exercise-carousel"
  ref={carouselRef}
  onWheel={(e) => { const el = e.currentTarget; el.scrollLeft += e.deltaY; }}
>
  <div className="carousel-track">
    {history.map((ex) => (
      <motion.div
        key={`hist-${ex.exerciseId}`}
        className="card"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="label">지난 운동</div>
        <div className="title">{ex.exerciseName ?? ex.name}</div>
        <div className="info">{(ex.sets ?? 0)}세트 × {(ex.reps ?? 0)}회</div>
      </motion.div>
    ))}

    <AnimatePresence mode="wait">
      {currentExercise && (
        <motion.div
          key={`current-${currentExercise.exerciseId}`}
          className="card active"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}     
          transition={{ type: "tween", duration: 0.28 }}
        >
          <div className="label">지금 운동</div>
          <div className="title">{currentExercise.exerciseName ?? currentExercise.name}</div>
          <div className="info">
            {(currentExercise.sets ?? 0)}세트 × {(currentExercise.reps ?? 0)}회
            {currentTarget ? ` · 진행 ${doneInExercise}/${currentTarget}` : ""}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* 다음 운동 */}
    <motion.div
      key={`next-${nextExercise?.exerciseId ?? 'none'}`}
      className="card"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="label">다음 운동</div>
      <div className="title">{nextExercise ? (nextExercise.exerciseName ?? nextExercise.name) : "모든 운동 완료"}</div>
      <div className="info">
        {nextExercise ? `${nextExercise.sets ?? 0}세트 × ${nextExercise.reps ?? 0}회` : ""}
      </div>
    </motion.div>
  </div>
</div>

          </div>
        </div>
      </PageWrapper>
    </CountContext.Provider>
  );
};

export default PostureAnalysisPage;
