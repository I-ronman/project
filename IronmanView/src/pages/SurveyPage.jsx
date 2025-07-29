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

// import StepGoal from '../components/survey/StepGoal'; // 제거된 경우

 import '../styles/SurveyPage.css';

function SurveyPage() {
  const [step, setStep] = useState(0);
  const totalSteps = 11;
  const navigate = useNavigate();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState(weight);
  const [activity, setActivity] = useState('');
  const [pushupLevel, setPushupLevel] = useState('');
  const [plankTime, setPlankTime] = useState('');
  const [squatLevel, setSquatLevel] = useState('');
  const [flexibility, setFlexibility] = useState('');
  const [workoutFrequency, setWorkoutFrequency] = useState('');

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const stepComponents = [
    <StepIntro nextStep={nextStep} />,
    <Step1 height={height} setHeight={setHeight} nextStep={nextStep} />,
    <Step2 height={height} weight={weight} setWeight={setWeight} nextStep={nextStep} />,
    <Step3 weight={weight} goalWeight={goalWeight} setGoalWeight={setGoalWeight} nextStep={nextStep} />,
    <Step4 activity={activity} setActivity={setActivity} nextStep={nextStep} />,
    <Step5 pushupLevel={pushupLevel} setPushupLevel={setPushupLevel} nextStep={nextStep} />,
    <Step6 plankTime={plankTime} setPlankTime={setPlankTime} nextStep={nextStep} />,
    <Step7 squatLevel={squatLevel} setSquatLevel={setSquatLevel} nextStep={nextStep} />,
    <Step8 flexibility={flexibility} setFlexibility={setFlexibility} nextStep={nextStep} />,
    <Step9 workoutFrequency={workoutFrequency} setWorkoutFrequency={setWorkoutFrequency} nextStep={nextStep} />,
    <StepFinal
      height={height}
      weight={weight}
      goalWeight={goalWeight}
      activity={activity}
      pushupLevel={pushupLevel}
      plankTime={plankTime}
      squatLevel={squatLevel}
      flexibility={flexibility}
      workoutFrequency={workoutFrequency}
    />
  ];

  return (
  <div className="survey-wrapper">
    {step > 0 && (
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    )}

    <header className="survey-header">
      <span className="back-button" onClick={prevStep}>←</span>
      <span className="header-title">설문 조사</span>
      <span className="right-label">이모티콘</span>
    </header>

    <div className="survey-content">
      {stepComponents[step] || null}
    </div>
  </div>
);

}

export default SurveyPage;
