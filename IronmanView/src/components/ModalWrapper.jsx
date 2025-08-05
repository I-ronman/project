// src/components/ModalWrapper.jsx
import React from 'react';

const ModalWrapper = ({ children }) => (
  <div className="modal-backdrop">
    <div className="modal-window">
      {children}
    </div>
  </div>
);

export default ModalWrapper;
