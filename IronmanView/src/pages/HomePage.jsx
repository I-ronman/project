// src/pages/HomePage.jsx

import React from 'react';
import LoginCard from '../components/LoginCard';
import MainContent from '../components/MainContent';
import BlurOverlay from '../components/BlurOverlay';

const HomePage = ({ isLoggedIn }) => {
  return (
    <div className="homepage-container">
      {/* 로그인 카드: 항상 보임 */}
      <div className="top-section">
        <LoginCard />
      </div>

      {/* 블러는 메인 콘텐츠 영역에만 적용 */}
      <div className="main-section-wrapper" style={{ position: 'relative' }}>
        <MainContent />
        {!isLoggedIn && <BlurOverlay />}
      </div>
    </div>
  );
};

export default HomePage;
