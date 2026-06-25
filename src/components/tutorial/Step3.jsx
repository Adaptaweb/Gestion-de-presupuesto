import { CheckCircle, Info } from 'lucide-react';
import TopAppBar from './TopAppBar';
import Stepper from './Stepper';
import BottomNav from './BottomNav';
import { TUTORIAL_CONFIG } from './tutorialConfig';

const Step3 = ({ onNext, onBack, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;

  const handleFinish = () => {
    if (onNext) {
      onNext();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopAppBar onBack={onBack} onClose={onClose} />

      <Stepper current={4} />

      <main className="px-4 max-w-[1200px] mx-auto pb-32">
        <div className="mb-6 bg-[#6de0b3]/10 border border-[#2dbc8b]/20 rounded-xl p-4 flex items-center gap-3 animate-pulse justify-center border-l-4">
          <CheckCircle className="text-[#006c4d]" size={24} />
          <span className="text-[14px] leading-5 font-semibold text-[#006c4d]">
            {MESSAGES.step3.successTitle}
          </span>
        </div>

        <div className="bg-[#d2e0fe] text-[#55637d] p-6 rounded-xl mb-8 border border-[#2dbc8b]/10">
          <div className="flex items-center gap-2 mb-2">
            <Info className="text-[#006c4d]" size={24} />
            <h2 className="text-[24px] leading-8 font-semibold text-[#0a192f] tracking-tight">
              {MESSAGES.step3.infoTitle}
            </h2>
          </div>
          <p className="text-[14px] leading-5 opacity-90">
            {MESSAGES.step3.infoDescription}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[#515f78] text-[16px] leading-6 mb-6">
            Tu regla de reenvío está configurada. A partir de ahora, los correos bancarios que recibas se sincronizarán automáticamente con {TUTORIAL_CONFIG.APP_NAME}.
          </p>
        </div>
      </main>

      <BottomNav
        nextLabel={MESSAGES.step3.closeButton}
        onNext={handleFinish}
        onPrev={onBack}
      />
    </div>
  );
};

export default Step3;
