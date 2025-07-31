// project/IronmanView/src/layouts/AppLayout.jsx
import './AppLayout.css';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // 페이지 내용 자리
import Header from './Header';



const AppLayout = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup', '/onboarding', '/survey']
  
  const description = getPageDescription(location.pathname);

  return (
    <div className="app-layout">
      
      <div className="left-panel">
        <div className="branding">
          <span className='text-3d-smalltitle'>team:</span>
          <h1 className="text-3d-title">Ironman</h1>
          <span className="text-3d-content">AI 홈 트레이닝 서비스</span>
        </div>
      </div>
      <div className="right-panel">
        <div className="right-content">
          {!hideHeaderPaths.includes(location.pathname) && <Header />}
          {description && <div className="page-description">{description}</div>}
          <Outlet />  {/* 페이지 콘텐츠 자리 */}
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
    default:
      return '';
  }
};

export default AppLayout;
