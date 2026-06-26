import { ArrowRight, Landmark, Mail, Lock, X } from 'lucide-react';
import { APP_NAME, TUTORIAL_CONFIG } from './tutorialConfig';

const Welcome = ({ onNext, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 h-14 flex justify-between items-center px-4 border-b border-[#f1f5f9]">
        <div className="w-10" />
        <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
          <X className="text-[#515f78]" size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-[1200px] mx-auto w-full">
        <section className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4">
          <div className="relative w-48 h-48 mb-4 animate-float flex items-center justify-center">
            <div className="absolute inset-0 bg-[#6de0b3]/10 rounded-full blur-3xl" />
            <div className="z-10 w-62 h-62 flex items-center justify-center rounded-full ">
              <img src="/kuentasklaras-logo.svg" alt={APP_NAME} className="w-30 h-30" />
               <h1 className="text-2xl font-bold text-[#2dbc8b] tracking-tight">{APP_NAME}</h1>
            </div>

          </div>
          <h1 className="text-base md:text-xl font-bold text-[#0a192f] max-w-xl leading-tight">
            {MESSAGES.welcome.title}
          </h1>
          <p className="text-base text-[#515f78] opacity-70">{MESSAGES.welcome.subtitle}</p>
        </section>

        <section className="w-full py-8 space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-xl font-semibold text-[#0a192f]">{MESSAGES.welcome.howItWorksTitle}</h2>
            <div className="flex justify-center items-center gap-2">
              <div className="w-8 h-1 bg-[#2dbc8b] rounded-full" />
              <div className="w-2 h-1 bg-[#6de0b3]/30 rounded-full" />
            </div>
          </div>

          <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#6de0b3]/20 flex items-center justify-center bg-white">
                <Landmark className="text-[#2dbc8b]" size={28} />
              </div>
              <span className="text-sm font-semibold mt-2">Banco</span>
            </div>
            <ArrowRight className="text-[#6de0b3]/40 hidden md:block" size={24} />
            <ArrowRight className="text-[#6de0b3]/40 md:hidden rotate-90" size={24} />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#6de0b3]/20 flex items-center justify-center bg-white">
                <Mail className="text-[#2dbc8b]" size={28} />
              </div>
              <span className="text-sm font-semibold mt-2">Email</span>
            </div>
            <ArrowRight className="text-[#6de0b3]/40 hidden md:block" size={24} />
            <ArrowRight className="text-[#6de0b3]/40 md:hidden rotate-90" size={24} />
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-1 -right-1 bg-[#6de0b3] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">AI</div>
              <div className="w-16 h-16 rounded-full bg-[#2dbc8b] flex items-center justify-center shadow-xl">
                <svg className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold mt-2">{APP_NAME}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f1f5f9] max-w-2xl mx-auto space-y-4">
            <p className="text-base text-[#515f78]">
              Crearás una <strong className="text-[#2dbc8b] font-semibold">regla automática en tu correo</strong> para{' '}
              <strong className="text-[#2dbc8b] font-semibold">reenviar</strong> a {APP_NAME}{' '}
              <span className="underline decoration-[#6de0b3] underline-offset-4">sólo los correos bancarios</span>.
            </p>
            <div className="h-px bg-[#f1f5f9] w-full" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="text-[#2dbc8b]" size={20} />
                <h3 className="text-lg font-semibold text-[#0a192f]">{MESSAGES.welcome.securityTitle}</h3>
              </div>
              <ul className="space-y-2 text-[#515f78] text-sm">
                {MESSAGES.welcome.securityPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-[#2dbc8b] font-bold">{idx + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="pt-2 text-center text-xs text-[#0a192f]/60 italic">
              {MESSAGES.welcome.privacyNote}
            </p>
          </div>
        </section>

        <div className="flex items-center justify-center gap-4 max-w-xl mx-auto py-4">
          <img
            src="/tutorial/welcome/founder.png"
            alt={MESSAGES.welcome.founderName}
            className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-[#0a192f]">{MESSAGES.welcome.founderName}</p>
            <p className="text-xs text-[#515f78] uppercase tracking-widest font-bold">{MESSAGES.welcome.founderRole}</p>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 flex justify-center px-4 py-3 border-t border-[#f1f5f9]">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-8 py-3 rounded-xl shadow hover:brightness-110 transition-all"
        >
          <span className="text-sm font-semibold">{MESSAGES.welcome.ctaButton}</span>
          <ArrowRight size={20} />
        </button>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
