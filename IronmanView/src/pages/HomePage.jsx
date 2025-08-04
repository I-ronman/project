import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const videos = [
  
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4',
  '/videos/video5.mp4'
];

const HomePage = ({ isLoggedIn }) => {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((e) => console.log('autoplay error:', e));
    }
  }, [currentVideoIndex]);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="unauth-landing-container">
      <video
        key={currentVideoIndex}
        ref={videoRef}
        src={videos[currentVideoIndex]}
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      />
      <div className="video-overlay"></div>
      <div className="overlay-content">
        <h1>Supercharge Your Fitness.</h1>
        <h2>Stay Consistent. Get Results.</h2>
        <p>AI와 전문가의 경험을 바탕으로 맞춤형 트레이닝을 시작하세요.</p>
        <button onClick={handleLogin}>로그인 하러가기 →</button>
      </div>
    </div>
  );
};

export default HomePage;
