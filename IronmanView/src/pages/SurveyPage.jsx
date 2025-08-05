// project/IronmanView/src/pages/SurveyPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIntro from '../components/survey/StepIntro';
import Step1 from '../components/survey/Step1';
import Step2 from '../components/survey/Step2';
import Step3 from '../components/survey/Step3';
import Step4 from '../components/survey/Step4';
import Step5 from '../components/survey/Step5';
import Step6 from '../components/survey/Step6';
import Step7 from '../components/survey/Step7';
import Step8 from '../components/survey/Step8';
import Step9 from '../components/survey/Step9';
import StepFinal from '../components/survey/StepFinal';
import PageWrapper from '../layouts/PageWrapper';

// import StepGoal from '../components/survey/StepGoal'; // 제거된 경우

 import '../styles/SurveyPage.css';

function SurveyPage() {
  const [step, setStep] = useState(0);
  const totalSteps = 11;
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({
    height: '',
    weight: '',
    goalWeight: '',
    activityLevel: '',
    pushUp: '',
    plank: '',
    squat: '',
    pliability: '',
    workoutFrequency: ''
  });

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const stepComponents = [
    <StepIntro nextStep={nextStep} />,
    <Step1
      height={surveyData.height}
      setHeight={(val) => setSurveyData(prev => ({ ...prev, height: val }))}
      nextStep={nextStep}
    />,
    <Step2
      height={surveyData.height}
      weight={surveyData.weight}
      setWeight={(val) => setSurveyData(prev => ({ ...prev, weight: val }))}
      nextStep={nextStep}
    />,
    <Step3
      weight={surveyData.weight}
      goalWeight={surveyData.goalWeight}
      setGoalWeight={(val) => setSurveyData(prev => ({ ...prev, goalWeight: val }))}
      nextStep={nextStep}
    />,
    <Step4
      activity={surveyData.activityLevel}
      setActivity={(val) => setSurveyData(prev => ({ ...prev, activityLevel: val }))}
      nextStep={nextStep}
    />,
    <Step5
      pushupLevel={surveyData.pushUp}
      setPushupLevel={(val) => setSurveyData(prev => ({ ...prev, pushUp: val }))}
      nextStep={nextStep}
    />,
    <Step6
      plankTime={surveyData.plank}
      setPlankTime={(val) => setSurveyData(prev => ({ ...prev, plank: val }))}
      nextStep={nextStep}
    />,
    <Step7
      squatLevel={surveyData.squat}
      setSquatLevel={(val) => setSurveyData(prev => ({ ...prev, squat: val }))}
      nextStep={nextStep}
    />,
    <Step8
      flexibility={surveyData.pliability}
      setFlexibility={(val) => setSurveyData(prev => ({ ...prev, pliability: val }))}
      nextStep={nextStep}
    />,
    <Step9
      workoutFrequency={surveyData.workoutFrequency}
      setWorkoutFrequency={(val) => setSurveyData(prev => ({ ...prev, workoutFrequency: val }))}
      nextStep={nextStep}
    />,
    <StepFinal
      surveyData={surveyData}
    />
  ];

  return (
  <PageWrapper>
    {step > 0 && (
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    )}

    <header className="survey-header">
      {step === 0 ? (
        <span className="survey-back-button" onClick={()=>navigate('/main')}>←</span>
      ):(
        <span className="survey-back-button" onClick={prevStep}>←</span>
      )}
      <span className="header-title">설문 조사</span>
      <img
        src="/images/ironman_logo.png"
        alt="메인으로"
        className="right-label"
        onClick={() => navigate('/main')}
        style={{
          height: '30px',
          cursor: 'pointer',
        }}
      />
    </header>

    <div className="survey-content">
      {stepComponents[step] || null}
    </div>
  </PageWrapper>
);

}

export default SurveyPage;
