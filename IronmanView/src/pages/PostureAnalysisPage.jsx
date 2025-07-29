import React, { useEffect, useState } from 'react';
import '../styles/PostureAnalysis.css';
import StatBox from '../components/posture/StatBox';
import FeedbackToggle from '../components/posture/FeedbackToggle';
import GuideVideoPlayer from '../components/posture/GuideVideoPlayer';
import VideoFeed from '../components/posture/VideoFeed';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import TrainingCam from '../components/TrainingCam';

const PostureAnalysisPage = () => {
  const [isFeedbackOn, setIsFeedbackOn] = useState(true);
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [successCount, setSuccessCount] = useState(0);   // 운동 성공 횟수
  const [failCount, setFailCount] = useState(0);         // 운동 실패 횟수

  const navigate = useNavigate();

  const toggleFeedback = () => setIsFeedbackOn((prev) => !prev);

  useEffect(() => {
    // 백엔드에서 운동 리스트 가져오기
    axios.get('http://localhost:5000/api/user/exercise-list')
      .then((res) => {
        const list = res.data;
        setExerciseList(list);
        if (list.length > 0) setSelectedVideo(list[0].videoUrl);
      })
      .catch((err) => {
        console.error('운동 리스트 불러오기 실패:', err);
      });
  }, []);



  return (
    <div className="posture-container">
      <div className="posture-left">
        <header className="posture-header">
          <div className="logo">💪 언맨</div>
          <h2>운동 및 자세분석</h2>
          <div className="settings-icon" onClick={() => navigate('/settings')}>⚙️</div>
        </header>

        <div className="posture-stats">
          <StatBox label="운동 횟수" count={successCount} />
          <StatBox label="실패 횟수" count={failCount} />
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

        <GuideVideoPlayer videoUrl={selectedVideo} />
      </div>

      <div className="posture-right">
        <TrainingCam></TrainingCam>
      </div>
    </div>
  );
};

export default PostureAnalysisPage;
