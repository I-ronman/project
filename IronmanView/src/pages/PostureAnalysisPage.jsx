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



  const toggleFeedback = () => setIsFeedbackOn((prev) => !prev);

   useEffect(() => {
    if (routine) {
      console.log(" 전달받은 루틴:", routine);
    }
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

  const handleVideoEnd = async () => {
    console.log("🎬 영상 종료. 저장 시작:", capturedList.length, "개");

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
        console.log(`✅ ${entry.issue === '1' ? '좋은' : '나쁜'} 자세 저장 완료`);
      } catch (error) {
        console.error("❌ 저장 실패:", error);
      }
    }
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
            <TrainingCamTest
              viewKnee={viewKnee}
              viewLegHip={viewLegHip}
              onVideoEnd={handleVideoEnd} // ✅ 종료 시 저장
            />
          </div>
          
        </div>
      </PageWrapper>
    </CountContext.Provider>
  );
};

export default PostureAnalysisPage;
