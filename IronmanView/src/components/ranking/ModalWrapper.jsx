import React from 'react';
import './ModalWrapper.css';
import { useNavigate } from 'react-router-dom';

export default function ModalWrapper({ children }) {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={close}>
          닫기
        </button>
      </div>
    </div>
  );
}
