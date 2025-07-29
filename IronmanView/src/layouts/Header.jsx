import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/main')}>I언맨</div>
      <nav className="nav">
        {/* <button onClick={() => navigate('/mypage')}>마이페이지</button> */}
        {/* <button onClick={() => navigate('/routine')}>루틴</button> */}
        {/* 필요시 추가 */}
      </nav>
    </header>
  );
};

export default Header;
