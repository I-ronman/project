import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HomePage.css'
import '../styles/BlurOverlay.css'

const HomePage = () => {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('user')
  

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="top-bar">
          <div className="logo">I언맨</div>
          <button className="login-button" onClick={handleLogin}>
            I언맨 로그인
          </button>
        </div>

        <div className="main-content">
          {!isLoggedIn && <div className="blur-text">블러처리 (실제로는 흐릿하게)</div>}
        </div>

        {!isLoggedIn && <div className="blur-overlay" />}
      </div>
    </div>
  )
}

export default HomePage
