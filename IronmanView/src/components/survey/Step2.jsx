import React, { useState } from 'react';
import './Step2.css';

const Step2 = ({ height, weight, setWeight, nextStep }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setWeight(value);
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    return h && w ? (w / (h * h)).toFixed(1) : '';
  };

  const bmi = calculateBMI();

  let bmiCategory = '';
  let bmiColor = '';

  if (bmi) {
    const num = parseFloat(bmi);
    if (num < 18.5) {
      bmiCategory = '저체중';
      bmiColor = 'blue';
    } else if (num < 25) {
      bmiCategory = '정상';
      bmiColor = 'green';
    } else if (num < 30) {
      bmiCategory = '과체중';
      bmiColor = 'orange';
    } else {
      bmiCategory = '비만';
      bmiColor = 'red';
    }
  }

  return (
    <div className="survey-step">
      <h3 className="survey-title">현재 체중이 얼마인가요?</h3>
      <div className="survey-input-group">
        <input
          type="text"
          value={weight}
          onChange={handleChange}
          className="survey-input"
          placeholder="체중을 입력하세요"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = '체중을 입력하세요')}
        />
        <span className="unit">kg</span>
      </div>

      <div className="bmi-box">
        {bmi ? (
            <>
             <div className="bmi-score">
               <span style={{ color: bmiColor }}>{bmi}</span>
               <span style={{ fontSize: '18px', marginLeft: '8px' }}>BMI</span>
               <span
                 className="info-icon"
                 onMouseEnter={() => setShowInfo(true)}
                 onMouseLeave={() => setShowInfo(false)}
                >ⓘ</span>
              </div>
            {showInfo && (
             <div className="bmi-tooltip">
                 BMI는 키와 몸무게를 기준으로<br />
                체중 상태를 나타내는 지표예요.
             </div>
            )}
            <div className="bmi-labels">
             </div>
             <div className="bmi-status" style={{ color: bmiColor }}>
                {bmiCategory}
             </div>

             <div className="bmi-tip-message">
              {bmiCategory === '저체중' && (
                <>
                  더 나은 체형을 만들 수 있는 큰 잠재력이 있어요.<br />
                  지금부터 시작하세요!
                </>
              )}
              {bmiCategory === '정상' && (
                <>
                  아주 좋아요!<br />
                  지금처럼 꾸준히 건강을 관리해보세요.
                </>
              )}
              {bmiCategory === '과체중' && (
                <>
                  조금만 더 노력하면 건강한 체형을 만들 수 있어요.<br />
                  함께 해봐요!
                </>
              )}
              {bmiCategory === '비만' && (
                <>
                  지금부터 시작해도 늦지 않아요.<br />
                  건강한 변화, 함께 시작해요!
                </>
              )}
            </div>
            
            </>
         ) : (
            // BMI가 없을 때: 빈 div들만 유지해서 박스는 보이되 내용은 없음
            <>
              <div className="bmi-score" style={{ height: '24px' }}></div>
              <div className="bmi-labels" style={{ height: '20px' }}></div>
              <div className="bmi-status" style={{ height: '20px' }}></div>
            </>
        )}
      </div>

      <button
        className="survey-button"
        onClick={nextStep}
        disabled={!weight}
      >
        다음
      </button>
    </div>
  );
};

export default Step2;
