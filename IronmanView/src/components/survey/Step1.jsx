// components/survey/Step1.jsx
import React, { useState } from 'react';
import './Step1.css';
import axios from 'axios';

const Step1 = ({ height, setHeight, nextStep }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 입력
    setHeight(value);
  };

  return (
    <div className="survey-step">
      <h3 className="survey-title">당신의 키는?</h3>
      <div className="survey-input-group">
        <input
          type="text"
          value={height}
          onChange={handleChange}
          className="survey-input"
          placeholder="키를 입력하세요"
          maxLength={3}
        />
        <span className="unit">cm</span>
      </div>
      <button
        className="survey-button"
        onClick={nextStep}
        disabled={!height}
      >
        다음
      </button>
    </div>
  );
};

export default Step1;
