import { ArrowLeft, ArrowRight, ShieldCheck, Smartphone, Laptop, Info, Settings, X } from 'lucide-react';

const StepOpcional = ({ emailData, onNext, onBack, onClose }) => {
  const reenvioEmail = emailData?.email || 'inbox@adaptaweb.cl';

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col">
      <header className="bg-[#f7f9fb] fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 shadow-none">
        <button onClick={onBack} className="text-[#006c4d] active:opacity-80 active:scale-95 transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">Kuentas Klaras</h1>
        <button onClick={onClose} className="text-[#515f78] active:opacity-80 active:scale-95 transition-all">
          <X size={24} />
        </button>
      </header>

      <main className="flex-grow pt-20 pb-32 px-4 max-w-[600px] mx-auto w-full">
        <section className="mb-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <ShieldCheck className="text-[#2dbc8b]" size={24} fill="currentColor" />
            <span className="text-[14px] leading-5 font-semibold text-[#2dbc8b] uppercase tracking-wider">Tutorial Paso 1.5</span>
          </div>
          <h2 className="text-[24px] leading-8 font-semibold text-[#0a192f] mb-2">Verificación de Seguridad (Opcional)</h2>
          <p className="text-[16px] leading-6 text-[#515f78]">Realiza estos pasos solo si Gmail te solicita una confirmación adicional.</p>
        </section>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
              <div className="flex-grow">
                <p className="text-[14px] leading-5 font-semibold text-[#0a192f] mb-2">Clic en "Siguiente" en la ventana de verificación de Google.</p>
                <div className="rounded-lg overflow-hidden border border-[#f1f5f9]">
                  <img className="w-full h-auto" src="/tutorial/opcional/screen.png" alt="Verificación Google" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-[14px] leading-5 font-semibold text-[#0a192f]">En tu celular, presiona "Sí, soy yo" en la notificación que recibas.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-[14px] leading-5 font-semibold text-[#0a192f]">Selecciona el número que aparece en la pantalla de tu computador.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-[#f1f5f9] rounded-lg p-2 flex flex-col items-center">
                  <Smartphone className="text-[#2dbc8b] mb-1" size={24} />
                  <span className="text-[10px] font-bold text-[#515f78] uppercase">Celular</span>
                </div>
                <div className="bg-[#f1f5f9] rounded-lg p-2 flex flex-col items-center">
                  <Laptop className="text-[#2dbc8b] mb-1" size={24} />
                  <span className="text-[10px] font-bold text-[#515f78] uppercase">Computador</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">4</div>
              <div className="flex-grow">
                <p className="text-[14px] leading-5 font-semibold text-[#0a192f] mb-2">Clic en "Continuar" y luego en "Aceptar" para confirmar el reenvío.</p>
                <div className="bg-[#6de0b3]/5 border border-[#6de0b3]/20 rounded-lg p-2 text-center mb-2">
                  <code className="text-[#2dbc8b] font-bold">{reenvioEmail}</code>
                </div>
                <p className="text-[12px] leading-tight italic text-[#39475f]">
                  Asegúrate de que la dirección sea exactamente la indicada arriba.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.08)] border border-[#6de0b3]/10">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">5</div>
                <div className="flex-grow">
                  <p className="text-[14px] leading-5 font-semibold text-[#0a192f]">Vuelve a la sección "Reenvío y correo POP/IMAP" en los ajustes de Gmail.</p>
                  <div className="flex items-center gap-1 mt-1 text-[#2dbc8b]">
                    <Settings size={18} />
                    <span className="text-[12px] font-medium">Configuración</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 border-t border-[#f1f5f9] pt-4">
                <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white font-bold flex items-center justify-center flex-shrink-0">6</div>
                <div className="flex-grow">
                  <p className="text-[14px] leading-5 font-semibold text-[#0a192f]">Verifica que la opción esté seleccionada y guarda los cambios.</p>
                  <div className="mt-2 rounded-lg border border-[#2dbc8b]/30 p-2 bg-[#6de0b3]/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#2dbc8b] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#2dbc8b]"></div>
                      </div>
                      <span className="text-[12px] text-[#0a192f]">Reenviar una copia a...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#0d1c32]/5 rounded-xl p-4 flex gap-2 border border-[#515f78]/10">
          <Info className="text-[#515f78] flex-shrink-0 mt-0.5" size={20} fill="currentColor" />
          <p className="text-[13px] text-[#515f78]">
            Si no ves la ventana de Google, puedes saltar este paso y continuar directamente a la Parte 2.
          </p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-between items-center px-4 py-4 bg-[#f7f9fb] z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(10,25,47,0.1)]">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 hover:bg-[#6de0b3]/10 active:scale-[0.98] transition-transform">
          <ArrowLeft size={24} className="mb-1" />
          <span className="text-[14px] leading-5 font-semibold">Volver</span>
        </button>
        <button onClick={onNext} className="flex flex-col items-center justify-center bg-[#2dbc8b] text-white rounded-xl px-8 py-2 shadow-lg active:scale-95 transition-transform">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-5 font-semibold">Listo, continuar a la Parte 2</span>
            <ArrowRight size={24} />
          </div>
        </button>
      </nav>
    </div>
  );
};

export default StepOpcional;
