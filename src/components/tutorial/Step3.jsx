import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { TUTORIAL_CONFIG } from './tutorialConfig';

const Step3 = ({ onNext, onBack, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b border-[#f1f5f9]">
        <div className="h-14 flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
                <ArrowLeft className="text-[#006c4d]" size={24} />
              </button>
            )}
            <img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="w-6 h-6" />
            <span className="font-bold text-[#0a192f]">Kuentas Klaras</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#515f78]">3/3</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
            <X className="text-[#515f78]" size={24} />
          </button>
        </div>
        <div className="w-full bg-[#e6e8ea] h-1">
          <div className="h-full rounded-full bg-[#2dbc8b] transition-all duration-500" style={{ width: '100%' }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-[1200px] mx-auto w-full flex flex-col items-center justify-center">
        <div className="w-full mb-6 bg-[#6de0b3]/10 border border-[#2dbc8b]/20 rounded-xl p-4 flex items-center justify-center gap-3 border-l-4">
          <CheckCircle className="text-[#006c4d]" size={24} />
          <span className="text-sm font-semibold text-[#006c4d] text-center">{MESSAGES.step3.successTitle}</span>
        </div>

        <div className="w-full bg-[#d2e0fe] text-[#55637d] p-6 rounded-2xl flex flex-col items-center gap-4 border border-[#2dbc8b]/10 shadow-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <CheckCircle className="text-[#006c4d]" size={32} />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold text-[#0a192f] tracking-tight">{MESSAGES.step3.infoTitle}</h2>
            <p className="text-sm opacity-90 leading-relaxed max-w-md mx-auto">
              {MESSAGES.step3.infoDescription}
            </p>
          </div>
        </div>

        <div className="w-full bg-white p-4 rounded-2xl border border-[#bccac0]/30 flex flex-col items-center gap-3 mt-6 shadow-sm">
          <p className="text-sm text-[#515f78]">{MESSAGES.step3.finalMessage}</p>
        </div>
      </main>

      <footer className="flex-shrink-0 flex justify-center px-4 py-3 border-t border-[#f1f5f9]">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-8 py-3 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">{MESSAGES.step3.closeButton}</span>
          <X size={20} />
        </button>
      </footer>
    </div>
  );
};

export default Step3;
