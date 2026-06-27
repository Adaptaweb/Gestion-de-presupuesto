import { useState, useEffect } from 'react';
import Welcome from './tutorial/Welcome';
import Step1 from './tutorial/Step1';
import StepOpcional from './tutorial/StepOpcional';
import Step2 from './tutorial/Step2';
import Step3 from './tutorial/Step3';

const TutorialFlow = ({ onClose, hasMailboxConfigured = false }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [animKey, setAnimKey] = useState(0);
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

  const getAnimClass = () => {
    if (direction === 'opcional') {
      return 'animate-slide-in-from-bottom';
    }
    return direction === 'forward'
      ? 'animate-slide-in-from-right'
      : 'animate-slide-in-from-left';
  };

  const goNext = () => {
    setDirection('forward');
    setAnimKey(k => k + 1);
    setStep(s => Math.min(s + 1, 3));
  };

  const goBack = () => {
    if (step > 0) {
      setDirection('back');
      setAnimKey(k => k + 1);
      setStep(s => s - 1);
    } else {
      onClose();
    }
  };

  const goToOpcional = () => {
    setDirection('opcional');
    setAnimKey(k => k + 1);
    setStep(1.5);
  };

  const goFromOpcionalToStep2 = () => {
    setDirection('forward');
    setAnimKey(k => k + 1);
    setStep(2);
  };

  const handleOpcionalBack = () => {
    setDirection('back');
    setAnimKey(k => k + 1);
    setStep(1);
  };

  if (loading) {
    return (
      <div className="h-full bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2dbc8b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sharedProps = { emailData, onClose };

  const renderStep = () => {
    if (step === 0) return <Welcome onNext={goNext} onClose={onClose} />;
    if (step === 1) return <Step1 {...sharedProps} onNext={goNext} onOpcional={goToOpcional} onBack={goBack} />;
    if (step === 1.5) return <StepOpcional {...sharedProps} onNext={goFromOpcionalToStep2} onBack={handleOpcionalBack} />;
    if (step === 2) return <Step2 {...sharedProps} onNext={goNext} onBack={goBack} />;
    if (step === 3) return <Step3 {...sharedProps} onNext={onClose} onBack={goBack} />;
    return null;
  };

  return (
    <div key={animKey} className={`h-full ${getAnimClass()}`}>
      {renderStep()}
    </div>
  );
};

export default TutorialFlow;
