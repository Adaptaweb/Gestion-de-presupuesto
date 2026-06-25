import { useState, useEffect } from 'react';
import Step1 from './tutorial/Step1';
import StepOpcional from './tutorial/StepOpcional';
import Step2 from './tutorial/Step2';
import Step3 from './tutorial/Step3';
import Step4 from './tutorial/Step4';

const TutorialFlow = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch('/api/user/mailbox', { headers })
      .then(res => res.json())
      .then(data => {
        setEmailData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      onBack();
    }
  };

  const handleOpcional = () => setStep(1.5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2dbc8b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sharedProps = {
    emailData,
    onClose: onBack,
  };

  if (step === 1) {
    return <Step1 {...sharedProps} onNext={handleNext} onOpcional={handleOpcional} />;
  }

  if (step === 1.5) {
    return <StepOpcional {...sharedProps} onNext={handleNext} onBack={() => setStep(1)} />;
  }

  if (step === 2) {
    return <Step2 {...sharedProps} onNext={handleNext} onBack={handleBack} />;
  }

  if (step === 3) {
    return <Step3 {...sharedProps} onNext={handleNext} onBack={handleBack} />;
  }

  if (step === 4) {
    return <Step4 {...sharedProps} onNext={onBack} onBack={handleBack} />;
  }

  return null;
};

export default TutorialFlow;
