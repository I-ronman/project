// src/components/LoginCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginCard.css'; // 스타일은 너가 쓰던 파일로 유지

const LoginCard = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-card">
      <h2>로그인이 필요합니다</h2>
      <p>이 기능을 사용하려면 로그인이 필요합니다.</p>
      <button className="login-button" onClick={handleLoginClick}>
        로그인하러 가기
      </button>
    </div>
  );
};

export default LoginCard;
