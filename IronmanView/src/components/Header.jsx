// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // 추후 로직 연결
    console.log('로그아웃');
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black text-white">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="text-lg font-bold">언맨</h1>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <span>어서오세요! <strong>{user.name}</strong> 님</span>
          <img src={user.profileImage} alt="profile" className="w-8 h-8 rounded-full" />
          <button onClick={handleLogout} className="text-sm font-semibold">로그아웃</button>
        </div>
      ) : (
        <button onClick={handleLogin} className="text-sm font-semibold">로그인</button>
      )}
    </header>
  );
};

export default Header;
