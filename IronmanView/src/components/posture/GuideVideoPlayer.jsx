// project/IronmanView/src/components/posture/GuideVideoPlayer.jsx
import React from 'react';

// 선택된 운동 가이드 영상을 보여주는 컴포넌트
const GuideVideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) return <div className="video-placeholder">운동 영상 없음</div>;

  return (
    <div className="guide-video">
      <video width="100%" height="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        지원되지 않는 브라우저입니다.
      </video>
    </div>
  );
};

export default GuideVideoPlayer;
