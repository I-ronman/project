// project/IronmanView/src/pages/BoardWritePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BoardWritePage.css';

const BoardWritePage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    // TODO: 실제 백엔드 연동
    // axios.post('/api/posts', formData);

    alert('게시글이 작성되었습니다!');
    navigate('/board'); // 완료 후 커뮤니티로 이동
  };

  return (
    <div className="write-container">
      <h2 className="write-title">📝 게시글 작성</h2>
      <form className="write-form" onSubmit={handleSubmit}>
        <textarea
          className="write-textarea"
          placeholder="게시글 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="media-inputs">
          <label className="upload-label">
            이미지 업로드
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              disabled={imageFile !== null}
            />
          </label>

          <label className="upload-label">
            동영상 업로드
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              disabled={videoFile !== null}
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">작성 완료</button>
      </form>
    </div>
  );
};

export default BoardWritePage;
