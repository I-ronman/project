import React, { useState } from 'react';
import './Step3.css';

const Step3 = ({ weight, goalWeight, setGoalWeight, nextStep }) => {
  const parsedWeight = parseFloat(weight);
  const [inputValue, setInputValue] = useState(parseFloat(goalWeight) || parsedWeight);

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setInputValue(value);
      setGoalWeight(value);
    }
  };

  const diff = inputValue - parsedWeight;
  const diffRate = Math.abs(diff / parsedWeight) * 100;
  const direction = diff > 0 ? '증강' : '감량';
  const diffText = diff !== 0 ? `${Math.abs(diff).toFixed(1)}kg ${direction}` : '';

  let feedback = '';
  let detailMessage = '';

  if (diff === 0) {
    feedback = '현재 체중 그대로 진행합니다.';
    detailMessage = '본인의 현재 체중으로 계속 진행하겠습니다.';
  } else if (diffRate <= 5) {
    feedback = '합리적인 목표예요!';
    detailMessage = '적당한 체중 변화도 큰 차이를 만들 수 있습니다.';
  } else if (diffRate <= 10) {
    feedback = '탁월한 선택입니다!';
    detailMessage = '신체 구성과 체형에 긍정적인 변화를 기대할 수 있습니다.';
  } else {
    feedback = '도전적인 목표!';
    detailMessage = '큰 변화는 강한 동기부여가 됩니다. 목표를 향해 나아가세요!';
  }

  return (
    <div className="survey-step">
      <h3 className="survey-title">
        당신의 <span style={{ color: '#b0ff3c' }}>목표 몸무게</span>는 무엇인가요?
      </h3>

      {/* 체중 입력과 기준 체중 표시 */}
      <div className="goal-weight-display-wrapper">
        {diff < 0 && (
          <span className="original-weight left">◀ {parsedWeight.toFixed(1)}kg </span>
        )}
        <div className="goal-weight-display">
          <input
            type="number"
            step="0.1"
            value={inputValue}
            onChange={handleChange}
            className="weight-input"
          />
          
          <span style={{ fontSize: '24px', color: '#fff' }}>kg</span>
        </div>
        {diff > 0 && (
          <span className="original-weight right">{parsedWeight.toFixed(1)}kg ▶</span>
        )}
      </div>

      {/* 메시지 출력 */}
      <div className="bmi-box" style={{ marginTop: '20px' }}>
        <div className="bmi-status-message" style={{ fontSize: '16px', lineHeight: '1.6', color: '#fff' }}>
          {feedback}
        </div>
        <div className="bmi-tip-message" style={{ marginTop: '5px', fontSize: '14px', color: '#bbb' }}>
          {diff !== 0 && (
            <>
              체중의 <strong>{diffText}</strong> 합니다.
              <br />
            </>
          )}
          {detailMessage}
        </div>
      </div>

      <button
        className="survey-button"
        onClick={nextStep}
        disabled={!inputValue}
        style={{ marginTop: '30px' }}
      >
        다음
      </button>
    </div>
  );
};

export default Step3;
