import { useState } from 'react';
import { ArrowLeft, Check, Copy, Eye, Settings, Shield, X } from 'lucide-react';
import Stepper from './Stepper';
import { FORWARD_EMAIL, TUTORIAL_CONFIG } from './tutorialConfig';

const Step1 = ({ emailData, onNext, onOpcional, onBack, onClose }) => {
  const [copied, setCopied] = useState(false);
  const reenvioEmail = emailData?.email || FORWARD_EMAIL;
  const { MESSAGES } = TUTORIAL_CONFIG;

  const handleCopy = () => {
    navigator.clipboard.writeText(reenvioEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <Stepper current={1} />

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-2xl mx-auto w-full">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-[#0a192f]">
            {MESSAGES.step1.title}
            <div className="inline-flex items-center gap-2 bg-[#f1f5f9] px-3 py-1 rounded-lg border border-[#bccac0]/30 mx-2">
              <span className="text-[#2dbc8b] font-bold text-sm">{reenvioEmail}</span>
              <button onClick={handleCopy} className="text-[#006c4d] hover:text-[#2dbc8b] transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#515f78]">
            <Eye size={18} />
            <p className="text-sm">{MESSAGES.step1.instruction}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#2dbc8b]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                <p className="text-sm text-[#191c1e]">
                  Clic en el icono de menú <Settings className="inline text-[#515f78]" size={18} />
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                <p className="text-sm text-[#191c1e]">Clic en "Ver toda la configuración"</p>
              </div>
              <img className="w-full rounded-lg border" src="/tutorial/1/screen1.png" alt="Configuración de Gmail" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#2dbc8b]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                <p className="text-sm text-[#191c1e]">Clic en pestaña "Reenvío y correo POP/IMAP"</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
                <p className="text-sm text-[#191c1e]">Clic en "Agregar una dirección de reenvío"</p>
              </div>
              <img className="w-full rounded-lg border" src="/tutorial/1/screen2.png" alt="Reenvío Gmail" />
            </div>
          </div>
        </div>

        <button
          onClick={onOpcional}
          className="w-full mt-4 p-3 bg-[#d2e0fe] border border-[#d2e0fe] rounded-xl flex items-center justify-center gap-3 text-[#55637d] hover:bg-[#d2e0fe]/50 transition-all"
        >
          <Shield size={18} />
          <p className="font-semibold text-xs">{MESSAGES.step1.opcionalButton}</p>
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
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
          <span className="text-sm font-semibold">Siguiente</span>
          <ArrowLeft size={20} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
};

export default Step1;
