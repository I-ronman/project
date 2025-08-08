// project/IronmanView/src/pages/PostureAnalysisPage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/PostureAnalysis.css';
import StatBox from '../components/posture/StatBox';
import FeedbackToggle from '../components/posture/FeedbackToggle';
import GuideVideoPlayer from '../components/posture/GuideVideoPlayer';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; 
import TrainingCamTest from '../components/TrainingCamTest';
import PageWrapper from '../layouts/PageWrapper';
import { CountContext } from '../context/CountContext';
import TrainingCam from '../components/TrainingCam';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


const PostureAnalysisPage = () => {
  const [isFeedbackOn, setIsFeedbackOn] = useState(true);
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewKnee, setViewKnee] = useState(false);
  const [viewLegHip, setViewLegHip] = useState(false);
  const [capturedList, setCapturedList] = useState([]);
  const [reportImg, setReportImg] = useState(""); // 미리보기 용도
  const navigate = useNavigate();
  const location = useLocation();
  const routine = location.state?.routine;
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [selectedCapture, setSelectedCapture] = useState(null); // 선택한 이미지
  const { user } = useContext(AuthContext);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = routine?.exercises?.[currentExerciseIndex];
  const totalReps = routine?.exercises?.reduce((acc, cur) => {return acc + ((cur.reps ?? 0) * (cur.sets ?? 1));}, 0);
  const [doneReps, setDoneReps] = useState(0);



  const toggleFeedback = () => setIsFeedbackOn((prev) => !prev);

  const [remainingTime, setRemainingTime] = useState(0);

useEffect(() => {
  if (!routine) return;

  const calculatedTime = routine.exercises.reduce((acc, cur) => {
    const exerciseTime = (cur.exerciseTime ?? 0) * (cur.sets ?? 1);
    const breakTime = (cur.breaktime ?? 0) * (cur.sets ?? 1);
    return acc + exerciseTime + breakTime;
  }, 0);

  setRemainingTime(calculatedTime);

  const interval = setInterval(() => {
    setRemainingTime((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [routine]);


  useEffect(() => {
    axios.get('http://localhost:329/web/api/posture/list', {
      withCredentials: true
    })
      .then((res) => {
        const list = res.data;
        setExerciseList(list);
        if (list.length > 0) setSelectedVideo(list[0].videoUrl);
      })
      .catch((err) => {
        console.error('운동 리스트 불러오기 실패:', err);
      });
  }, []);


const handleRepCounted = (exerciseId) => {
  setExerciseResults(prev => ({
    ...prev,
    [exerciseId]: {
      ...prev[exerciseId],
      goodCount: prev[exerciseId]?.goodCount || 0,  // 나중에 실제 good/bad는 show 이벤트에서 따로 들어옴
      badCount: prev[exerciseId]?.badCount || 0,
    }
  }));

  setDoneReps(prev => prev + 1);  // ✅ 진행률 증가
};

  const handleVideoEnd = async () => {
  if (doneReps < totalReps) {
    // 아직 횟수 다 안 채움 → 영상 재시작
    const videoEl = document.querySelector("video");
    if (videoEl) videoEl.play();
    return;
  }

  console.log("🎬 모든 루틴 완료 → 저장 시작");
  const now = Date.now() / 1000;

  // ✅ 캡처 저장
  for (const entry of capturedList) {
    try {
      await axios.post(
        'http://localhost:329/web/api/posture/upload',
        {
          singleExerciseLogId: 1,
          detectedIssue: entry.issue,
          feedbackImg: entry.img,
          postureFeedbackcol: '자동 캡처'
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("❌ 자세 저장 실패:", error);
    }
  }

  // ✅ 운동 결과 저장
  const exerciseLogs = routine.exercises.map((ex) => {
    const stats = exerciseResults[ex.exerciseId] || {};
    return {
      exerciseId: ex.exerciseId,
      duration: ex.exerciseTime,
      endTime: now,
      goodCount: stats.goodCount || 0,
      badCount: stats.badCount || 0,
      sets: ex.sets,
      reps: ex.reps,
      breaktime: ex.breaktime,
    };
  });

  const payload = {
    email: user.email,
    exerciseLogs
  };

  try {
    await axios.post('http://localhost:329/web/api/exercise/result', payload, {
      withCredentials: true
    });
    console.log("✅ 전체 운동 결과 저장 완료!");
  } catch (err) {
    console.error("❌ 전체 운동 결과 저장 실패:", err);
  }

  alert("✅ 모든 운동이 완료되었습니다!");
  navigate("/main");
};




const [exerciseResults, setExerciseResults] = useState({});

const handleGoodPosture = (exerciseId) => {
  setExerciseResults(prev => ({
    ...prev,
    [exerciseId]: {
      ...prev[exerciseId],
      goodCount: (prev[exerciseId]?.goodCount || 0) + 1
    }
  }));

  setDoneReps((prev) => prev + 1);
};


  return (
    <CountContext.Provider value={{
      goodCount,
      setGoodCount,
      badCount,
      setBadCount,
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
              <StatBox label="총 횟수" count={goodCount+badCount} />
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

            <div className='posture-stats'>
              <button className="stat-box" onClick={() => setViewKnee(prev => !prev)} style={viewKnee ? { backgroundColor: "gray" } : undefined}>무릎 발끝 수직선 체크</button>
              <button className="stat-box" onClick={() => setViewLegHip(prev => !prev)} style={viewLegHip ? { backgroundColor: "gray" } : undefined}>무릎 허리 각도보기</button>
            </div>


                   {/* 캡처 이미지 미리보기 영역 */}
            {selectedCapture && (
              <div className="capture-preview">
                <h4>📷 선택한 캡처 미리보기</h4>
                <img src={selectedCapture} alt="선택된 캡처" className="preview-img" />
                <button onClick={() => setSelectedCapture(null)}>닫기</button>
              </div>
            )}

            {/* 썸네일 리스트 */}
            <div className="capture-thumbnails">
              {capturedList.map((entry, idx) => (
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
      viewKnee={viewKnee}
      viewLegHip={viewLegHip}
      onVideoEnd={handleVideoEnd}
      currentExercise={routine?.exercises?.[currentExerciseIndex]}
      onGoodPosture={handleGoodPosture}         
      onRepCounted={handleRepCounted}   
    />
  </div>
</div>


           


        </div>
      </PageWrapper>
    </CountContext.Provider>
  );
};

export default PostureAnalysisPage;
