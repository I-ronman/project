import React, { useState } from 'react';
import '../styles/EnvironmentSettingPage.css';
import PageWrapper from '../layouts/PageWrapper';

const EnvironmentSettingPage = () => {
  const [voiceGuide, setVoiceGuide] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(78);
  const [notifications, setNotifications] = useState(true);

  return (
    <PageWrapper>
      <div className='env-wrapper'>
        <h2 className="env-title">환경 설정</h2>

        <div className="env-setting">
          <span>음성 안내</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={voiceGuide}
              onChange={() => setVoiceGuide(!voiceGuide)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="env-setting">
          <span>음성크기</span>
          <input
            type="range"
            min="0"
            max="100"
            value={voiceVolume}
            onChange={(e) => setVoiceVolume(e.target.value)}
            className="volume-slider"
          />
          <span className="volume-number">{voiceVolume}</span>
        </div>

        <div className="env-setting">
          <span>알림</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EnvironmentSettingPage;
