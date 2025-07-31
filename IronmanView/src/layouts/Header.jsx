import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SideMenu from './SideMenu';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className="logo" onClick={() => navigate('/main')}>I언맨</div>
      <div className="nav-right">
        <button onClick={() => navigate('/logout')}>로그아웃</button>
        <img src="/images/profile.png" alt="프로필" className="profile-img" />
      </div>

      {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Header;
