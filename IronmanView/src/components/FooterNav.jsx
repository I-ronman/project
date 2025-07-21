// src/components/FooterNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart, ClipboardCheck, Calendar, User } from 'lucide-react';

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black text-white flex justify-around py-2">
      <button onClick={() => navigate('/home')}>
        <Home className="mx-auto" />
      </button>
      <button onClick={() => navigate('/stats')}>
        <BarChart className="mx-auto" />
      </button>
      <button onClick={() => navigate('/routine')}>
        <ClipboardCheck className="mx-auto" />
      </button>
      <button onClick={() => navigate('/calendar')}>
        <Calendar className="mx-auto" />
      </button>
      <button onClick={() => navigate('/profile')}>
        <User className="mx-auto" />
      </button>
    </nav>
  );
};

export default FooterNav;
