import { useState, useCallback } from 'react';
import { ArrowLeft, Check, CheckCircle, Copy, Info, X } from 'lucide-react';
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
            <span className="text-xs font-semibold text-[#515f78]">2/3</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
            <X className="text-[#515f78]" size={24} />
          </button>
        </div>
        <div className="w-full bg-[#e6e8ea] h-1">
          <div className="h-full rounded-full bg-[#2dbc8b] transition-all duration-500" style={{ width: '66%' }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-[1200px] mx-auto w-full space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-[#0a192f]">{MESSAGES.step2.title}</h2>
          <p className="text-sm text-[#515f78]">{MESSAGES.step2.subtitle}</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-4 border-l-4 border-[#2dbc8b] hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center text-sm">1</div>
            <h3 className="text-base font-semibold text-[#0a192f]">{MESSAGES.step2.steps[0].title}</h3>
          </div>
          <p className="text-sm text-[#515f78] mb-3">{MESSAGES.step2.steps[0].description}</p>
          <div className="relative group">
            <div className="bg-[#f1f5f9] p-3 rounded-lg font-mono text-xs text-[#3d4a43] break-all leading-relaxed h-32 overflow-y-auto border border-[#bccac0]">
              {bankEmailsString}
            </div>
            <button
              onClick={handleCopy}
              className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#2dbc8b] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:scale-105 transition-transform"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? MESSAGES.step2.copiedButton : MESSAGES.step2.steps[0].buttonText}
            </button>
          </div>
        </div>

        <div className="bg-[#d2e0fe]/30 p-4 rounded-xl border border-[#d2e0fe]">
          <div className="flex gap-3">
            <Info className="text-[#006c4d] flex-shrink-0 mt-1" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#0a192f]">{MESSAGES.step2.celularNote}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-4 border-l-4 border-[#2dbc8b] hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center text-sm">2</div>
            <h3 className="text-base font-semibold text-[#0a192f]">{MESSAGES.step2.steps[1].title}</h3>
          </div>
          <ul className="space-y-2 mb-3 text-sm text-[#3d4a43]">
            {MESSAGES.step2.steps[1].instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="text-[#2dbc8b] mt-0.5 flex-shrink-0" size={18} />
                <span dangerouslySetInnerHTML={{ __html: inst.replace('⚙️', '<span class="bg-[#f1f5f9] px-1 rounded">⚙️</span>') }} />
              </li>
            ))}
          </ul>
          <img className="rounded border w-full" src="/tutorial/2/screen1.png" alt="Configuración Gmail" />
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-4 border-l-4 border-[#2dbc8b] hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center text-sm">3</div>
            <h3 className="text-base font-semibold text-[#0a192f]">{MESSAGES.step2.steps[2].title}</h3>
          </div>
          <ul className="space-y-2 mb-3 text-sm text-[#3d4a43]">
            {MESSAGES.step2.steps[2].instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="text-[#2dbc8b] mt-0.5 flex-shrink-0" size={18} />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
          <img className="rounded border w-full" src="/tutorial/2/screen2.png" alt="Crear filtro" />
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-4 border-l-4 border-[#2dbc8b] hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center text-sm">4</div>
            <h3 className="text-base font-semibold text-[#0a192f]">{MESSAGES.step2.steps[3].title}</h3>
          </div>
          <p className="text-sm text-[#515f78] mb-3">{MESSAGES.step2.steps[3].description}</p>
          <img className="rounded border w-full" src="/tutorial/2/screen3.png" alt="Pegar direcciones" />
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-4 border-l-4 border-[#2dbc8b] hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center text-sm">5</div>
            <h3 className="text-base font-semibold text-[#0a192f]">{MESSAGES.step2.steps[4].title}</h3>
          </div>
          <p className="text-sm text-[#515f78] mb-3">{MESSAGES.step2.steps[4].description}</p>
          <img className="rounded border w-full" src="/tutorial/2/screen4.png" alt="Reenviar filtro" />
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
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-8 py-3 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">Siguiente</span>
          <ArrowLeft size={20} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
};

export default Step2;
