import React from 'react';
import './SideMenu.css';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="side-menu">
      <button onClick={() => navigate('/mypage')}>마이페이지</button>
      <button onClick={() => navigate('/routine')}>루틴</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default SideMenu;