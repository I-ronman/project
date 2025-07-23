import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/SignupPage.css';
import logo from '../assets/logo.png';
import axios from 'axios';

function SignupPage() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const data = {
    email: email,
    pw: password,
    name: name,
    gender: gender,
    birthdate: birthDate ? birthDate.toISOString().split('T')[0] : ''
  };
    try {
      await axios.post('http://localhost:329/web/signup', data);
      console.log('회원가입 성공:', response.data);
      // 성공 후 리다이렉트 또는 알림 처리
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data || error.message);
    }
  }


  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <img src={logo} alt="I언맨 로고" className="signup-logo" />
        <h2>회원가입</h2>

        <label>이름*</label>
        <input
          type="text"
          placeholder="이름을 입력하세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>성별*</label>
        <div className="gender-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="남성"
              checked={gender === '남성'}
              onChange={(e) => setGender(e.target.value)}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="여성"
              checked={gender === '여성'}
              onChange={(e) => setGender(e.target.value)}
            />
            여성
          </label>
        </div>

        <label>생년월일*</label>
        <DatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          dateFormat="yyyy/MM/dd"
          placeholderText="생년월일을 선택하세요"
          className="date-picker"
        />

        <label>Email*</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password*</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="password-hint">
          영어 대문자, 영어 소문자, 특수문자가 최소 1개씩 들어가야 합니다.
        </p>

        <p className="agreement">
          계정을 만들거나 가입하면 당사의 이용 약관 및 개인정보 보호정책에
          동의하는 것으로 간주됩니다.
        </p>

        <button className="signup-btn" onClick={handleSubmit}>계속하기</button>

        <button className="google-btn">Google 계정으로 회원가입</button>
        <button className="kakao-btn">Kakaotalk 계정으로 로그인</button>
      </div>
    </div>
  );
}

export default SignupPage;
