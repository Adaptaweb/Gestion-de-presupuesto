import { ArrowLeft, Check, Info, Settings, Shield, X } from 'lucide-react';
import { TUTORIAL_CONFIG } from './tutorialConfig';

const StepOpcional = ({ emailData, onNext, onBack, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;
  const steps = MESSAGES.opcional.steps;

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
            <span className="text-xs font-semibold text-[#515f78]">1.5/3</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
            <X className="text-[#515f78]" size={24} />
          </button>
        </div>
        <div className="w-full bg-[#e6e8ea] h-1">
          <div className="h-full rounded-full bg-[#2dbc8b] transition-all duration-500" style={{ width: '33%' }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-[1200px] mx-auto w-full">
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-lg font-semibold text-[#0a192f]">{MESSAGES.opcional.title}</h2>
          <p className="text-sm text-[#515f78]">{MESSAGES.opcional.subtitle}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10 border-l-4 border-l-[#2dbc8b]">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-[#0a192f]">{steps[0]}</p>
                <img className="mt-2 rounded border" src="/tutorial/1-5/screen1.png" alt="Verificación Google" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10 border-l-4 border-l-[#2dbc8b]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-sm font-semibold text-[#0a192f]">{steps[1]}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-sm font-semibold text-[#0a192f]">{steps[2]}</p>
              </div>
              <img className="mt-2 rounded border" src="/tutorial/1-5/screen2.png" alt="Seleccionar número" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10 border-l-4 border-l-[#2dbc8b]">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">4</div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-[#0a192f]">{steps[3]}</p>
                <div className="mt-2 bg-[#6de0b3]/5 border border-[#6de0b3]/20 rounded-lg p-2 text-center">
                  <code className="text-[#2dbc8b] font-bold text-sm">inbox@adaptaweb.cl</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10 border-l-4 border-l-[#2dbc8b]">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-[#0a192f]">{steps[4]}</p>
                  <div className="flex items-center gap-1 mt-1 text-[#2dbc8b]">
                    <Settings size={16} />
                    <span className="text-xs font-medium">Configuración</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 border-t border-[#f1f5f9] pt-3">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-[#0a192f]">{steps[5]}</p>
                  <div className="mt-2 rounded-lg border border-[#2dbc8b]/30 p-2 bg-[#6de0b3]/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#2dbc8b] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#2dbc8b]" />
                      </div>
                      <span className="text-xs text-[#0a192f]">Reenviar una copia a...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#d2e0fe]/50 rounded-xl p-3 flex gap-2 border border-[#d2e0fe] border-l-4 border-l-[#2dbc8b]">
          <Info className="text-[#515f78] flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-[#515f78]">{MESSAGES.opcional.skipNote}</p>
        </div>
      </main>

      <footer className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-t border-[#f1f5f9]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#515f78] px-4 py-2 rounded-lg hover:bg-[#6de0b3]/10 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Volver</span>
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-8 py-3 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">{MESSAGES.opcional.nextButton}</span>
          <ArrowLeft size={20} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
};

export default StepOpcional;
