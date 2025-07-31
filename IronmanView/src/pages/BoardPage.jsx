import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BoardPage.css';

const dummyPosts = [
  {
    id: 1,
    author: '홍길동',
    content: '오늘 운동 완전 힘들었어요 💪',
    imageUrl: '/images/dummy1.jpg',
    videoUrl: '/videos/dummy1.mp4',
  },
];

const BoardPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 실제 API 대체용 더미데이터
    setPosts(dummyPosts);
  }, []);

  return (
    <div className="board-wrapper">
      <h2 className="board-title">📌 커뮤니티 게시판</h2>
      <div className="board-list">
        {posts.map(post => (
          <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
            {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-img" />}
            <div className="post-content">{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
