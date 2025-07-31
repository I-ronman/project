import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SideMenu from './SideMenu';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user, logout } = useContext(AuthContext);
  const profileImgSrc = user?.profileImage || './images/default_profile.jpg';
  
  const handleMove = (path) => {
    navigate(path);
    setIsMenuOpen(false); // 메뉴 닫기
  };

  const handleLogout = async () => {
    try{
      await axios.post('http://localhost:329/web/logout',{},{
        withCredentials: true
      });
    } catch (err){
      console.error("백엔드 로그아웃 실패", err);
    }
    logout();
    navigate('/login');
  }
  
  return (
    <header className="header">
      {/* 왼쪽: 햄버거 */}
      <div className="header-left" style= {{position: 'relative'}}>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {isMenuOpen && (
          <div className="side-menu">
            <div className="menu-item" onClick={() => handleMove('/routine')}>
              <span>운동하기</span>
            </div>
            <div className="menu-item" onClick={() => handleMove('/schedulepage')}>
              <span>스케줄</span>
            </div>
            <div className="menu-item" onClick={() => handleMove('/statistics')}>
              <span>통계</span>
            </div>
            <div className="menu-item" onClick={() => handleMove('/chatbot')}>
              <span>챗봇</span>
            </div>
            <div className="menu-item" onClick={() => handleMove('/board')}>
              <span>커뮤니티</span>
            </div>
            <div className="menu-item" onClick={() => handleMove('/survey')}>
              <span>설문조사</span>
            </div>
          </div>
        )}
      </div>

      {/* 가운데: 로고 */}
      <div className="header-center" onClick={() => navigate('/main')}>
        I언맨
      </div>

      {/* 오른쪽: 로그아웃 + 프로필 */}
      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
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
