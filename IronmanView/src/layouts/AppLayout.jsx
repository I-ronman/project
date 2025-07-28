// AppLayout.jsx
import './AppLayout.css';
import { Outlet } from 'react-router-dom'; // 페이지 내용 자리

const AppLayout = () => {
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
        <Outlet /> {/* 페이지 콘텐츠 자리 */}
      </div>
    </div>
  );
};

export default AppLayout;
