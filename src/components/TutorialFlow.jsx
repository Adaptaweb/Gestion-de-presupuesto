import { useState, useEffect } from 'react';
import StepInicio from './tutorial/StepInicio';
import Step1 from './tutorial/Step1';
import StepOpcional from './tutorial/StepOpcional';
import Step2 from './tutorial/Step2';
import Step3 from './tutorial/Step3';

const TutorialFlow = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [animClass, setAnimClass] = useState('');
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

  const goNext = () => {
    setDirection('forward');
    setAnimClass('animate-in fade-in slide-in-from-right-4 duration-300');
    setStep(s => Math.min(s + 1, 3));
  };

  const goBack = () => {
    if (step > 0) {
      setDirection('back');
      setAnimClass('animate-in fade-in slide-in-from-left-4 duration-300');
      setStep(s => s - 1);
    } else {
      onClose();
    }
  };

  const goToOpcional = () => {
    setDirection('forward');
    setAnimClass('animate-in fade-in slide-in-from-right-4 duration-300');
    setStep(1.5);
  };

  const goFromOpcionalToStep2 = () => {
    setDirection('forward');
    setAnimClass('animate-in fade-in slide-in-from-right-4 duration-300');
    setStep(2);
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
    if (step === 0) return <StepInicio onNext={goNext} onClose={onClose} />;
    if (step === 1) return <Step1 {...sharedProps} onNext={goNext} onOpcional={goToOpcional} onBack={goBack} />;
    if (step === 1.5) return <StepOpcional {...sharedProps} onNext={goFromOpcionalToStep2} onBack={() => { setDirection('back'); setAnimClass('animate-in fade-in slide-in-from-left-4 duration-300'); setStep(1); }} />;
    if (step === 2) return <Step2 {...sharedProps} onNext={goNext} onBack={goBack} />;
    if (step === 3) return <Step3 {...sharedProps} onNext={onClose} onBack={goBack} />;
    return null;
  };

  return (
    <div key={step} className={`h-full ${animClass}`}>
      {renderStep()}
    </div>
  );
};

export default TutorialFlow;
