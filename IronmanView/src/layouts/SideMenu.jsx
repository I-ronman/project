import React from 'react';
import ReactDOM from 'react-dom';
import './SideMenu.css';

const SideMenu = ({ navigate, onClose }) => {
  return ReactDOM.createPortal(
    <div className="side-menu"></div>,
    document.body
  );
};

export default SideMenu;
