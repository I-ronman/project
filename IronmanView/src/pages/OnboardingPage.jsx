import React, { useState } from 'react';
import '../styles/OnboardingPage.css';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: "무슨 운동부터 어떻게 해야 하지?",
    highlight: "나에게 맞는",
    highlight2: "홈트 운동 루틴",
    desc: [
      "운동 시작이 어려운 당신에게",
      "AI가 적합한 루틴을 추천해줘요."
    ],
    image: "/images/explanation1.jpg"
  },
  {
    title: "내 자세가 정확한건가?",
    highlight: "실시간으로 알려주는",
    highlight2: "음성 자세 교정",
    desc: [
      "카메라로 자세를 분석하고",
      "음성으로 교정 피드백을 드려요."
    ],
    image: "/images/correction.jpg"
  },
  {
    title: "누군가 옆에서 도와주면 좋겠어",
    highlight: "목표를 함께 달성하는",
    highlight2: "AI 운동 코치",
    desc: [
      "혼자 운동이 힘든 당신을 위해",
      "AI가 실시간 코치처럼 도와줘요."
    ],
    image: "/images/chat.jpg"
  },
  {
    title: "당신이 가장 자주 사용하고싶은 서비스는?",
    highlight: "당신의 선택에 맞춘",
    highlight2: "화면을 제공합니다.",
    desc: ["*동시 선택 가능"],
    multiChoice: true,
    options: [
      {
        label: "운동 루틴 추천",
        details: [
          "• 설문 조사로 사용자의 데이터를 수집",
          "• 챗봇을 통해 세세한 수정 가능"
        ]
      },
      {
        label: "실시간 자세 교정",
        details: [
          "• 운동 자세를 카메라로 촬영하여 실시간 교정",
          "• 음성 피드백으로 화면을 안 봐도 교정 가능"
        ]
      },
      {
        label: "챗봇 서비스",
        details: [
          "• 건강 관련 질문에 대해 실시간 응답",
          "• 비운동 주제는 제한될 수 있음"
        ]
      }
    ],
    image: "/images/services.jpg"
  }
];

function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const current = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      fetch('http://localhost:5000/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: selected })
      })
        .then(() => {
          localStorage.setItem('firstLogin', 'false');
          navigate('/');
        })
        .catch((err) => console.error(err));
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const toggleSelect = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-container">
        <h2>{current.title}</h2>
        <h1>
          {current.highlight} <br />
          <span>{current.highlight2}</span>
        </h1>

        {current.image && (
          <img src={current.image} alt="slide" className="onboarding-image" />
        )}

        {current.multiChoice ? (
          <div className="onboarding-options">
            {current.options.map((opt, idx) => (
              <div
                key={idx}
                className={`option-box ${selected.includes(opt.label) ? 'selected' : ''}`}
                onClick={() => toggleSelect(opt.label)}
              >
                <strong>{opt.label}</strong>
                {opt.details.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="onboarding-desc">
            {current.desc.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <div className="onboarding-footer">
          <div className="dots">
            {slides.map((_, i) => (
              <span key={i} className={i === currentSlide ? 'active' : ''}></span>
            ))}
          </div>
          <button className="next-btn" onClick={nextSlide}>
            {currentSlide === slides.length - 1 ? '선택 완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
