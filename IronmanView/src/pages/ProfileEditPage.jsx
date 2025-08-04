// project/IronmanView/src/pages/ProfileEditPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import '../styles/ProfileEditPage.css';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProfileEditPage = () => {
 
  useEffect(() => {
  axios.get('http://localhost:329/web/login/user', { withCredentials: true })
    .then(res => {
      const { name, email, birthdate, gender  } = res.data;
      setUser(prev => ({ ...prev, name, email, birthdate, gender }));
      
    })
    .catch(err => {
      console.error('세션 사용자 정보 불러오기 실패', err);
      navigate('/login');
    });
}, []);
 
  const navigate = useNavigate();
  const { user, setUser, surveyDone } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    profileImage: '/default_profile.jpg',
    height: '',
    weight: '',
    goalWeight: '',
    activityLevel: '',
    pushup: '',
    plank: '',
    squat: '',
    flexibility: '',
    workoutFrequency: '',
  });
  const [previewImage, setPreviewImage] = useState(userInfo.profileImage);
  const [hasSurvey, setHasSurvey] = useState(false);

  // 1) 세션에서 사용자 기본 정보 로드
  useEffect(() => {
    axios
      .get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email, birthdate, gender } = res.data;
        setUser(prev => ({ ...prev, name, email, birthdate, gender }));
      })
      .catch(err => {
        console.error('세션 사용자 정보 불러오기 실패', err);
        navigate('/login');
      });
  }, [navigate, setUser]);

  // 2) surveyDone 반영
  useEffect(() => {
    setHasSurvey(surveyDone);
  }, [surveyDone]);

  // 3) 프로필 이미지 미리보기
  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setUserInfo(prev => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // 4) 폼 입력값 변경
  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  
  const handleSave = async () => {
    const cleanedData = Object.fromEntries(
    Object.entries(userInfo).filter(([_, value]) => value !== '')
  );  
    try {
    await axios.post('http://localhost:329/web/api/survey', cleanedData, {
      withCredentials: true  // 세션 사용 시 필수
    });
    console.log('설문 수정 완료:', userInfo);
    navigate('/mypage');
  } catch (err) {
    console.error('설문 수정 실패:', err);
    alert('정보 수정 중 오류가 발생했습니다.');
  }
};

=======
  // 5) 저장
  const handleSave = () => {
    console.log('수정된 정보 저장:', userInfo);
    navigate('/mypage');
  };
>>>>>>> d4e5c1739ddd9750ba78c470e6f94b009e5a4209

  return (
    <PageWrapper>
      <div className="profile-edit-container">

        {/* 프로필 헤더 */}
        <div className="profile-header">
          <div className="image-container">
            <label htmlFor="profileImageInput">
              <img
                src={previewImage}
                alt="프로필"
                className="profile-img"
              />
              <div className="image-hover-overlay">사진 변경하기</div>
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <div className="basic-info-card">
            <p>이름: {user.name}</p>
            <p>
              성별:{' '}
              {user.gender === 'M'
                ? '남성'
                : user.gender === 'F'
                ? '여성'
                : '미설정'}
            </p>
            <p>생년월일: {user.birthdate}</p>
          </div>
        </div>

        {/* 신체 정보 & 설문 */}
        <div className={`body-info-card ${hasSurvey ? '' : 'blurred'}`}>
          <h3>신체 정보</h3>

          {/* 키/몸무게/목표몸무게 */}
          <div className="field-group">
            <label>키 (cm)</label>
            <input
              name="height"
              type="number"
              value={userInfo.height}
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <label>몸무게 (kg)</label>
            <input
              name="weight"
              type="number"
              value={userInfo.weight}
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <label>목표 몸무게 (kg)</label>
            <input
              name="goalWeight"
              type="number"
              value={userInfo.goalWeight}
              onChange={handleInputChange}
            />
          </div>

          {/* 이하 설문 라디오 그룹 */}
          <fieldset className="field-group">
            <legend>활동 수준은 어떠신가요?</legend>
            <div className="radio-group">
              {[
                '하루 종일 책상 앞에 앉아 있습니다.',
                '가끔 운동하거나 30분 산책을 합니다.',
                '매일 한 시간 이상 운동을 합니다.',
                '운동을 좋아하고 더 운동하고 싶습니다.'
              ].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="activityLevel"
                    value={val}
                    checked={userInfo.activityLevel === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>한번에 팔굽혀펴기 몇 개까지 가능하세요?</legend>
            <div className="radio-group">
              {[
                '훌륭한 (56개 이상)',
                '좋은 (47개~56개)',
                '평균 이상 (35개~46개)',
                '평균 (19개~34개)',
                '평균 이하 (11개~18개)',
                '나쁨 (10개~4개)',
                '매우 나쁨 (4개 이하)'
              ].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="pushup"
                    value={val}
                    checked={userInfo.pushup === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>한번에 플랭크 몇 분까지 가능하세요?</legend>
            <div className="radio-group">
              {[
                '훌륭한 (6분 이상)',
                '좋은 (4분~6분)',
                '평균 이상 (3분~4분)',
                '평균 (1분~3분)',
                '평균 이하 (30초~60초)',
                '나쁨 (15초~30초)',
                '매우 나쁨 (15초 이하)'
              ].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="plank"
                    value={val}
                    checked={userInfo.plank === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>한번에 스쿼트 몇 번까지 가능하세요?</legend>
            <div className="radio-group">
              {[
                '훌륭한 (49개 이상)',
                '좋은 (44개~49개)',
                '평균 이상 (39개~43개)',
                '평균 (35개~38개)',
                '평균 이하 (31개~34개)',
                '나쁨 (25개~30개)',
                '매우 나쁨 (25개 이하)'
              ].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="squat"
                    value={val}
                    checked={userInfo.squat === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>앉은 자세에서 얼마나 앞으로 구부릴 수 있나요?</legend>
            <div className="radio-group">
              {[
                '발끝에 안닿음',
                '발끝에 닿음',
                '발끝을 조금 넘어감',
                '발끝을 많이 넘어감'
              ].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="flexibility"
                    value={val}
                    checked={userInfo.flexibility === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>얼마나 자주 운동할 생각인가요?</legend>
            <div className="radio-group">
              {['주1회','주2회','주3회','주4회','주5회','주6회','주7회'].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name="workoutFrequency"
                    value={val}
                    checked={userInfo.workoutFrequency === val}
                    onChange={handleInputChange}
                  />
                  {val}
                </label>
              ))}
            </div>
          </fieldset>

          {!hasSurvey && (
            <div className="overlay-message">
              설문조사가 필요한 기능입니다.
            </div>
          )}
        </div>

        <button className="save-button" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </PageWrapper>
  );
};

export default ProfileEditPage;
