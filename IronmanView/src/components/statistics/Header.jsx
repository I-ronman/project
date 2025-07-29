// project/IronmanView/src/components/statistics/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="statistics-header">
      <img src={logo} alt="로고" className="stats-logo" />
      <h1>운동 통계</h1>
      <div className="settings-icon" onClick={() => navigate('/settings')}>⚙️</div>
    </header>
  );
};

export default Header;
