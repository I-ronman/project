// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

// 초기 사용자 정보 설정 (로컬스토리지 또는 기본값)
const getInitialUser = () => {
  let storedUser = null;
try {
  storedUser = JSON.parse(localStorage.getItem('user'));
} catch (e) {
  console.error('User JSON parse error:', e);
}

return storedUser || {
  name: '홍길동',
  gender: '남성',
  birthYear: 1995,
  email: 'test@example.com',
  age: 29,
  height: 170,
  weight: 65,
  goalWeight: 60,
  flexibility: '중간',
  strength: '보통',
};

};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [surveyDone, setSurveyDone] = useState(() => {
    const stored = localStorage.getItem('surveyDone');
    return stored === 'true';
  });

  // 로그인 함수 (예제용)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('surveyDone');
  };

  // 설문 완료 여부 저장
  const completeSurvey = () => {
    setSurveyDone(true);
    localStorage.setItem('surveyDone', 'true');
  };

  // 앱 초기화 시 로컬스토리지 상태 유지
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        surveyDone,
        completeSurvey,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
