import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Auth.css'


function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:329/web/login', {
        email,
        pw
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        console.log(res.data);
        // 로그인 성공 시 리디렉션
      if (res.data.success) {
        navigate('/home')  // 나중에 홈페이지로 연결
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
      })
    } catch (err) {
      console.error(err)
      alert('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        <p onClick={() => navigate('/signup')}>회원가입 하기</p>

      </div>
    </div>
  )
}

export default LoginPage
