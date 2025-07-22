
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'             // 홈화면 전체 스타일
import '../styles/BlurOverlay.css'  // 블러 처리 CSS

const HomePage = () => {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('user') // 로그인 여부 확인

  // 로그인 페이지로 이동하는 핸들러
  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="home-container">
      {/* 상단 로고 및 로그인 버튼 */}
      <div className="top-bar">
        <div className="logo">언맨</div>
        <button className="login-button" onClick={handleLogin}>
          언맨 로그인
        </button>
      </div>

      {/* 메인 콘텐츠 부분 - 로그인하지 않았을 경우 블러 처리 */}
      <div className="main-content">
        {!isLoggedIn && <div className="blur-text">블러처리 (실제로는 흐릿하게)</div>}
      </div>

      {/* 로그인하지 않았을 경우 블러 오버레이 렌더링 */}
      {!isLoggedIn && <div className="blur-overlay" />}
    </div>
  )
}

export default HomePage
