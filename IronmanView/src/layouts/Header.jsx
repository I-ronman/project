import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const { user, logout } = useContext(AuthContext);
  const profileImgSrc = user?.profileImage || './images/default_profile.jpg';

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMove = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:329/web/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error("백엔드 로그아웃 실패", err);
    }
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        {!isMobileView ? (
          <img
            src="/images/ironman_logo.png"
            alt="Ironman 로고"
            className="logo_img desktop-logo"
            onClick={() => navigate('/main')}
          />
        ) : (
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )}
      </div>

      {!isMobileView && (
        <nav className="desktop-nav">
          <span onClick={() => handleMove('/exercise')}>운동하기</span>
          <span onClick={() => handleMove('/schedulepage')}>스케줄</span>
          <span onClick={() => handleMove('/statistics')}>통계</span>
          <span onClick={() => handleMove('/chatbot')}>챗봇</span>
          <span onClick={() => handleMove('/board')}>커뮤니티</span>
          <span onClick={() => handleMove('/survey')}>설문조사</span>
          <span onClick={() => handleMove('/mypage')}>마이페이지</span>
        </nav>
      )}

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        <img
          src={profileImgSrc}
          alt="프로필"
          className="profile-img"
          onClick={() => navigate('/mypage')}
        />
      </div>

      {isMobileView && isMenuOpen && (
        <div className="side-menu">
          <div className="close-btn" onClick={() => setIsMenuOpen(false)}>×</div>
          <div className="menu-item" onClick={() => handleMove('/exercise')}>운동하기</div>
          <div className="menu-item" onClick={() => handleMove('/schedulepage')}>스케줄</div>
          <div className="menu-item" onClick={() => handleMove('/statistics')}>통계</div>
          <div className="menu-item" onClick={() => handleMove('/chatbot')}>챗봇</div>
          <div className="menu-item" onClick={() => handleMove('/board')}>커뮤니티</div>
          <div className="menu-item" onClick={() => handleMove('/survey')}>설문조사</div>
          <div className="menu-item" onClick={() => handleMove('/mypage')}>마이페이지</div>
        </div>
      )}
    </header>
  );
};

export default Header;
