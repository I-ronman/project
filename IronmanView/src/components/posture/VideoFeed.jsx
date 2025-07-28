import React from 'react';

// 카메라로 사용자 실시간 영상 보여주는 컴포넌트 (후에 MediaPipe 등 연동 가능)
const VideoFeed = () => {
  return (
    <div className="video-feed">
      <div className="camera-placeholder">카메라 피드 영역</div>
    </div>
  );
};

export default VideoFeed;
