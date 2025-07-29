// project/IronmanView/src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/SignupPage.css';
import logo from '../assets/logo.png';
import axios from 'axios';
import PageWrapper from '../layouts/PageWrapper';

function SignupPage() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pw) =>
    /[A-Z]/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  useEffect(() => {
    const fetchOAuthUser = async () => {
      try {
        const res = await axios.get(
          'http://localhost:329/web/oauth/userinfo',
          { withCredentials: true }
        );
        if (res.data) {
          setName(res.data.name || '');
          setEmail(res.data.email || '');
          setEmailVerified(true);
        }
      } catch (err) {
        console.error('유저 정보 조회 실패:', err);
      }
    };

    fetchOAuthUser();

    // cleanup 함수
    return () => {
      if (email) {
        axios
          .delete('http://localhost:329/web/email/clear', {
            params: { email },
          })
          .catch((err) => {
            console.error('인증 초기화 실패:', err);
          });
      }
    };
  }, []);

  const handleEmailAuth = async () => {
    if (!validateEmail(email)) {
      setEmailError('올바르지 않은 이메일입니다.');
      return;
    }
    setEmailError('');

    try {
      await axios.post(
        'http://localhost:329/web/email/send',
        { email },
        { withCredentials: true }
      );
      alert('인증코드가 이메일로 발송되었습니다.');
      setShowCodeInput(true);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data === '존재하지 않는 이메일입니다.'
      ) {
        alert('존재하지 않는 이메일입니다.');
      } else {
        alert('이메일 인증 요청에 실패했습니다.');
      }
    }
  };

  const handleEmailVerify = async () => {
    try {
      const res = await axios.post(
        'http://localhost:329/web/email/verify',
        {
          email,
          code: emailCode,
        },
        {
          withCredentials: true,
          responseType: 'text',
        }
      );
      if (res.status === 200) {
        alert('이메일 인증 완료');
        setEmailVerified(true);
      }
    } catch (err) {
      alert('인증코드가 일치하지 않습니다.');
    }
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (!validatePassword(password)) {
      setPasswordError('영어 대문자, 특수문자가 최소 1개씩 들어가야 합니다.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!emailVerified) {
      alert('이메일 인증이 필요합니다.');
      hasError = true;
    }

    if (hasError) return;

    const data = {
      name,
      gender,
      birthdate: birthDate ? birthDate.toISOString().split('T')[0] : '',
      email,
      pw: password,
    };

    try {
      const response = await axios.post(
        'http://localhost:329/web/signup',
        data
      );
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다.');
    } catch (error) {
      const message =
        error.response?.data || '회원가입 중 오류가 발생했습니다.';
      console.error('회원가입 실패:', message);
      alert(`회원가입 실패: ${message}`);
    }
  };

  return (
    <PageWrapper>
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
              value="M"
              checked={gender === 'M'}
              onChange={(e) => setGender(e.target.value)}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={gender === 'F'}
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
        <div className="email-row">
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="email-auth-btn" onClick={handleEmailAuth}>
            이메일 인증
          </button>
        </div>
        {emailError && <p className="error-text">{emailError}</p>}

        {showCodeInput && (
          <div className="verify-row">
            <input
              type="text"
              placeholder="인증코드를 입력하세요"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
            />
            <button className="email-auth-btn" onClick={handleEmailVerify}>
              인증 확인
            </button>
          </div>
        )}

        <label>Password*</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="error-text">{passwordError}</p>}

        <p className="agreement">
          계정을 만들거나 가입하면 당사의 이용 약관 및 개인정보 보호정책에 동의하는 것으로 간주됩니다.
        </p>

        <button className="signup-btn" onClick={handleSubmit}>
          계속하기
      </button>
      </div>
    </PageWrapper>
  );
}

export default SignupPage;
