import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BoardPage.css';

const dummyPosts = [
  {
    id: 1,
    author: '홍길동',
    content: '오늘 운동 완전 힘들었어요 💪',
    imageUrl: '/images/dummy1.jpg',
  },
  {
    id: 2,
    author: '김철수',
    content: '루틴 추천받고 운동했더니 좋아졌어요!',
    imageUrl: '/images/dummy2.jpg',
  },
];

const CURRENT_USER = '홍길동'; // ✅ 추후 로그인 사용자와 연동

const BoardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(dummyPosts);
  }, []);

  useEffect(() => {
    if (location.state?.newPost) {
      setPosts(prev => [location.state.newPost, ...prev]);
    }
  }, [location.state]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  return (
    <div className="board-container">
      <h2 className="board-title">📌 커뮤니티 게시판(아이콘 나중에 수정하자)</h2>

      <div className="board-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div onClick={() => navigate(`/post/${post.id}`)}>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="post" className="post-img" />
              )}
              <div className="post-content">{post.content}</div>
            </div>

            {/* ✨ 본인 글이면 수정/삭제 표시 */}
            {post.author === CURRENT_USER && (
              <div className="post-actions-inline">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${post.id}`, { state: { post } })}
                >
                  ✏️ 수정
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  🗑 삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="floating-write-button"
        onClick={() => navigate('/write')}
      >
        <div>✏️</div>
        <span className="write-label">게시글 작성하기</span>
      </button>
    </div>
  );
};

export default BoardPage;
