import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import './SideMenu';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const profileImgSrc = user?.face || './images/default_profile.jpg';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
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

  const navItems = [
    { name: '운동하기', path: '/exercise' },
    { name: '스케줄', path: '/schedule' },
    { name: '통계', path: '/statistics' },
    { name: '챗봇', path: '/chatbot' },
    { name: '커뮤니티', path: '/board' },
    { name: '설문조사', path: '/survey' },
    { name: '마이 페이지', path: '/mypage' },
  ];

  return (
    <header className="header">
      {/* 왼쪽 영역 */}
      <div className="header-left">
        {isMobile ? (
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        ) : (
          <div className="logo-area" onClick={() => navigate('/main')}>
            <img src="/images/ironman_logo.png" alt="Ironman 로고" className="logo_img" />
          </div>
        )}
        {isMobile && isMenuOpen && (
          <div className="side-menu">
            <div className="close-btn" onClick={() => setIsMenuOpen(false)}>×</div>
            {navItems.map((item) => (
              <div
                key={item.path}
                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleMove(item.path)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 가운데: 모바일일 때만 로고 */}
      {isMobile && (
        <div className="header-center" onClick={() => navigate('/main')}>
          <img src="/images/ironman_logo.png" alt="Ironman 로고" className="logo_img" />
        </div>
      )}

      {/* 오른쪽 영역 */}
      <div className="header-right">
        {!isMobile && (
          <div className="nav-items">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMove(item.path)}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        <img
          src={profileImgSrc}
          alt="프로필"
          className="profile-img"
          onClick={() => navigate('/mypage')}
        />
      </div>
    </header>
  );
};

export default Header;
