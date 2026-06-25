import { ArrowLeft, ArrowRight, CheckCircle, Eye, Settings, Shield, X } from 'lucide-react';

const Step1 = ({ emailData, onNext, onOpcional, onClose }) => {
  const reenvioEmail = emailData?.email || 'inbox@adaptaweb.cl';

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb] h-16 flex justify-between items-center px-4 md:px-10">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
            <ArrowLeft className="text-[#006c4d]" size={24} />
          </button>
          <h1 className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">Kuentas Klaras</h1>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
          <X className="text-[#515f78]" size={24} />
        </button>
      </header>

      <main className="flex-grow pt-20 pb-32 px-4 md:px-10 max-w-[1200px] mx-auto w-full">
        <section className="mb-8 flex flex-col items-center">
          <div className="flex items-center w-full max-w-md gap-0 relative h-10">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e0e3e5] -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 w-1/4 h-[2px] bg-[#2dbc8b] -translate-y-1/2"></div>
            <div className="relative z-10 flex justify-between w-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                  <CheckCircle className="text-white" size={18} fill="white" />
                </div>
                <span className="text-[12px] leading-4 font-medium text-[#2dbc8b] mt-1">Inicio</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#6de0b3]/30 flex items-center justify-center text-[#2dbc8b] ring-4 ring-white">
                  <span className="font-bold text-[14px]">1</span>
                </div>
                <span className="text-[12px] leading-4 font-medium text-[#515f78] mt-1">Vinculación</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#515f78] ring-4 ring-white">
                  <span className="font-bold text-[14px]">2</span>
                </div>
                <span className="text-[12px] leading-4 font-medium text-[#515f78] mt-1">Verificación</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#515f78] ring-4 ring-white">
                  <span className="font-bold text-[14px]">3</span>
                </div>
                <span className="text-[12px] leading-4 font-medium text-[#515f78] mt-1">Final</span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[14px] leading-5 font-semibold text-[#006c4d] uppercase tracking-widest">Parte 1</p>
            <h2 className="text-[24px] leading-8 font-semibold text-[#0a192f]">
              Agregar dirección <span className="text-[#2dbc8b]">{reenvioEmail}</span> a tu correo
            </h2>
            <div className="flex items-center justify-center gap-2 py-2 text-[#515f78]">
              <Eye size={20} />
              <p className="text-[16px] leading-6">Debes abrir tu E-mail en un computador 💻*</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-6 flex flex-col gap-4 hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
              <div className="flex gap-4 items-start">
                <div className="bg-[#2dbc8b] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <p className="text-[16px] leading-6 text-[#191c1e]">Clic en el icono del menú <Settings className="inline text-[#515f78]" size={20} /></p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-[#2dbc8b] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <p className="text-[16px] leading-6 text-[#191c1e]">Clic en "Ver toda la configuración/Ajustes"</p>
              </div>
              <div className="mt-auto border border-[#e0e3e5] rounded-xl overflow-hidden shadow-inner">
                <img className="w-full h-auto object-cover" src="/tutorial/1/screen.png" alt="Configuración de Gmail" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-6 flex flex-col gap-4 hover:shadow-[0_8px_24px_rgba(10,25,47,0.1)] hover:-translate-y-0.5 transition-all">
              <div className="flex gap-4 items-start">
                <div className="bg-[#2dbc8b] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <p className="text-[16px] leading-6 text-[#191c1e]">Clic en pestaña "Reenvío y correo POP/IMAP"</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-[#2dbc8b] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <p className="text-[16px] leading-6 text-[#191c1e]">Clic en "Agregar una dirección de reenvío"</p>
              </div>
              <div className="mt-auto border border-[#e0e3e5] rounded-xl overflow-hidden shadow-inner">
                <img className="w-full h-auto object-cover" src="/tutorial/1/screen2.png" alt="Reenvío Gmail" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] p-6 border-l-4 border-[#2dbc8b]">
            <div className="flex gap-4 items-start">
              <div className="bg-[#2dbc8b] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">5</div>
              <div className="space-y-2 flex-grow">
                <p className="text-[24px] leading-8 font-semibold text-[#0a192f]">Escribe "<span className="text-[#2dbc8b] select-all">{reenvioEmail}</span>"</p>
                <p className="text-[16px] leading-6 text-[#515f78]">Asegúrate de copiarla exactamente como aparece aquí para una integración transparente.</p>
                <div className="mt-4 bg-[#f1f5f9] p-4 rounded-xl border border-[#bccac0]/30 overflow-hidden">
                  <img className="w-full h-auto rounded-lg" src="/tutorial/1/screen3.png" alt="Ingresar dirección de reenvío" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={onOpcional}
              className="w-full py-4 px-6 border-2 border-[#2dbc8b] text-[#2dbc8b] text-[14px] leading-5 font-semibold rounded-lg hover:bg-[#6de0b3]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              <span>Si gmail te solicita autorización presiona aca</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full flex justify-between items-center px-4 py-4 bg-[#f7f9fb] rounded-t-xl z-50 shadow-[0_-4px_12px_rgba(10,25,47,0.1)]">
        <div className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 rounded-xl opacity-50">
          <ArrowLeft size={24} />
          <span className="text-[14px] leading-5 font-semibold">Anterior</span>
        </div>
        <button
          onClick={onNext}
          className="flex flex-col items-center justify-center bg-[#2dbc8b] text-white rounded-xl px-8 py-2 shadow-lg shadow-[#2dbc8b]/20 hover:bg-[#006c4d] transition-all active:scale-[0.98]"
        >
          <ArrowRight size={24} />
          <span className="text-[14px] leading-5 font-semibold">Siguiente</span>
        </button>
      </footer>
    </div>
  );
};

export default Step1;
