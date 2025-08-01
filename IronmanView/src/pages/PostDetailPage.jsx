import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 백엔드 연동 고려
import '../styles/PostDetailPage.css';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 실제 백엔드 연동 시:
        // const response = await axios.get(`/api/posts/${id}`);
        // setPost(response.data);
        // setComments(response.data.comments || []);
        // setLiked(response.data.liked);  // ← 사용자별 좋아요 여부

        const dummy = {
          id: 1,
          author: '홍길동',
          content: '오늘 운동 완전 힘들었어요 💪\n내일은 하체 루틴 가자!',
          imageUrl: '/images/dummy1.jpg',
          videoUrl: '/videos/video1.mp4',
          likes: 12,
          likedByUser: false,
          comments: ['멋져요!', '화이팅입니다 💪'],
        };

        setPost(dummy);
        setLiked(dummy.likedByUser);
        setComments(dummy.comments);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;

    const updatedLikes = liked ? post.likes - 1 : post.likes + 1;
    setLiked(!liked);
    setPost(prev => ({ ...prev, likes: updatedLikes }));

    try {
      // 실제 서버 연동
      // await axios.patch(`/api/posts/${id}/like`, { action: liked ? 'unlike' : 'like' });
    } catch (err) {
      console.error('좋아요 상태 변경 실패:', err);
    }
  };

  const handleAddComment = async () => {
    if (comment.trim() === '') return;

    const newComment = comment.trim();
    setComments(prev => [...prev, newComment]);
    setComment('');

    try {
      // await axios.post(`/api/posts/${id}/comments`, { content: newComment });
    } catch (err) {
      console.error('댓글 추가 실패:', err);
    }
  };

  if (!post) return <div className="detail-wrapper">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>

      <div className="post-detail-card">
        <h3>{post.author}님의 게시글</h3>

        {post.imageUrl && <img src={post.imageUrl} alt="post" className="detail-img" />}
        {post.videoUrl && <video src={post.videoUrl} controls className="detail-video" />}

        <div className="detail-content">
          {post.content.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="post-actions">
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            ❤️ 좋아요 {post.likes}
          </button>
        </div>

        <div className="comment-section">
          <h4>댓글</h4>
          <ul className="comment-list">
            {comments.length === 0 ? (
              <li className="empty-comment">댓글이 없습니다.</li>
            ) : (
              comments.map((c, i) => <li key={i}>{c}</li>)
            )}
          </ul>
          <div className="comment-input">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleAddComment}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};  

export default PostDetailPage;
