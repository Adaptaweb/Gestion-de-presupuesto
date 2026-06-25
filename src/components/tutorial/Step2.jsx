import { useState, useCallback } from 'react';
import { ArrowLeft, Check, Copy, X } from 'lucide-react';
import Stepper from './Stepper';
import { TUTORIAL_CONFIG, getBankEmailsString } from './tutorialConfig';

const Step2 = ({ emailData, onNext, onBack, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { MESSAGES } = TUTORIAL_CONFIG;
  const bankEmailsString = getBankEmailsString();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(bankEmailsString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [bankEmailsString]);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 h-14 flex justify-between items-center px-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
              <ArrowLeft className="text-[#006c4d]" size={24} />
            </button>
          )}
          <img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="w-6 h-6" />
          <span className="font-bold text-[#0a192f]">Kuentas Klaras</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
          <X className="text-[#515f78]" size={24} />
        </button>
      </header>

      <Stepper current={2} />

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-2xl mx-auto w-full space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#0a192f]">{MESSAGES.step2.title}</h2>
          <p className="text-sm text-[#515f78] mt-1">
            {MESSAGES.step2.subtitle}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#2dbc8b]">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="text-base font-semibold text-[#0a192f]">
              {MESSAGES.step2.steps[0].title}
            </h3>
          </div>
          <p className="text-[#515f78] mb-3 text-sm">
            {MESSAGES.step2.steps[0].description}
          </p>
          <div className="bg-[#f1f5f9] p-3 rounded-lg font-mono text-xs text-[#3d4a43] h-24 overflow-y-auto border border-[#bccac0] mb-3">
            {bankEmailsString}
          </div>
          <button
            onClick={handleCopy}
            className="bg-[#2dbc8b] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow hover:scale-105 transition-transform"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? MESSAGES.step2.copiedButton : MESSAGES.step2.steps[0].buttonText}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#2dbc8b]">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <h3 className="text-base font-semibold text-[#0a192f]">
              {MESSAGES.step2.steps[1].title}
            </h3>
          </div>
          <p className="mb-3 text-sm text-[#515f78]">
            {MESSAGES.step2.steps[1].description}
          </p>
          <img className="rounded border w-full" src="/tutorial/2/screen1.png" alt="Configuración Gmail" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#2dbc8b]">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <h3 className="text-base font-semibold text-[#0a192f]">
              {MESSAGES.step2.steps[2].title}
            </h3>
          </div>
          <p className="mb-3 text-sm text-[#515f78]">
            {MESSAGES.step2.steps[2].description}
          </p>
          <img className="rounded border w-full" src="/tutorial/2/screen2.png" alt="Crear filtro Gmail" />
        </div>
      </main>

      <footer className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-t border-[#f1f5f9]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#515f78] px-4 py-2 rounded-lg hover:bg-[#6de0b3]/10 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Anterior</span>
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-6 py-2 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">Finalizar Paso 2</span>
          <ArrowLeft size={20} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
};

export default Step2;
