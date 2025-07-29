// project/IronmanView/src/layouts/AppLayout.jsx
import './AppLayout.css';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // 페이지 내용 자리
import Header from './Header';



const AppLayout = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup', '/onboarding']
  
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
      return '오늘의 루틴을 확인하고 시작하세요';
    case '/survey':
      return '설문조사로 운동 목표를 설정하세요';
    case '/training':
      return '운동을 시작해보세요';
    case '/search':
      return '운동을 선택해 루틴을 구성하세요';
    default:
      return '';
  }
};

export default AppLayout;
