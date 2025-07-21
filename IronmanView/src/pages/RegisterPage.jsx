import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Auth.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:329/web/register', {
        id,
        pw,
        name,
        email
      }, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.data.success) {
        alert('회원가입 성공! 로그인 해주세요.')
        navigate('/')
      } else {
        alert('회원가입 실패')
      }
    } catch (err) {
      console.error(err)
      alert('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleRegister}>회원가입</button>
        <p onClick={() => navigate('/')}>로그인 화면으로</p>
      </div>
    </div>
  )
}

export default RegisterPage
