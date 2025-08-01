import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardWritePage.css'; // 기존 글쓰기 스타일 재활용

const EditPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const originalPost = location.state?.post;

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  useEffect(() => {
    if (!originalPost) {
      alert('잘못된 접근입니다.');
      navigate('/board');
      return;
    }

    setContent(originalPost.content || '');
  }, [originalPost, navigate]);

  const handleUpdatePost = async () => {
    const formData = new FormData();
    formData.append('content', content);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (removeImage) {
      formData.append('removeImage', 'true');
    }

    if (videoFile) {
      formData.append('video', videoFile);
    } else if (removeVideo) {
      formData.append('removeVideo', 'true');
    }

    try {
      // 백엔드 수정 요청
      await axios.patch(`http://localhost:329/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/board');
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  return (
    <div className="write-container">
      <h2 className="write-title">✏️ 게시글 수정</h2>

      <textarea
        className="write-textarea"
        placeholder="게시글 내용을 수정하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 기존 이미지 */}
      {!removeImage && originalPost?.imageUrl && !imageFile && (
        <div className="file-preview">
          <img src={originalPost.imageUrl} alt="기존 이미지" className="preview-img" />
          <button className="remove-btn" onClick={() => setRemoveImage(true)}>이미지 제거</button>
        </div>
      )}

      {/* 새 이미지 업로드 */}
      <div className="file-section">
        <label className="file-label">이미지 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* 기존 동영상 */}
      {!removeVideo && originalPost?.videoUrl && !videoFile && (
        <div className="file-preview">
          <video src={originalPost.videoUrl} controls className="preview-video" />
          <button className="remove-btn" onClick={() => setRemoveVideo(true)}>동영상 제거</button>
        </div>
      )}

      {/* 새 동영상 업로드 */}
      <div className="file-section">
        <label className="file-label">동영상 업로드</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
      </div>

      <button className="submit-btn" onClick={handleUpdatePost}>
        수정 완료
      </button>
    </div>
  );
};

export default EditPostPage;
