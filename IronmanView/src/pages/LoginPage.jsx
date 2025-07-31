import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Auth.css'
import PageWrapper from '../layouts/PageWrapper';
import { AuthContext } from '../context/AuthContext';


function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const {login} = useContext(AuthContext);


  useEffect(() => {
  axios.get('http://localhost:329/web/login/check', { withCredentials: true })
    .then(res => {
      if (res.data.loggedIn) {
        console.log(res.data);
        // 로그인 유지 처리
      } else {
        // 로그인 안 되어 있음 처리
      }
    })
    .catch(err => {
      console.error('세션 확인 실패', err);
    });
}, []);
  


  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:329/web/login', {
        email,
        pw
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }).then((res) => {
        console.log(res.data);
        // 로그인 성공 시 리디렉션
      if (res.data && res.data.email) {

        login({
          name: res.data.name,
          email: res.data.email,
          
        })
        navigate('/main')  // 나중에 홈페이지로 연결
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
      })
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.')
    }
  }

 const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:329/web/oauth2/authorization/google'
  }

  return (
    <PageWrapper>
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
          <button onClick={handleGoogleLogin} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: '20px', height: '20px', marginRight: '10px' }}
        />
        구글 로그인
      </button>

          <p onClick={() => navigate('/signup')}>회원가입 하기</p>

        </div>
      </div>
    </PageWrapper>
  )
}

export default LoginPage
