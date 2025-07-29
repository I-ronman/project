// project/IronmanView/src/components/AuthForm.jsx
// 로그인/회원가입 화면에 공통으로 사용하는 폼 컴포넌트
import React, { useState } from 'react'

const AuthForm = ({ type, onSubmit }) => {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ id, pw, name })  // 상위 페이지로 데이터 전달
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>{type === 'login' ? '로그인' : '회원가입'}</h2>
      
      {type === 'register' && (
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        required
      />

      <button type="submit">
        {type === 'login' ? '로그인' : '회원가입'}
      </button>
    </form>
  )
}

export default AuthForm
