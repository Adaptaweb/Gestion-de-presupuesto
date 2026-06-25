import { ArrowLeft, ArrowRight, ShieldCheck, Check, AlertCircle, ArrowRight as ArrowRightAlt, X } from 'lucide-react';

const Step3 = ({ onNext, onBack, onClose }) => {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center">
      <header className="bg-[#f7f9fb] fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16">
        <button onClick={onBack} className="text-[#006c4d] hover:bg-[#f1f5f9] p-2 rounded-full transition-all active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">Kuentas Klaras</h1>
        <button onClick={onClose} className="text-[#515f78] hover:bg-[#f1f5f9] p-2 rounded-full transition-all active:scale-95">
          <X size={24} />
        </button>
      </header>

      <main className="mt-20 w-full max-w-[600px] px-4 flex flex-col gap-6 pb-32">
        <div className="flex items-center justify-between px-4 py-2 mb-4">
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white font-bold">
                <Check size={18} />
              </div>
              <div className="h-[2px] w-8 bg-[#2dbc8b]"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white font-bold">
                <Check size={18} />
              </div>
              <div className="h-[2px] w-8 bg-[#2dbc8b]"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 rounded-full border-2 border-[#2dbc8b] flex items-center justify-center bg-white shadow-md">
                <span className="text-[#2dbc8b] font-bold text-lg">3</span>
              </div>
              <div className="h-[2px] w-8 bg-[#6de0b3]/30"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#6de0b3]/30 flex items-center justify-center text-[#39475f] font-bold">
              <span className="text-sm">4</span>
            </div>
          </div>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[#2dbc8b]">
            <ShieldCheck size={24} />
            <span className="text-[14px] leading-5 font-semibold uppercase tracking-wider">Paso 3 de 4</span>
          </div>
          <h2 className="text-[28px] leading-9 font-bold text-[#0a192f]">Verifica que eres tú con Google</h2>
          <p className="text-[16px] leading-6 text-[#515f78] leading-relaxed">
            Necesitarás tener tu celular a mano para confirmar que estás realizando esta configuración de forma segura.
          </p>
        </section>

        <div className="bg-white rounded-xl shadow-[0_12px_32px_-4px_rgba(10,25,47,0.08)] p-6 border border-[#e0e3e5] flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6de0b3]/20 flex items-center justify-center text-[#2dbc8b] font-bold">1</div>
            <p className="text-[18px] leading-7 text-[#191c1e]">Clic en <span className="font-bold text-[#2dbc8b]">"Sí, soy yo"</span> en la notificación que recibas.</p>
          </div>
          <div className="flex gap-4 items-start border-t border-[#eceef0] pt-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6de0b3]/20 flex items-center justify-center text-[#2dbc8b] font-bold">2</div>
            <p className="text-[18px] leading-7 text-[#191c1e]">Selecciona el <span className="font-bold text-[#2dbc8b]">número indicado</span> en la pantalla de tu celular.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-[#e6e8ea] shadow-[0_12px_32px_-4px_rgba(10,25,47,0.08)] transition-transform hover:scale-[1.02]">
            <img alt="Guía visual de verificación de Google" className="w-full h-full object-cover" src="/tutorial/3/screen.png" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a192f]/80 to-transparent text-white">
              <p className="text-[12px] leading-4 font-medium opacity-90">Confirma en tu dispositivo principal</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-[#e6e8ea] shadow-[0_12px_32px_-4px_rgba(10,25,47,0.08)] transition-transform hover:scale-[1.02]">
            <img alt="Pasos finales de seguridad en móvil" className="w-full h-full object-cover" src="/tutorial/3/screen2.png" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a192f]/80 to-transparent text-white">
              <p className="text-[12px] leading-4 font-medium opacity-90">Selecciona el código correspondiente</p>
            </div>
          </div>
        </section>

        <div className="bg-[#d2e0fe]/30 border-l-4 border-[#006c4d] p-6 rounded-r-xl flex items-start gap-4">
          <AlertCircle className="text-[#006c4d] flex-shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <p className="text-[14px] leading-5 font-semibold text-[#55637d]">A veces la verificación falla en Safari.</p>
            <a className="inline-flex items-center gap-1 text-[14px] leading-5 font-semibold text-[#006c4d] hover:underline group" href="#">
              Prueba en Chrome
              <ArrowRightAlt size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-between items-center px-4 py-4 bg-[#f7f9fb] shadow-[0_-4px_12px_rgba(10,25,47,0.1)] rounded-t-xl z-50">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 hover:bg-[#6de0b3]/10 rounded-xl transition-all active:scale-[0.98] group">
          <ArrowLeft size={24} />
          <span className="text-[14px] leading-5 font-semibold mt-1">Anterior</span>
        </button>
        <button onClick={onNext} className="flex flex-col items-center justify-center bg-[#2dbc8b] text-white rounded-xl px-8 py-3 shadow-lg shadow-[#2dbc8b]/20 transition-all active:scale-[0.98] group hover:brightness-110">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-5 font-semibold">Siguiente</span>
            <ArrowRight size={24} />
          </div>
        </button>
      </nav>
    </div>
  );
};

export default Step3;
