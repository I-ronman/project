import './AppLayout.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { FaArrowLeft } from 'react-icons/fa'

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeaderPaths = ['/login', '/signup', '/onboarding', '/survey'];
  const hideBackButtonPaths = ['/main']; // 뒤로가기 숨길 경로

  const description = getPageDescription(location.pathname);

  const handleBack = () => {
    navigate(-1); // 브라우저 히스토리 뒤로가기
  };

  return (
    <div className="app-layout">
      {/* <div className="left-panel">
        <div className="branding">
          <span className='text-3d-smalltitle'>team:</span>
          <h1 className="text-3d-title">Ironman</h1>
          <span className="text-3d-content">AI 홈 트레이닝 서비스</span>
        </div>
      </div> */}

      <div className="right-panel">
        <div className="right-content">
          {!hideHeaderPaths.includes(location.pathname) && <Header />}

          {!hideHeaderPaths.includes(location.pathname) && (
            <div className="page-description">
              {/* 뒤로가기 버튼은 /main 페이지에서는 숨김 */}
              {!hideBackButtonPaths.includes(location.pathname) && (
                <button className="back-btn" onClick={handleBack}>
                  <FaArrowLeft className="back-icon" />
                  <span>뒤로가기</span>
                </button>
              )}
              <span>{description}</span>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

const getPageDescription = (path) => {
  switch (path) {
    case '/routine':
      return '운동하기';
    case '/schedulepage':
      return '스케쥴';
    case '/statistics':
      return '통계';
    case '/chatbot':
      return '챗봇';
    case '/board':
      return '커뮤니티';
    case '/settings':
      return '환경 설정';
    case '/routinedetail':
      return '루틴 수정';
    case '/mypage':
      return '마이페이지';
    case '/profile-edit':
      return '프로필 수정';
    case '/main':
      return '메인화면';
    case '/write':
      return '게시글 작성하기'
    case '/workoutresult':
      return '운동 결과'
    case '/posture-feedback':
      return '자세확인 페이지'
    case '/ranking':
      return '랭킹'
    default:
      if (path.startsWith('/edit/')) return '게시글 수정페이지';
      return '';
  }
};

export default AppLayout;
