import React, { useState, useEffect } from 'react';
import '../styles/ProfileEditPage.css';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage = () => {
  const navigate = useNavigate();

  // 초기 사용자 정보 (예시)
  const [userInfo, setUserInfo] = useState({
    profileImage: '/default_profile.jpg',
    name: '홍길동',
    gender: '여성',
    height: '',
    weight: '',
    goalWeight: '',
    pushup: '',
    plank: '',
    squat: '',
    flexibility: '',
    workoutFrequency: '',
  });

  const [hasSurvey, setHasSurvey] = useState(false); // 설문 여부 플래그
  const [previewImage, setPreviewImage] = useState(userInfo.profileImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('수정된 정보 저장:', userInfo);
    navigate('/mypage'); // 저장 후 마이페이지로 이동
  };

  return (
    <div className="edit-container">
      <h2 className="edit-title">프로필 수정</h2>

      <div className="edit-profile-section">
        <label htmlFor="profileImage" className="profile-image-label">
          <img src={previewImage} alt="프로필 이미지" className="edit-profile-img" />
        </label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <div className="profile-basic-info">
          <p className="read-only-text">이름: {userInfo.name}</p>
          <p className="read-only-text">성별: {userInfo.gender}</p>
        </div>
      </div>

      <div className={`body-info-section ${hasSurvey ? '' : 'blurred'}`}>
        <h3>신체 정보</h3>
        <div className="edit-form-group">
          <label>키 (cm)</label>
          <input name="height" value={userInfo.height} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>몸무게 (kg)</label>
          <input name="weight" value={userInfo.weight} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>목표 몸무게 (kg)</label>
          <input name="goalWeight" value={userInfo.goalWeight} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>팔굽혀펴기 가능 횟수</label>
          <input name="pushup" value={userInfo.pushup} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>플랭크 가능 시간 (초)</label>
          <input name="plank" value={userInfo.plank} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>스쿼트 가능 횟수</label>
          <input name="squat" value={userInfo.squat} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>유연성 (cm)</label>
          <input name="flexibility" value={userInfo.flexibility} onChange={handleInputChange} />
        </div>
        <div className="edit-form-group">
          <label>주간 운동 빈도 (회)</label>
          <input name="workoutFrequency" value={userInfo.workoutFrequency} onChange={handleInputChange} />
        </div>
        {!hasSurvey && (
          <div className="overlay-message">
            설문조사가 필요한 기능입니다.
          </div>
        )}
      </div>

      <button className="save-btn" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
};

export default ProfileEditPage;
