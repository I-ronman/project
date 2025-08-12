// project/IronmanView/src/context/AuthContext.jsx
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
    face: '/images/default_profile.jpg',
  };
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [surveyDone, setSurveyDone] = useState(() => {
    const stored = localStorage.getItem('surveyDone');
    return stored === 'true';
  });

  // 로그인 (예시)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('surveyDone');
    setSurveyDone(false);
  };

  // 설문 완료 → Context + localStorage 동기화
  const completeSurvey = () => {
    setSurveyDone(true);
    // 아래 useEffect가 있으므로 여기서 localStorage 직접 set 안 해도 되지만
    // 즉시성 원하시면 유지해도 무방합니다.
    localStorage.setItem('surveyDone', 'true');
  };

  // user가 바뀌면 항상 로컬스토리지에 반영
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // ✅ surveyDone이 바뀔 때마다 로컬스토리지와 자동 동기화 (일관성 보장)
  useEffect(() => {
    localStorage.setItem('surveyDone', surveyDone ? 'true' : 'false');
  }, [surveyDone]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        surveyDone,
        completeSurvey,  // ✅ 이 함수를 컴포넌트에서 사용
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
