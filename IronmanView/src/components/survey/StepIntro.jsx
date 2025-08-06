import React from 'react';
import './StepIntro.css'

const StepIntro = ({ nextStep }) => (
  <>
    <img src="/images/coach.jpg" alt="코치" className="coach-img" />
    <h2 className="intro-title">안녕하세요!</h2>
    <p className="intro-description">
      저는 당신의 개인 코치입니다.<br />
      당신에게 맞는 <strong>맞춤형 루틴</strong>을 추천하기 위해<br />
      몇 가지 질문을 드릴게요.
    </p>
    <button className="ready-button" onClick={nextStep}>준비 완료</button>
  </>
);

export default StepIntro;
