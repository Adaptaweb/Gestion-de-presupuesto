import { ArrowLeft, Info, Shield, X } from 'lucide-react';
import Stepper from './Stepper';
import { TUTORIAL_CONFIG } from './tutorialConfig';

const StepOpcional = ({ emailData, onNext, onBack, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;
  const steps = MESSAGES.opcional.steps;

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
          <span className="font-bold text-[#0a192f]">Verificación</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
          <X className="text-[#515f78]" size={24} />
        </button>
      </header>

      <Stepper current={1} />

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-2xl mx-auto w-full">
        <section className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-[#2dbc8b]" size={20} />
            <span className="text-xs font-semibold text-[#2dbc8b] uppercase tracking-wider">
              Verificación de Seguridad
            </span>
          </div>
          <h2 className="text-lg font-semibold text-[#0a192f]">{MESSAGES.opcional.title}</h2>
          <p className="text-sm text-[#515f78]">{MESSAGES.opcional.subtitle}</p>
        </section>

        <div className="space-y-3">
          {steps.map((stepText, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-3 shadow-sm border border-[#6de0b3]/10 border-l-4 border-l-[#2dbc8b]"
            >
              <div className="flex gap-3">
                <div className="bg-[#2dbc8b] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-[#0a192f]">{stepText}</p>
                  {idx === 0 && (
                    <img className="mt-2 rounded border" src="/tutorial/1-5/screen1.png" alt="Verificación Google" />
                  )}
                  {idx === 2 && (
                    <img className="mt-2 rounded border" src="/tutorial/1-5/screen2.png" alt="Seleccionar número" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[#d2e0fe]/50 rounded-xl p-3 flex gap-2 border border-[#d2e0fe]">
          <Info className="text-[#515f78] flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-[#515f78]">
            Si no ves la ventana de Google, puedes saltar este paso y continuar directamente a la Parte 2.
          </p>
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
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-5 py-2 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">{MESSAGES.opcional.nextButton}</span>
          <ArrowLeft size={20} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
};

export default StepOpcional;
