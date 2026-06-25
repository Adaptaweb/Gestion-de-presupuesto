import { ArrowRight, Landmark, Mail, Lock } from 'lucide-react';
import { APP_NAME, TUTORIAL_CONFIG } from './tutorialConfig';

const StepInicio = ({ onNext, onClose }) => {
  const { MESSAGES } = TUTORIAL_CONFIG;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 h-14 flex justify-center items-center border-b border-[#f1f5f9]">
        <h1 className="text-xl font-bold text-[#0a192f] tracking-tight">{APP_NAME}</h1>
      </header>

      <main className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto px-4 py-6 flex flex-col items-center">
        <section className="flex flex-col items-center justify-center text-center w-full max-w-2xl space-y-4">
          <div className="relative w-full aspect-square max-w-[200px] mb-4 animate-float flex items-center justify-center">
            <div className="absolute inset-0 bg-[#6de0b3]/10 rounded-full blur-3xl" />
            <div className="z-10 w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-lg">
              <div className="text-center font-bold text-[#2dbc8b] text-lg">
                {APP_NAME.split(' ').map((word, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0a192f] max-w-xl leading-tight">
            {MESSAGES.welcome.title}
          </h1>
          <p className="text-base text-[#515f78] opacity-70">{MESSAGES.welcome.subtitle}</p>
        </section>

        <section className="w-full py-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-[#0a192f]">{MESSAGES.welcome.howItWorksTitle}</h2>
            <div className="flex justify-center items-center gap-2">
              <div className="w-8 h-1 bg-[#2dbc8b] rounded-full" />
              <div className="w-2 h-1 bg-[#6de0b3]/30 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
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
          </div>
        </section>
      </main>

      <footer className="flex-shrink-0 flex items-center justify-center px-4 py-4 border-t border-[#f1f5f9]">
        <button
          onClick={onNext}
          className="flex items-center justify-center bg-[#2dbc8b] text-white rounded-xl py-3 shadow-lg hover:bg-[#006c4d] transition-all active:scale-98 w-full max-w-md"
        >
          <span className="text-base font-semibold">{MESSAGES.welcome.ctaButton}</span>
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

export default StepInicio;
